import { backupDb } from "$lib/bw/api"

export const get = async ({ url }) => {

    const res = await backupDb()
    
    return {
        body: res
    }
}
