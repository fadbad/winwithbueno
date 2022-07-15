import { db, __res, dbMapper, middleware } from "$lib/bw/api";

export const post = async ({ request, clientAddress, locals }) => {
    await middleware(locals, db.admin)

    const {table, id, field, value} = await request.json()

    try {
        const item = await db[table].update({
            where: {id: +id},
            data: {
                [field]: value
            }
        })

        return __res.success({ item: dbMapper(item) })
    } catch (error) {
        return __res.error(error)
    }
}
