import { cronFetchJobs } from "$lib/bw/api"

export const get = async ({ url }) => {
    const jobs = await cronFetchJobs()
    return {
        body: jobs
    }
}
