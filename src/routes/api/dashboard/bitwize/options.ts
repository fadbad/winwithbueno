import { db, cache } from "$lib/bw/api";

export const get = async ({ url, locals }) => {
    const body = await db.option.findMany()
    return {
        body
    }
}

export const post = async ({ request, locals }) => {
    const req = await request.json()
    const ret = [];
    
    for( const key in req) {
        const value = req[key]
        const res = await db.option.upsert({
            where: { key },
            update: { value },
            create: { key, value }
        })
        ret.push(res)
    }

    cache.flush()

    return {
        body: ret
    }
}
