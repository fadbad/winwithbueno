import type { RequestHandler } from "@sveltejs/kit"
import { __res, fetcher } from '$lib/bw/api'

const BASE = 'https://codes.winwithbueno.com'

export const get: RequestHandler = async({ url }) => {
    const code = (url.searchParams.get('code') || '0').toUpperCase()
    const res = await fetcher.asJson().get(BASE+'/valid', { code })
    if(res.ok){
        return __res.success(res.data)
    } else {
        return __res.error('Unable to reach codes server')
    }
}

export const post: RequestHandler = async ({ request }) => {
    const { code } = await request.json()
    const res = await fetcher.asJson().post(BASE+'/use', { code })
    if(res.ok){
        return __res.success(res.data)
    } else {
        return __res.error('Unable to reach codes server')
    }
}
