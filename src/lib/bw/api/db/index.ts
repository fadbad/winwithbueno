import Prisma from '@prisma/client'
import _ from 'lodash'
import { hashPWD, generate_token, random_sms_token, getUrlQuery, S3_URL, avatar, toCsv } from "../utils"

import Logger from '../logger'
export * from './auth'

export const db = new Prisma.PrismaClient({
    log: [
        // {emit: 'stdout', level: 'query'},
        {emit: 'event', level: 'error'},
        {emit: 'event', level: 'warn'},
        {emit: 'event', level: 'info'},
    ]
})

db.$on('error', e => Logger.log({level: 'error', ...e}))
db.$on('warn', e => Logger.log({level: 'warn', ...e}))


db.$use(async (params, next) => {
    // if (params.model === 'User') 
    if (params.action === 'create' || params.action === 'update') {
        params.args.data = _.omit(params.args.data, ['id', 'token', '__lang'])

        if (params.args.data.password) {
            params.args.data.password = hashPWD(params.args.data.password)
        }

        if (params.action === 'create'){
            if (params.args.data.password) {
                params.args.data.token = generate_token()
                params.args.data.token_sms = random_sms_token()
            }
        }
    }
    return next(params)
})

export const __res = {
    success: (payload = {}): any => ({
        status: 200,
        body: {
            ok: true,
            result: 'success',
            ...payload
        }
    }),
    created: (payload = {}): any => ({
        status: 201,
        body: {
            ok: true,
            result: 'success',
            ...payload
        }
    }),
    reject: (message = 'unauthorized', payload = {}): any => ({
        // status: 401,
        status: 200,
        body: {
            ok: false,
            result: 'error',
            message,
            ...payload
        }
    }),
    error: (error, payload = {}): any => ({
        // status: 405,
        status: 200,
        body: {
            ok: false,
            result: 'error',
            message: error?.name || 'Error Occured!',
		    frame: error?.frame,
            stack: error?.stack,
            error,
            ...payload
        }
    })
}

export const middleware: any = async (locals, query) => {
    try {
        const token = locals.token ?? ''
        if(!token) throw new Error("unauthorized");
        const item = await query.findFirst({ where: { token }})
        if(!item) throw new Error("unauthorized");
        return item
    } catch (error) {
        throw new Error(error);
    }
}

const s3Url = str => str ? S3_URL(str) : ''

const mapItem = (item, hide, inject) => {
    if(typeof item.image !== 'undefined' && typeof item.name !== 'undefined'){
        item.avatar = s3Url(item.image) || avatar(item.name)
    }

    if(typeof item.name !== 'undefined'){
        item.baseAvatar = avatar(item.name)
    }

    if(typeof item.image !== 'undefined') item.imageUrl = s3Url(item.image)
    if(typeof item.cover !== 'undefined') item.coverUrl = s3Url(item.cover)
    if(typeof item.idcard !== 'undefined') item.idcardUrl = s3Url(item.idcard)
    if(typeof item.video !== 'undefined') item.videoUrl = s3Url(item.video)

    Object.keys(item).forEach(key => {
        hide.forEach( hid => (key === hid) && delete item[key] )
        
        // check for includes
        if (typeof item[key] === 'object' && item[key]?.id){
            item[key] = mapItem(item[key], hide, inject)
        }
    })

    if(inject && typeof inject === 'function') {
        item = inject(item)
    }
    
    return item
}

export const dbMapper = (data, hide = [], inject = null) => {
    hide = [...hide, 'password']

    if(Array.isArray(data)){
        return data.map((item) => {
            return mapItem(item, hide, inject)
        })
    } else {
        return mapItem(data, hide, inject)
    }
}

export const paginate_skip = (page: any = 1, per_page: any = 20) => {
    page = page ? parseInt(page) : 1
    return parseInt(per_page) * (page - 1)
}

