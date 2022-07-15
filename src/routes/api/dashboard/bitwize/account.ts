import { db, __res, middleware, checkPWD } from "$lib/bw/api";

export const post = async ({ request, clientAddress, locals }) => {
    const user = await middleware(locals, db.admin)
    const { password, oldPassword } = await request.json()

    const check = await checkPWD(oldPassword,  user.password)
    if(!check) return __res.reject('wrong old password')

    const res = await db.admin.update({
        where: { id: user.id},
        data: {
            password
        }
    })

    return __res.success({ res })
}
