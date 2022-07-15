import { db, db_fetch } from "$lib/bw/api";

export const post = async (request) => {
    return db_fetch(request, db.admin)
}
