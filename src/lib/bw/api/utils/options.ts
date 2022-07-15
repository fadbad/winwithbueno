import { db } from '../db'
import { cache } from './cache'

const cache_key = 'app-cache'

const load = async () => {
    return cache.get(cache_key, async () => {
        console.log('refetching cache')
        return await doCache()
    })
}

const doCache = async () => {
    let res
    try {
        res = await db.option.findMany()
    } catch (error) {
        res = []
    }
    let vals = {}
    if(res.length) res.forEach(i => vals[i.key] = i.value)
    return vals
}

const putOption = async (key, value = '', revalidate = true) => {
    await db.option.upsert({
        where: { key },
        update: { value },
        create: { key, value }
    })
    if(revalidate) {
        cache.del(cache_key)
    }
}

const saveOptions = async (arr) => {
    if(typeof arr !== 'object' || !Array.isArray(arr)) return 
    if(Array.isArray(arr)){
        for (const i in arr){
            await putOption(i['key'].trim(), i['value'], false)
        }
    } else if (typeof arr === 'object') {
        const keys = Object.keys(arr)
        for (const key in keys){
            await putOption(key.trim(), arr[key], false)
        }
    }
    cache.del(cache_key)
}

export const get_option = async (key, defaultsTo = '') => {
    key = key.trim()
    if(!key.length) return defaultsTo
    const all = await load()
    return all[key] ?? defaultsTo
}

export const get_all_options = async () => {
    const all = await load()
    return all
}

export const add_option = async (key, value = '') => {
    await update_option(key, value)
}

export const update_option = async (key, value = '') => {
    if(typeof key === 'undefined' || !key) return false
    if(typeof key === 'string'){
        await putOption(key, value)
    } else {
        await saveOptions(key)
    }
    return true
}
