import {db, dbExporter} from "$lib/bw/api";

export const get = async ({ url, locals }) => {
    
    let data = await db.user.findMany({orderBy: {createdAt: 'desc'}})

    return dbExporter(url, data, 'export-users')
}
