import {db, paginateQuery, middleware, dbMapper, __res, getUrlQuery} from "$lib/bw/api";

export const get = async ({ url, locals }) => {
    await middleware(locals, db.admin)

    let {type = 'user'} = getUrlQuery(url)

    const res = await paginateQuery({
        url,
        query: db[type],
        searchable: ['name', 'mobile', 'email'],
    })

    return __res.success(res)
}
