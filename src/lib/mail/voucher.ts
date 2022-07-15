import { get_option, update_option } from "$lib/bw/api"
import { weightedRandom, randomObj } from "$lib"
import { prizes, codes } from './prizes'

export const voucher = async () => {
    const prize = weightedRandom(prizes)
    const name = prize.name

    if(name === 'wallpaper') {
        const wb_voucher = randomObj(codes[name])
        return {
            name,
            prize,
            voucher: wb_voucher
        }
    }

    const optionName = `vouchers_${name}`
    const option = parseInt( await get_option(optionName, '0') )
    // const option = 0

    // if(option < (codes[name]?.length || 0) ) {
    if(option <= prize.max ) {
        const code = option + 1
        await update_option(optionName, code.toString())
        const __voucher = codes[name].find(i => i.code === code)

        if(!__voucher) return await voucher()

        return {
            name,
            prize,
            voucher: __voucher,
            option,
        }
    } 
    
    return await voucher() // loop
}
