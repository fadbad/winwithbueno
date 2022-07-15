import {db, dbExporter} from "$lib/bw/api";

export const get = async ({ url, locals }) => {
    
    let data = await db.admin.findMany({orderBy: {createdAt: 'desc'}})

    return dbExporter(url, data, 'export-admins')
}
