import * as fs from 'fs'
import Logger from "$lib/bw/api/logger"

const FILE = Logger.getFile()

export const get = async ({ url, locals }) => {
    const body = fs.existsSync(FILE) ? fs.readFileSync(FILE, 'utf-8') : []
    return {
        body
    }
}
