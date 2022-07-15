import util from 'util'
import cp from 'child_process'
const promisify = util.promisify
const baseExec = cp.exec

const _exec = promisify(baseExec)

export const exec = async (cmd) => {
    const res = await _exec(cmd)
    console.log(res.stdout.trim())
    return res.stdout.trim()
}
