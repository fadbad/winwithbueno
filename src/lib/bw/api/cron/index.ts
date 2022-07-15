import { db } from '$lib/bw/api'
import { cronProcessJob } from './jobs'

export * from './jobs'

export const cronAddJob = async (cmd, args = {}) => {
    return await db.jobs.create({
        data: {
            payload: {
                cmd, 
                args
            }
        }
    })
}

export const cronFetchJobs = async () => {
    const items = await db.jobs.findMany()
    if(!items) return

    const jobs = []

    for(const item of items){
        jobs.push({
            id: item.id,
            payload: item.payload,
            attempt: item.attempts,
            process: 'starting',
        })
        await db.jobs.update({where: { id: item.id }, data: { attempts: { increment: 1 } } })
        const res = await cronProcessJob(item.payload)
        console.log('res', res)
        if(res.ok){
            jobs.push({
                id: item.id,
                payload: item.payload,
                attempt: item.attempts,
                process: 'finished',
            })
            await db.jobs.delete({where: { id: item.id}})
        } else {
            jobs.push({
                id: item.id,
                payload: item.payload,
                attempt: item.attempts,
                process: 'Failed',
            })
        }
    }

    return jobs
}
