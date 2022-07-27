import { db, Joi, __res, base64Upload, dbMapper, toEmail } from "$lib/bw/api";
import { a2e } from "$lib/utils"
import { template } from "$lib/mail"

const schema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email(),
    code: Joi.string().required(),
    mobile: Joi.string().required(),
    gender: Joi.string().required(),
    outlet: Joi.string().required(),
    city: Joi.string().required(),
    dob: Joi.string().required(),
    sms: Joi.boolean().required(),
    screenshot: Joi.string().allow(''),
    barcode: Joi.string().allow(''),
    lang: Joi.string().allow(''),
})

export const post = async ({ request, clientAddress }) => {
    const req = await request.json()

    const { value, error } = schema.validate(req, { stripUnknown: true })
    if(error) return __res.error(error)

    console.log('values', value)

    try {

        let img: any = ''
        if(value.screenshot) img = await base64Upload(value.screenshot, 2000)
        const item = await db.user.create({
            data: {
                name: `${value.first_name} ${value.last_name}`,
                first_name: value.first_name,
                last_name: value.last_name,
                mobile: value.code + '' + a2e(value.mobile),
                email: value.email,
                gender: value.gender,
                outlet: value.outlet,
                city: value.city,
                image: img,
                dob: new Date(value.dob),
                sms: value.sms,
                ip: clientAddress
            }
        })

        const user = dbMapper(item)

        const subject = 'Lays Gourmet Voucher'
        // const msg = template(value?.lang || 'en')
        const msg = ''
        const emailRes = await toEmail(value.email, subject, msg)

        return __res.created({ 
            user,
            emailRes,
        })
    } catch (error) {
        return __res.error(error)
    }

}
