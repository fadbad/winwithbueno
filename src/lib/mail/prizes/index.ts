import { s3 } from "$lib"
import { 
    anghamiCodes, operaCodes, sensasiaCodes, voxCodes, wallpaperCodes 
} from './codes'

export const prizes = [
    {
        name: 'anghami',
        weight: 425,
        max: 425 - 8,
    },
    {
        name: 'opera',
        weight: 50,
        max: 50 - 8,
    },
    {
        name: 'sensasia',
        weight: 50,
        max: 50 - 8,
    },
    {
        name: 'vox',
        weight: 100,
        max: 100 - 8,
    },
    {
        name: 'wallpaper',
        weight: 25,
        max: 999999,
    },
]

export const codes = {
    anghami: anghamiCodes,
    opera: operaCodes.map(i => {
        i.attachment = {
            filename: i.name,
            path: s3(`/vouchers/opera/${i.name}`),
        }
        return i
    }),
    vox: voxCodes.map(i => {
        i.attachment = {
            filename: i.name,
            path: s3(`/vouchers/vox/${i.name}`),
        }
        return i
    }),
    sensasia: sensasiaCodes.map(i => {
        i.attachment = {
            filename: i.name,
            path: s3(`/vouchers/sensasia/${i.name}`),
        }
        return i
    }),
    wallpaper: wallpaperCodes.map(i => {
        i.name = s3(`/vouchers/wallpaper/${i.name}`)
        return i
    }),
}