export const paginateQuery = async ({
    url, 
    query, 
    searchable = [], 
    relations = [],
    include = null,
    filters = {}, 
    hide = [], 
    mapper = null, 
    take = 20,
    searchableRelations = {},
    extra = {},
    where = {},
    countRelations = [],
}) => {
    let {
        search = '', page = 1, orderBy = 'createdAt', order = 'desc', date_range
    } = getUrlQuery(url)

    return paginate({ 
        query, 
        search, page, orderBy, order, date_range,
        searchable, 
        relations,
        include,
        filters, 
        hide, 
        mapper, 
        take,
        searchableRelations,
        extra,
        where,
        countRelations,
    })
}

export const paginate = async ({
    query, 
    search = '',
    page = 1,
    orderBy = 'createdAt',
    order = 'desc',
    date_range = null,
    searchable = [], 
    relations = [],
    include = null,
    filters = {}, 
    hide = [], 
    mapper = null, 
    take = 20,
    searchableRelations = {},
    extra = {},
    where = {},
    countRelations = [],
}) => {

    page = Number(page)
    take = Number(take)

    const q: any = {
        orderBy: { [orderBy]: order }
    }

    const _where: any = {...where}

    if(search){
        if(search === 'verified'){
            _where.verified = { equals: true }
        } else if (search === 'unverified'){
            _where.verified = { equals: false }
        } else if (search === 'paid'){
            _where.paid = { equals: true }
        } else if (search === 'unpaid'){
            _where.paid = { equals: false }
        } else if (search === 'confirmed'){
            _where.confirmed = { equals: true }
        } else if (search === 'unconfirmed'){
            _where.confirmed = { equals: false }
        } else {
            _where.OR = [];
            searchable.forEach(s => {
                _where.OR.push({
                    [s]: {contains: search}
                })
            })
            if(!_.isEmpty(searchableRelations)){
                Object.keys(searchableRelations).forEach(key => {
                    const arr = searchableRelations[key]
                    arr.forEach(s => {
                        _where.OR.push({
                            [key]: {
                                [s]: {contains: search}
                            }
                        })
                    })
                })
            }
        }
    }
    
    if(date_range && date_range.includes('to')) {
        const dates = date_range.split(' to ')
        _where.createdAt = {
            gte: new Date(dates[0]),
            lt: new Date(dates[1])
        }
    }

    if(_where) q.where = where
    if(filters) q.where = {..._where, ...filters}

    if(_.isEmpty(q._where)) delete q._where

    const skip = take * (page - 1)
    const total = await query.count(q)

    if(include) q.include = {...include}
    if(relations.length > 0) q.relations = relations

    if(countRelations.length > 0){
        const counts = {}
        countRelations.forEach(i => counts[i] = true)
        q.include = {...q?.include, _count: { select: counts } }
    }

    let data = await query.findMany({
        ...q,
        ...extra,
        take,
        skip,
    })

    const from = data.length > 0 ? (page - 1) * take + 1 : null
    const to = data.length > 0 ? from + data.length - 1 : null
    const last_page = Math.max(Math.ceil(total / take), 1)

    data = dbMapper(data, hide )
    if(mapper) data = await mapper(data)

    return {
        total,
        per_page: take,
        current_page: page,
        last_page,
        from,
        to,
        data,
    }
}

export const paginateBase = ({
    data,
    total,
    take = 20,
    page = 1
}) => {
    page = Number(page)
    take = Number(take)
    const from = data.length > 0 ? (page - 1) * take + 1 : null
    const to = data.length > 0 ? from + data.length - 1 : null
    const last_page = Math.max(Math.ceil(total / take), 1)
    
    return {
        total,
        per_page: take,
        current_page: page,
        last_page,
        from,
        to,
        data
    }
}

export const dbExporter = async (url, data, name = 'export') => {
    let { token } = getUrlQuery(url)

    await middleware({ token }, db.admin)

    data = dbMapper(data)
    data = toCsv(data)

    const BOM = "\uFEFF"; 

    return {
        
        headers: {
            "Content-Encoding": "UTF-8",
            "Content-disposition" : `attachment; filename=${name}.csv`, 
            "Content-Type" : "text/csv; charset=UTF-8"
        },
        body: BOM + data
    }
}
