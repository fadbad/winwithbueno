import { ltrim, trim, lowercase, startsWith, isEmpty, db, fetcher } from "$lib/bw/api"
import config from '../config'

class MyFatoorah {
    res = {
        success: (payload = {}):any => ({ ok: true, ...payload }),
        reject: (message = '', payload = {}):any => ({ ok: false, message, ...payload }),
        error: (payload = {}):any => ({ ok: false, ...payload })
    }

    baseUrl = config.BASE_URL
    
    state = {
        base: 'https://apitest.myfatoorah.com/v2/',
        token: 'Tfwjij9tbcHVD95LUQfsOtbfcEEkw1hkDGvUbWPs9CscSxZOttanv3olA6U6f84tBCXX93GpEqkaP_wfxEyNawiqZRb3Bmflyt5Iq5wUoMfWgyHwrAe1jcpvJP6xRq3FOeH5y9yXuiDaAILALa0hrgJH5Jom4wukj6msz20F96Dg7qBFoxO6tB62SRCnvBHe3R-cKTlyLxFBd23iU9czobEAnbgNXRy0PmqWNohXWaqjtLZKiYY-Z2ncleraDSG5uHJsC5hJBmeIoVaV4fh5Ks5zVEnumLmUKKQQt8EssDxXOPk4r3r1x8Q7tvpswBaDyvafevRSltSCa9w7eg6zxBcb8sAGWgfH4PDvw7gfusqowCRnjf7OD45iOegk2iYSrSeDGDZMpgtIAzYVpQDXb_xTmg95eTKOrfS9Ovk69O7YU-wuH4cfdbuDPTQEIxlariyyq_T8caf1Qpd_XKuOaasKTcAPEVUPiAzMtkrts1QnIdTy1DYZqJpRKJ8xtAr5GG60IwQh2U_-u7EryEGYxU_CUkZkmTauw2WhZka4M0TiB3abGUJGnhDDOZQW2p0cltVROqZmUz5qGG_LVGleHU3-DgA46TtK8lph_F9PdKre5xqXe6c5IYVTk4e7yXd6irMNx4D4g1LxuD8HL4sYQkegF2xHbbN8sFy4VSLErkb9770-0af9LT29kzkva5fERMV90w',

        lang: 'en',
        iso: 'SAR',
        code: '+966',
        callbackUrl: `${this.baseUrl}/api/user/payment/status`,
        errorUrl: `${this.baseUrl}/`
    }

    setLive() {
        this.state.base = 'https://api.myfatoorah.com/v2/',
        this.state.token = 'QWhiUTMVXOZExwtgskX-g-Ee8LjDRjD3mgjAGF9P_4a4F7A1wZTcI0SLoe9qFgapxz4jO6S5op0oCtTtOzpVtoff3oszs6EVUopdaPWPJKzblxQKXLREqX2ksl1S435XhYEho96YmL3yqlg1p1Vk2Z8p4BkqukfZofmALTf8_5PzlyLUR0e34smdWyE7e-X25f3_Zbt_TVDSvgzh6Eb7iXxphKLbkYtwNgUOwlmxhIt-msHf54BUDUXLm-sro8i9ogoXgzYy78kOIEZz5iexob8xWYtbja_xSRR1tvgP83GrSBwHLB0E8nXjj197wHnxBhMPqzaA5iyT92oibbXqhR1HgTaw0i4gKDRO2QwawG0iYVR8xccSeoZxHbfY63gGGdvS1v6mj3qGb3QQ0s_t2VtuSlo6t4BPUrFVMZmW2j0e7Qg1Gh2xCP_r2PuiAoFJU_2XmjmelK0WzpS9pdvonyIswE699z_TmFkOHZ3qBnWGnWYN5HQ6RtsQnTv7mPReB54nCJW4l3TaKptFUzn_gjp9Jh599vLmzscPLU3Er2zsd0hh8K_XWHDAw9peHacmbqqzxtOTd8XcTZ1-mwpZexGUbxc1nNybicmI44QBRdl9D4MPfObDvkfIzn0nTXluJXnrXNJ8gVNKEizL2PNWyyoT4oVhZjhWEWgof2z04DoMGWBv'
    }

    setLang(val) {
        this.state.lang = val
    }

    setIso(val) {
        this.state.iso = val
    }

    setCode(val) {
        this.state.code = val
    }

    fixMobile(num){
        return `0${ltrim(num, '966')}`
    }

    async fetch(handle, args){
        let url = this.state.base + handle
        if(startsWith(handle, 'http')) url = handle
        return await fetcher.asJson().withBearer(this.state.token).withLang(this.state.lang).withLog().post(url, args)
    }

    async init(amount:any = 0){
        amount = parseFloat(amount)
        if(!amount) return this.res.reject('Invalid amount')
        const res = await this.fetch('InitiatePayment', {
            InvoiceAmount: amount,
            CurrencyIso: this.state.iso
        })

        if(res.ok){
            const data = res.data
            let methods = data?.Data?.PaymentMethods ?? []
            methods = methods.map(i => ({
                id: i.PaymentMethodId,
                name: i.PaymentMethodEn,
                nameAr: i.PaymentMethodAr,
                code: i.PaymentMethodCode,
                direct: i.IsDirectPayment,
                charge: i.ServiceCharge,
                amount: i.amount,
                iso: i.CurrencyIso,
                img: i.ImageUrl,
            }))
            return this.res.success(methods)
        } else {
            return this.res.reject('Error fetching api')
        }
    }

