import {db, paginateQuery, middleware, dbMapper, __res, base64Upload, Joi, _} from "$lib/bw/api";

const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    image: Joi.string(),
    role: Joi.string()
})

const query = db.admin
const searchable = ['name', 'email']

export const get = async ({ url, locals }) => {
    const mid = await middleware(locals, db.admin)

    const res = await paginateQuery({
        url,
        query,
        searchable,
    })

    return __res.success(res)
}

export const post = async ({ request, locals }) => {
    await middleware(locals, db.admin)

    const req = await request.json()
    const { value, error } = schema.validate(req, { stripUnknown: true })
    if(error) return __res.error(error)

    try {
        let img: any = ''
        if(value.image) img = await base64Upload(value.image, 400)
        const item = await query.create({
            data: {
                name: value.name,
                email: value.email,
                password: value.password,
                image: img,
            }
        })

        return __res.created({ item: dbMapper(item) })
    } catch (error) {
        return __res.error(error)
    }
}

export const patch = async ({ request, locals }) => {
    await middleware(locals, db.admin)

    const req = await request.json()
    if(!req.id) return __res.reject('ID not supplied')

    try {
        const item = await query.update({
            where: {id: +req.id},
            data: _.omit(req, 'id')
        })
        return __res.success({ item: dbMapper(item) })
    } catch (error) {
        return __res.error(error)
    }
}

export const del = async ({ request, locals }) => {
    const mid = await middleware(locals, db.admin)

    const { id } = await request.json()
    if(!id) return __res.reject('ID not supplied')

    if(+id === +mid.id) return __res.reject('You cannot delete yourself')

    try {
        const item = await query.delete({where: {id: +id}})
        return __res.success({ item: dbMapper(item) })
    } catch (error) {
        return __res.error(error)
    }
}
