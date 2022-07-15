import crypto from 'crypto'

var EQUAL_END_REGEXP = /=+$/
var PLUS_GLOBAL_REGEXP = /\+/g
var SLASH_GLOBAL_REGEXP = /\//g

const rndm = (len) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var length = Buffer.byteLength(chars)
    
    len = len || 10
    var salt = ''
    for (var i = 0; i < len; i++) {
        salt += chars[Math.floor(length * Math.random())]
    }
    return salt
}

const generateRandomBytes = (size, attempts, callback) => {
    crypto.randomBytes(size, function onRandomBytes(err, buf) {
        if (!err) return callback(null, buf)
        if (!--attempts) return callback(err)
        setTimeout(generateRandomBytes.bind(null, size, attempts, callback), 10)
    })
}

const generateAttempts = crypto.randomBytes === crypto.pseudoRandomBytes ? 1 : 3

const randomBytes = (size, callback = null) => {
    
    if (callback) {
        return generateRandomBytes(size, generateAttempts, callback)
    }

    return new Promise(function executor(resolve, reject) {
        generateRandomBytes(size, generateAttempts, (err, str) => {
            if (err) return reject(err)
            resolve(str)
        })
    })
}

function randomBytesSync(size) {
    var err = null
    for (var i = 0; i < generateAttempts; i++) {
        try {
            return crypto.randomBytes(size)
        } catch (e) {
            err = e
        }
    }
    throw err
}

function generateUid (length, callback) {
    randomBytes(length, function (err, buf) {
        if (err) return callback(err)
        callback(null, toString(buf))
    })
}

function toString (buf) {
    return buf.toString('base64')
      .replace(EQUAL_END_REGEXP, '')
      .replace(PLUS_GLOBAL_REGEXP, '-')
      .replace(SLASH_GLOBAL_REGEXP, '_')
}

const uid = (length, callback) => {
    if (callback) {
      return generateUid(length, callback)
    }
  
    return new Promise(function executor (resolve, reject) {
        generateUid(length, function onUid (err, str) {
            if (err) return reject(err)
            resolve(str)
        })
    })
}

const uidSync = (length) => {
    return toString(randomBytesSync(length))
}

const bufferEqual = (a, b) => {
    if (a.length !== b.length) {
        return false;
    }
    if (crypto.timingSafeEqual) {
        return crypto.timingSafeEqual(a, b);
    }
    for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}
  
const timeSafeCompare = (a, b) => {
    var sa = String(a);
    var sb = String(b);
    var key = crypto.pseudoRandomBytes(32);
    var ah = crypto.createHmac('sha256', key).update(sa).digest();
    var bh = crypto.createHmac('sha256', key).update(sb).digest();
  
    return bufferEqual(ah, bh) && a === b;
}

const hash = (str) => {
    return crypto
      .createHash('sha1')
      .update(str, 'ascii')
      .digest('base64')
      .replace(EQUAL_END_REGEXP, '')
      .replace(PLUS_GLOBAL_REGEXP, '-')
      .replace(SLASH_GLOBAL_REGEXP, '_')
}

class Tokens {
    saltLength
    secretLength

    constructor(options: any = {}){
        var opts = options || {}
        var saltLength = opts.saltLength || 8
        var secretLength = opts.secretLength || 18
        this.saltLength = saltLength
        this.secretLength = secretLength
    }

    generate(){
        const secret = this.secretSync()
        const token = this.create( secret )
        return {
            token,
            secret 
        }
    }

    create(secret){
        return this._tokenize(secret, rndm(this.saltLength))
    }

    secret (callback = null) {
        return uid(this.secretLength, callback)
    }

    secretSync () {
        return uidSync(this.secretLength)
    }

    _tokenize (secret, salt) {
        return salt + '-' + hash(salt + '-' + secret)
    }

    verify = function verify (secret, token) {
        if (!secret || typeof secret !== 'string') {
            return false
        }
      
        if (!token || typeof token !== 'string') {
            return false
        }
      
        var index = token.indexOf('-')
      
        if (index === -1) {
            return false
        }
      
        var salt = token.substr(0, index)
        var expected = this._tokenize(secret, salt)
      
        return timeSafeCompare(token, expected)
    }
}

export default new Tokens()
