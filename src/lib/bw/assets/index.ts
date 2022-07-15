import countries from './json/countries.json'
import gcc_countries from './json/countries-gcc.json'
import currencies from './json/currencies.json'
import emojis from './json/emojis.json'
import aecities from './json/ae-cities-major.json'

const _coutries: any = [...countries]
const _gcc_countries: any = [...gcc_countries]
const _empty_country = { "name": "", "en": "", "ar": "", "code": "", "dialCode": ""}

export const assets_countries = _coutries.map(i => {
    i.flag = emojis[`flag-${i.code.toLowerCase()}`]
    return i
})

export const assets_gcc_countries = _gcc_countries.map(i => {
    i.flag = emojis[`flag-${i.code.toLowerCase()}`]
    return i
})

// export const assets_countries_with_gcc = [ ...assets_gcc_countries, _empty_country,...assets_countries ]

const gcc_cn_codes = [...new Set(assets_gcc_countries.map(item => item.code))];
const cnWthoutGCC = assets_countries.filter(i => !gcc_cn_codes.includes(i.code))
export const assets_countries_with_gcc = [...new Set([...assets_gcc_countries, ...cnWthoutGCC])]

export const assets_country = code => {
    if(!code) return ''
    code = code.toLowerCase().trim()
    return assets_countries.find(i => i.code === code)
}

export const assets_currencies = currencies

export const assets_emojis = emojis

export const assets_aecities = aecities

const _codes = [...new Set(assets_countries.map(item => item.dialCode))];
_codes.sort((a:any, b:any) => parseInt(a) < parseInt(b) ? -1 : 1)
export const countries_codes = _codes

export const gcc_codes = [...new Set(assets_gcc_countries.map(item => item.dialCode))];
// export const codes_with_gcc = [...gcc_codes, '', ..._codes]
export const codes_with_gcc = [...new Set([...gcc_codes, ..._codes])]
