import { db } from "$lib/bw/api";

export const get = async () => {
    const body = await db.admin.create({
        data: {
            name: 'Fadi Badawi',
            email: 'ifadbad@gmail.com',
            password: 'password',
            role: 'super-admin',
            isDev: true,
        }
    })

    return { body }
}
