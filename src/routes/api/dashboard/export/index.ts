import {db, dbExporter, getUrlQuery} from "$lib/bw/api";

export const get = async ({ url, locals }) => {

    let {type = 'user'} = getUrlQuery(url)
    
    let data = await db[type].findMany({orderBy: {createdAt: 'desc'}})

    return dbExporter(url, data, 'export-admins')
}