    async execute(user: any, amount:any = 0, method:any = 11): Promise<any> {
        method = parseInt(method) ?? 0 // 11: apple pay, 2: VISA/MASTER, 6: MADA
        amount = parseFloat(amount) ?? 0

        if(!method || !amount) return this.res.reject('Invalid amount')

        const res = await this.fetch('ExecutePayment', {
			PaymentMethodId: method,
			CustomerName: user.name,
			DisplayCurrencyIso: this.state.iso,
			MobileCountryCode: this.state.code,
			CustomerMobile: this.fixMobile(user.mobile),
			CustomerEmail: user.email || 'guest@solomusicapp.com',
			InvoiceValue: amount,
			CallBackUrl: this.state.callbackUrl,
			ErrorUrl: this.state.errorUrl,
			Language: this.state.lang,
			CustomerReference: user.id,
			CustomerCivilId: '',
			UserDefinedField: '',
			ExpireDate: '',
			CustomerAddress: {
				Block: '',
                Street: '',
                HouseBuildingNo: '',
                Address: '',
                AddressInstructions: '' 
            },
			InvoiceItems: [
				{
					ItemName: "Solo Cart",
					Quantity: 1,
					UnitPrice: amount,
                },
			],
            json: true,
        });

		if(res.ok){
			const data = res.data;
            if(res.data?.IsSuccess === false){
                return this.res.error({
                    error: true,
                    message: res.data?.Message ?? ''
                });
            }
			
			return this.res.success({
				invoice_id:  data?.Data?.InvoiceId ?? 0,
				direct:  data?.Data?.IsDirectPayment ?? false,
				url:  data?.Data?.PaymentURL ?? false,
				user_id:  data?.Data?.CustomerReference ?? 0,
				user_field:  data?.Data?.UserDefinedField ?? '',
				data:  data,
            });
		} else {
			return this.res.error({
                error: true
            });
		}
    }

    async direct(user, cardId, sessionId){
        const card = await db.userCard.findUnique({where: { id: +cardId }})
        const session = await db.session.findUnique({where: { id: +sessionId }})
        
        if(isEmpty(card)) return this.res.reject('card empty')
        if(isEmpty(session)) return this.res.reject('session empty')
        const pid = card.type === 'mada' ? 6 : 2

        const exec = await this.execute(user, session.price, pid)
        if(!isEmpty(exec.error)) return this.res.reject('could not fetch api', exec)
        if(!exec.url) return this.res.reject('could not retreive url', exec)

        const expiry = card.expiry.split('/')

        const args = {
            PaymentType: 'card',
            Card: {
                Number: card.number,
                expiryMonth: expiry[0],
                expiryYear: expiry[1],
                securityCode: card.cvv,
                HolderName: card.name,
            },
            SaveToken: false,
            Bypass3DS: false,
            json: true,
        }

        const res = await this.fetch(exec.url, args)
        const data = res.data
        const status = data?.Data?.Status ?? 'ERROR';
        const cardInfo = data?.Data?.CardInfo ?? false;
        const url = data?.Data?.PaymentURL ?? null;
        const paymentId = data?.Data?.PaymentId ?? 0;

        if(url){
            return this.res.success({
                status: status,
                url,
                paymentId,
                cardInfo,
                data,
            })
        } else if(status === 'SUCCESS') {
            const re = await this.status(paymentId, session.id)
            if(re.status === 'SUCCESS'){
                return this.res.success({
                    url: null,
                    status: 'SUCCESS',
                    paymentId,
                    card: cardInfo,
                    data: re.ORIGINAL,
                })
            } else {
                return this.res.error({
                    status: 'ERROR',
                    data: re.ORIGINAL
                })
            } 
        }else {
            const errMsg = data?.Data?.ErrorMessage ?? data?.Data?.Message ?? '';
            return this.res.reject(errMsg, {
                status: 'ERROR',
                data
            })
        }

    }

    async status(paymentId, sessionId){
        const order = await db.session.findUnique({where: {id: +sessionId }})
        if(order){
            if(order.paid){
                return this.res.success({ status: 'SUCCESS', data: [], ORIGINAL: []})
            }
        }

        const res = await this.fetch('getPaymentStatus', {
            KeyType: 'paymentId',
            Key: paymentId
        })
        
        const data = res.data
        const paid = lowercase(trim( data?.Data?.InvoiceStatus ?? '') );

        if(paid === 'paid' || paid === 'duplicatepayment'){
            // optional($order)->log('paid', $data);
            await db.session.update({
                where: { id: +sessionId },
                data: {
                    paid: true,
                    payment_info: data
                }
            })

            return this.res.success({
                status: 'SUCCESS',
                data: data?.Data,
                ORIGINAL: data,
            })

            
        } else {
            await db.session.update({
                where: { id: +sessionId },
                data: {
                    paid: false,
                    payment_info: data
                }
            })
            
            return this.res.success({
                status: 'ERROR',
                payment_message: data?.Message,
                ORIGINAL: data,
            })
        }

    }
}

export const myFatoorah = new MyFatoorah()
