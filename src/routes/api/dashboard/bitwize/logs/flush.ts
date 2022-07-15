import * as fs from 'fs'
import Logger from "$lib/bw/api/logger"
const FILE = Logger.getFile()

export const get = async ({ url, locals }) => {
    if(fs.existsSync(FILE)) fs.unlinkSync(FILE)

    return {
        body: {message: 'Logs Truncated'}
    }
}
