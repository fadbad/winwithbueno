import bcrypt from "bcryptjs";
import _ from 'lodash'

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

export const getUrlQuery: any = url => {
    const result = {}
    if(!url) return result
    const entries = new URLSearchParams(new URL(url).search).entries()
    for(const [key, value] of entries) result[key] = value;
    return result;
}

export const random_sms_token = () => Math.floor(1000 + Math.random() * 9000)

export const hashPWD = password => bcrypt.hashSync(password, 8)

export const checkPWD = (a, b) => bcrypt.compareSync(a, b)

export const generate_token = ( size = 12, alphabet = '23456789abcdefghjklmnpqrstuvwxyz') => {
    let id = '', i = size
    while (i--) {
        id += alphabet[(Math.random() * alphabet.length) | 0]
    }
    return id
}

export const generate_password = (size = 12) => {
    return generate_token(size, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+=-{}[];|:./<>?~')
}

export const bearer_token = req => {
    const bearer = req?.headers?.authorization || '';
    const token = bearer.replace('Bearer ', '');
    return token
}

export const base64File = (url) => {
    let parts = url.split(';');
    let mime = parts[0].split(':')[1];
    let data = parts[1].split(',')[1];
    return { mime, data }
}

export const distanceQuery = (lat, lng, args = {
    latName: 'lat', 
    lngName: 'lng',
    fieldName: 'distance'
}) => {
    const miles = 1.1515
    const km = miles * 1.609344

    const { latName, lngName, fieldName } = args

    return `((ACOS(SIN(${lat} * PI() / 180) * SIN(${latName} * PI() / 180) + COS(${lat} * PI() / 180) * COS(${latName} * PI() / 180) * COS((${lng} - ${lngName}) * PI() / 180)) * 180 / PI()) * 60 * ${km}) as ${fieldName}`
}

export const toSaudiNumber = (num) => {
    num = num.toString().trim().replace(/[^\d]/g, "").replace('+', '')
    if(!num) return false

    const re = /^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/
    const match = re.test(num)
    if(!match) return false

    if(num.startsWith('00966')) return num.replace('00966', '966')
    if(num.startsWith('966')) return num
    if(num.startsWith('0')) return '966'+num.substring(1)
    return '966'+num
}

export const uuid = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        let r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    })
}

export const stripTags = html => {
    let text = html.replace(/(<([^>]+)>)/g, '');
    text = text.replace(/\s+/g, ' ');
    return text;
}

export const toCamelCase = str => {
    if (typeof str !== 'string') return str;
    return str
        .trim()
        .replace(/_+|\-+/g, ' ')
        .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
            if (Number(match) === 0) return '';
            return (index === 0) ? match.toLowerCase() : match.toUpperCase();
        });
}

export const toSnakeCase = str => {
    if (typeof str !== 'string') return str;
    return str.trim().replace(/(\s*\-*\b\w|[A-Z])/g, function($1) {
        $1 = $1.trim().toLowerCase().replace('-', '');
        return ($1[0] === '_' ? '' : '_') + $1;
    }).slice(1);
}

export const mergeDeep = (base, data) => {
    const isObject = item => (item && typeof item === 'object' && !Array.isArray(item))
    //Validate data
    if (typeof base !== 'object' || base === null) {
      throw new Error('Not an object provided for base');
    }
    if (typeof data !== 'object' || data === null) {
      throw new Error('Not an object provided for data');
    }
    let output = Object.assign({}, base);
    if (isObject(base) && isObject(data)) {
        Object.keys(data).forEach(key => {
            if (isObject(data[key])) {
                if (!(key in base)) {
                    Object.assign(output, { [key]: data[key] });
                } else {
                    output[key] = mergeDeep(base[key], data[key]);
                }
            } else {
                Object.assign(output, { [key]: data[key] });
            }
        });
    }
    return output;
}

export const deepClone = (obj) => JSON.parse(JSON.stringify(obj))

export const arrayToJSON = (arr) => {
    return arr.map(item => {
      if (typeof item === 'object' && item !== null && typeof item.toJSON === 'function') {
        return item.toJSON();
      }
      return item;
    });
}

export const flag = name => {
    name = name.toLowerCase().trim().replace('uk', 'gb')
    return `https://raw.githubusercontent.com/fadbad/flags/master/svg/${name}.svg`
}

