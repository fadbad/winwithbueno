class Fetcher {
    headers = {}
    isFormData = false
    res = 'json'
    log = false

    withLog(){
        this.log = true 
        return this
    }

    withHeaders(headers){
        this.headers = {
            ...this.headers,
            ...headers
        }
        return this
    }

    withBearer(token){
        return this.withHeaders({
            'Authorization': `Bearer ${token}`
        })
    }

    withAuth(username, password){
        return this.withHeaders({
            'Authorization': `Basic ${Buffer.from(username + ":" + password).toString('base64')}`,
        })
    }

    withBasicAuth(apikey){
        return this.withHeaders({
            'Authorization': `Basic ${apikey}`,
        })
    }

    withLang(lang){
        return this.withHeaders({
            'Accept-Language': lang,
        })
    }

    withCors(){
        return this.withHeaders({
            'Access-Control-Allow-Origin': '*'
        })
    }

    accept(){
        return this.withHeaders({
            'Accept': 'application/json',
        })
    }

    contentType(){
        return this.withHeaders({
            'Content-Type': 'application/json; charset=utf-8',
        })
    }

    asJson(){
        return this.withHeaders({
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
        })
    }

    asFormData(){
        this.headers = null
        this.isFormData = true
    }

    makeFormData = (payload) => {
        const formData = new FormData();
        for ( var key in payload ) {
            formData.append(key, payload[key]);
        }
        return formData
    }

    getJson(){
        this.res = 'json'
        return this
    }

    getText(){
        this.res = 'text'
        return this
    }

    getBlob(){
        this.res = 'blob'
        return this
    }

    getArrayBuffer(){
        this.res = 'arraybuffer'
        return this
    }

    getFormData(){
        this.res = 'formdata'
        return this
    }

    send = async (method, url, payload = {}) => {

        const options: any = {
            method,
            headers: this.headers
        }

        if(method !== 'GET') {
            if(this.isFormData){
                options.body = this.makeFormData(payload)
            } else {
                options.body = JSON.stringify(payload)
            }
        } else {
            url = this.add_query_args(url, payload)
        }

        try {
            const res = await fetch(url, options)
            let data
            if (this.res === 'json'){
                data = await res.json()
            } else if (this.res === 'text'){
                data = await res.text()
            } else if (this.res === 'blob'){
                data = await res.blob()
            } else if (this.res === 'arraybuffer'){
                data = await res.arrayBuffer()
            } else if (this.res === 'formdata'){
                data = await res.formData()
            } 

            const headers = {}
            res?.headers?.forEach((v, k) => headers[k] = v)

            const RET = {
                ok: res.ok,
                status: res.status,
                headers,
                data,
            }

            if(this.log){
                console.log('----- FETCHER - REQUEST -----')
                console.log({url, ...options})
                console.log('----- FETCHER - RESPONSE -----')
                console.log(RET)
            }
            
            return RET
            
        } catch (error) {
            if(this.log){
                console.log('----- FETCHER - ERROR -----')
                console.warn({
                    message: error.message, 
                    url,
                    options,
                    stack: error.stack, 
                    ...error
                })
            }
            return {
                ok: false,
                status: 500,
                result: 'error',
                message: error.message ?? '',
                stack: error.stack ?? '',
                error: {...error},
                data: []
            }
        }
    }

    async get(url, payload = {}){
        return await this.send('GET', url, payload)
    }

    async post(url, payload = {}){
        return await this.send('POST', url, payload)
    }

    async put(url, payload = {}){
        return await this.send('PUT', url, payload)
    }

    async patch(url, payload = {}){
        return await this.send('PATCH', url, payload)
    }

    async delete(url, payload = {}){
        return await this.send('DELETE', url, payload)
    }
    

    add_query_args = (uri, params, nocache = false) => {
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
}

export const fetcher = new Fetcher()
