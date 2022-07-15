import { getSysDetails } from "$lib/bw/api/utils/os"

export const get = async ({ url, locals }) => {

    const res = await getSysDetails()

    return {
        body: res
    }

}
