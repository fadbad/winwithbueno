import { db, db_auth } from "$lib/bw/api"

export const post = async (request) => {
    return db_auth(request, db.admin)
}