export const cors = (url) => {
    const base = 'https://cors.bitwize.com.lb/'
    url = url.replace(base, '')
    return base + url
}

export const array_last = (array, n) => {
    if (array == null) return void 0;
    if (n == null) return array[array.length - 1];
    return array.slice(Math.max(array.length - n, 0));  
}

export const array_remove = (array, el) => {
    const index = array.indexOf(el);
    if (index > -1) array.splice(index, 1)
    return array
}

export const empty_array = (num = 3) => new Array(num).fill({})

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

export const initials = (name) => name.split(" ").map((n,i,a) => i === 0 || i+1 === a.length ? n[0] : null).join("").toUpperCase()

export const isRTLString = (s) => {           
    var ltrChars    = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF'+'\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF',
        rtlChars    = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC',
        rtlDirCheck = new RegExp('^[^'+ltrChars+']*['+rtlChars+']');

    return rtlDirCheck.test(s);
}

export const empty_image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

export const pretty_number = (num, minValue = 0, hideMin = false) => {

    if(!num || !+num || typeof +num !== 'number') {
        num = parseInt(num, 10) || 0
    }

    num = +num;
    var digits = 2;

    var si = [
        { value: 1E18, symbol: "E" },
        { value: 1E15, symbol: "P" },
        { value: 1E12, symbol: "T" },
        { value: 1E9,  symbol: "G" },
        { value: 1E6,  symbol: "M" },
        { value: 1E3,  symbol: "k" }
    ], rx = /\.0+$|(\.[0-9]*[1-9])0+$/, i;

    if( num === minValue ){
        if(hideMin) return null
    }

    if(typeof num === 'number' && num >= minValue) {
        for (i = 0; i < si.length; i++) {
            if (num >= si[i].value) {
                return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
                // return num / si[i].value + si[i].symbol
            }
        }
    }
    return num
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

export const arrayUnique = (array) => {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j]) {
                a.splice(j--, 1);
            }
        }
    }
    return a;
}

export const tap = (output, callback) => {
    callback(output)
    return output
}

export const isNumeric = (num) => !isNaN(num)

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

export const toQueryParams = (object) => {
    return Object.keys(object)
        .filter(key => !!object[key])
        .map(key => key + "=" + encodeURIComponent(object[key]))
        .join("&")
}

export const basename = (path) => path.replace(/.*\//, '')
export const dirname = (path) => path.match(/.*\//)
export const hostname = (url) => {
    let hostname;
    (url.indexOf('//') > -1) ? [,, hostname] = url.split('/') : [hostname] = url.split('/');
    [hostname] = hostname.split(':');
    [hostname] = hostname.split('?');
    return hostname;
}

export const englishNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
export const arabicNumbers = ["١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩", "٠"]
export const a2e = s => s.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
export const e2a = value => {
    if (!value) return;
    value=value.toString();
    for (var i = 0; i < arabicNumbers.length; i++) {
        value = value.replace(new RegExp(englishNumbers[i], "g"), arabicNumbers[i]);
    }
    return value;
}

export const rand = (min = 0, max = 9999) => Math.floor(Math.random() * (max - min)) + min

export const random_string = (length) => {
    let text = '';
    const p = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i += 1) {
        text += p.charAt(Math.floor(Math.random() * p.length));
    }
    return text;
}

export const random_date = () => new Date(+(new Date()) - Math.floor(Math.random()*10000000000))

export const random_user_image = (gender = 'male') => {
    gender = gender || 'male'
    gender = gender.trim().toLowerCase()
    const type = gender === 'female' ? 'women' : 'men'
    return `https://randomuser.me/api/portraits/${type}/${rand(1, 99)}.jpg`
    // return `https://uinames.com/api/photos/${gender}/${rand(1, 20)}.jpg`
}

export const random_image = (w = 800, h = 600) => {
    const nocache = Date.now()
    return `https://picsum.photos/${w}/${h}?_=${nocache}`
}

export const random_color = () => `rgb(${[...new Array(3)].map(() => Math.random() * 256).join(',')})`

export const str_random = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
   return result;
}

export const slugify = (str) => {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-') // collapse dashes
        .replace(/^-+/, "") // trim - from start of text
        .replace(/-+$/, ""); // trim - from end of text

    return str;
}
