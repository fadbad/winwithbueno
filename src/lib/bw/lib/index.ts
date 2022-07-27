import moment from 'moment'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { browser } from "$app/env";
import _ from 'lodash'

export { createForm } from './createForm'
// export { default as Fuse } from './fuse'
export * from './utils'

export const BASE_URL = '/api/dashboard'

export const storage = {
    set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
    get: key => JSON.parse(localStorage.getItem(key)),
    remove: key => localStorage.removeItem(key)
}

export const setActiveMenu = i => storage.set('active-menu', i.name ?? '')

export const getFetchHeaders = () => {
    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    let token = localStorage.getItem('token') ?? ''
    if(token){
        token = decrypt(token)
        headers['Authorization'] = `Bearer ${token}`
    }
    return headers
}

export const getAuthUser = (field = 'all') => {
    const empty = ''
    if(!browser) return empty;
    
    let user = localStorage.getItem('user') ?? ''
    if(!user) return empty
    user = decrypt(user)
    user = JSON.parse(user)
    if(field === 'all'){
        return user
    } else if (field === 'menu-name') {
        let name = user['name'] ?? '---'
        let t = name.split(' ')
        if(t.length > 1){
            return t[0]+ ' '+t[t.length -1][0].toUpperCase()+'.'
        } else {
            return t[0]
        }
    } else if (field === 'avatar') {
        return `https://avatars.dicebear.com/api/male/${user['name'] ?? 'anon'}.svg?mood[]=happy`
    } else {
        return user[field] ?? '---'
    }
}

const processFetch = async (method, url, payload = {}) => {
    method = method.toUpperCase().trim()
    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    let token = localStorage.getItem('token') ?? ''
    if(token) headers['Authorization'] = `Bearer ${decrypt(token)}`

    const options: any = {
        method,
        headers
    }

    url = `${BASE_URL}${url}`

    if(method !== 'GET') {
        options.body = JSON.stringify(payload)
    } else {
        url = add_query_args(url, payload)
    }

    try {
        const res = await fetch(url, options)
        const json = await res.json()
        return json
    } catch (error) {
        return {
            ok: false,
            status: 500,
            result: 'error',
            message: error,
            data: []
        }
    }
}

export const api = {
    get: async (url, payload = {}) => await processFetch('GET', url, payload),
    post: async (url, payload = {}) => await processFetch('POST', url, payload),
    patch: async (url, payload = {}) => await processFetch('PATCH', url, payload),
    delete: async (url, payload = {}) => await processFetch('DELETE', url, payload),
}

const SALT = `h.8QxI)Mh6D!H5,i`

export const encrypt = (text, salt = SALT): any => {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    const byteHex = n => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code);

    return text.split('')
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join('');
}
    
export const decrypt = (encoded, salt = SALT): any => {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    const applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code);
    return encoded.match(/.{1,2}/g)
      .map(hex => parseInt(hex, 16))
      .map(applySaltToChar)
      .map(charCode => String.fromCharCode(charCode))
      .join('');
}

export const isEmpty = (value) => {
    return (
        typeof value === 'undefined' ||
        value === undefined || 
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) || 
        (typeof value === "string" && value.trim().length === 0) || 
        (Array.isArray(value) && value.length === 0)
    );
}

export const trim = (str, chr = null) => _.trim(str, chr)
export const ltrim = (str, chr = '') => {
    str = _.trim(str)
    return _.trimStart(str, chr)
}
export const rtrim = (str, chr = '') => {
    str = _.trim(str)
    return _.trimEnd(str, chr)
}
export const uppercase = (str) => _.upperCase(_.trim(str))
export const lowercase = (str) => _.lowerCase(_.trim(str))
export const capitalize = (str) => _.capitalize(_.trim(str))
export const camelCase = (str) => _.camelCase(_.trim(str))
export const kebabCase = (str) => _.kebabCase(_.trim(str))
export const snakeCase = (str) => _.snakeCase(_.trim(str))
export const removeBadChars = (str) => _.deburr(_.trim(str))
export const startsWith = (str, chr = '') => _.startsWith(str, chr)
export const endsWith = (str, chr = '') => _.endsWith(str, chr)
export const truncate = (str, len = 30, omission = '...') => _.truncate(str, {
    length: len,
    omission
})

