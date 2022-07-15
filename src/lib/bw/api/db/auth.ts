import { checkPWD } from "$lib/bw/api/utils"
import { dbMapper, __res } from "./index"


export const db_fetch = async (req, query) => {
    const { request, locals, clientAddress } = req
    try {
        const token = locals.token ?? ''
        if(!token) return __res.reject()
        let item = await query.findFirst({ where: { token }})
        if(!item) return __res.reject()
        item = dbMapper(item)
        return __res.success({ token: item.token, user: item })
    } catch (error) {
        return __res.error(error)
    }
}

export const db_auth = async (req, query, by = 'email', mustbeVerified = false) => {
    const { request, clientAddress } = req

    const { email, mobile, password } = await request.json()

    let item: any = false

    if(by === 'mobile') {
        if(!(mobile && password)) return __res.reject('Data not supplied')
        item = await query.findFirst({ where: { mobile } })
    } else {
        if(!(email && password)) return __res.reject('Data not supplied')
        item = await query.findFirst({ where: { email } })
    }

    if(!item) return __res.reject('User not found');
    const check = await checkPWD(password,  item.password)
    if(!check) return __res.reject('wrong password')

    if(mustbeVerified) {
        if(!item?.verified) return __res.reject('Not Verified', { user: dbMapper(item) })
    }

    await query.update({
        where: {
            id: +item.id
        },
        data: {
            loginAt: new Date(),
            loginIp: clientAddress ?? ''
        }
    })

    return __res.success({ token: item.token, user: dbMapper(item) })
}
