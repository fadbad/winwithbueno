import { db, __res } from "$lib/bw/api";
import type { RequestHandler } from "@sveltejs/kit";

export const get: RequestHandler = async ({ url, locals }) => {

    const byPrize = await db.user.groupBy({
        by: ['prize'],
        _count: {
            id: true
        },
        orderBy:{
            _count: {
                id: 'desc'
            }
        }
    })

    return __res.success({
        byPrize
    })
}