export const youtubeGetID = (url: string) => {
    if(!url) return false
    const arr = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return undefined !== arr[2] ? arr[2].split(/[^\w-]/i)[0] : arr[0];
}

export const formatLabel: any = str => str.split('-').join(' ').split('_').join(' ').replace(/ +(?= )/g,'').toLowerCase().replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase())

export const __date_item = (d, label = '', withTime = true, df = 'MMM DD, YY', tf = 'HH:mm') => {
    let ret = '--'

    const valid = moment(d).isValid()

    if(d && valid){
        const dat = moment(d).format(df)
        const tim = moment(d).format(tf)
        ret = dat
        if(withTime){
            ret = `${dat} <span class="text-slate-500">${tim}</span>`
        }
    }

    if(label){
        label = `<span class="text-xs text-slate-400">${label}: </span>`
    }

    return `
        <div class="text-sm">
            ${label}
            <span class="text-slate-800">${ret}</span>
        </div>
    `
}

export const uuid = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        let r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export const numberFormat = (number) => {
    if(!number) return '0.00'
    var str = '';
    number.toString().split('').reverse().map((e, index) => {
        str += e.toString();
        if ((index + 1) % 3 === 0) {
            str += ',';
        }
    });
    return str.split('').reverse().join('').replace(/^,/, '');
}

export const json_list = ( data ) => {
    var htmlRetStr = `<ul class="px-8">`;
    for (var key in data) {
        if (typeof(data[key])== 'object' && data[key] != null) {
            htmlRetStr += `<li class="my-1"><span class='badge badge-info'>${key}:</span><ul>`;
            htmlRetStr += json_list( data[key] );
            htmlRetStr += `</ul></li>`;
        } else {
            htmlRetStr += `<li class="my-1"><span class='badge badge-info'>${key}:</span> ${data[key]}</li>`;
        }
    };
    htmlRetStr += '</ul >';
    return( htmlRetStr );
}

export const debounce = (func, wait, immediate) => {
    let timeout;
    function _debounce(...args) {
        const context = this;
        const later = function __debounce() {
            timeout = null;
            if (!immediate) { func.apply(context, args); }
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) { func.apply(context, args); }
    }
    _debounce.stop = () => clearTimeout(timeout);
    return _debounce;
}

export const add_query_args = (uri, params, nocache = false) => {
    params = params || {};
    if(nocache) params._ = Date.now();
    var separator = uri.indexOf('?') !== -1 ? '&' : '?';
    for (var key in params) {
        if(params.hasOwnProperty(key)){
            uri += separator + key + '=' + encodeURIComponent(params[key]);
            separator = '&';
        }
    }
    return uri;
}

// https://github.com/darkskyapp/string-hash
export const hash = (str) => {
    var hash = 5381, i = str.length;
    while(i) {
        hash = (hash * 33) ^ str.charCodeAt(--i);
    }
    return hash >>> 0;
}

export const validArray = obj => !Array.isArray ? Object.prototype.toString.call(obj) === '[object Array]' : Array.isArray(obj)

export const validURL = (url) => {
    const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return reg.test(url);
}

export const validEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export const validPhone = (num, country:any = 'sa') => {
    if(!num) return false;
    if(typeof num === 'undefined') return false;
    country = country.toUpperCase().trim()
    const n = parsePhoneNumberFromString(num.toString(), country ); 
    return n && n.isValid() ? true : false;
}

export const validSaudiPhone = (num) => {
    const re = /^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/
    return re.test(num)
}
