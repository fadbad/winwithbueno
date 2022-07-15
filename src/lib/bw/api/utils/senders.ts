import mailer from '$lib/bw/api/mailer'
import { mailTemplate } from './_mail_template'
import { toSaudiNumber } from './functions'
import { get_all_options, get_option } from './options'
import { fetcher } from './fetcher'

export const toEmail = async (to, subject, msg, attachments = []) => {

    // const html = mailTemplate(msg)
    const html = msg

    const options = await get_all_options()
    console.log('options', options)
    const {
        smtp_email,
        smtp_name,
        smtp_enc_type,
        smtp_host,
        smtp_port,
        smtp_username,
        smtp_password,
    } = options
    try {
        let transporter = mailer.createTransport({
            host: smtp_host,
            port: +smtp_port,
            secure: smtp_enc_type === 'ssl', // true for 465, false for other ports
            auth: {
                user: smtp_username,
                pass: smtp_password
            }
        })
    
        const res = await transporter.sendMail({
            from: {
                name: smtp_name,
                address: smtp_email,
            },
            to,
            subject,
            html,
            attachments,
        })
    
        return res.response
    } catch (error) {
        return error.message
    }

    
}

export const toMailazy = async (to, subject, msg) => {
    const url = `https://api.mailazy.com/v1/mail/send`

    const {
        mailazy_from_email,
        mailazy_from_name,
        mailazy_apikey,
        mailazy_apisecret,
    } = await get_all_options()

    const args = {
        "to": [ to ],
        "from": `${mailazy_from_name} <${mailazy_from_email}>`,
        "subject": subject,
        "content": [
            {
                "type": "text/html",
                "value": msg
            }
        ]
    }

    return await fetcher.asJson().withHeaders({
        'X-Api-Key': mailazy_apikey,
        "X-Api-Secret": mailazy_apisecret,
    }).post(url, args)
}

export const toSendGrid = async (to, subject, msg) => {
    const url = `https://api.sendgrid.com/v3/mail/send`

    const {
        sendgrid_from_email,
        sendgrid_from_name,
        sendgrid_apikey,
    } = await get_all_options()

    const args = {
        personalizations: [
            { to: [ { email: to } ] }
        ],
        from: {
            email: sendgrid_from_email,
            name: sendgrid_from_name
        },
        subject,
        content: [
            {type: 'text/html', value: msg}
        ]
    }

    return await fetcher.asJson().withBearer(sendgrid_apikey).post(url, args)
}

export const toSlack = async ( text ) => {
    const hook = await get_option('slack_hook')
    return await fetcher.asJson().withLog().getText().post(hook, { text })
}

export const toOneSignal = async ( to = 'all', msg ) => {
    const url = `https://onesignal.com/api/v1/notifications`

    const { onesignal_app_id, onesignal_apikey} = await get_all_options()

    let vars: any = {
        app_id: onesignal_app_id,
        contents: {"en": msg},
    }

    if(to !== 'all'){
        const ids = Array.isArray(to) ? to : [to]
        vars.include_player_ids = ids
    } else {
        vars.included_segments = ['All']
    }

    return await fetcher.asJson().withBasicAuth(onesignal_apikey).post(url, vars)
}

export const toMsegat = async ( to, msg ) => {
    // if(!to) return false;
    const url = `https://www.msegat.com/gw/sendsms.php`

    const {
        msegat_username,
        msegat_apikey,
        msegat_usersender,
    } = await get_all_options()
    
    to = Array.isArray(to) ? to : [to];
    let _numbers = []
    to.forEach((n, index) => {
        let num = toSaudiNumber(n)
        if(num) _numbers.push(num)
    })

    const numbers = JSON.stringify(_numbers);

    const args = {
        msgEncoding: 'UTF8',
        userName: msegat_username,
        apiKey: msegat_apikey,
        userSender: msegat_usersender,
        numbers,
        msg
    }

    return await fetcher.asJson().post(url, args)
}

export const toTwillio = async ( to, msg ) => {
    const {
        twilio_from,
        twilio_id,
        twilio_token,
    } = await get_all_options()

    const url = `https://api.twilio.com/2010-04-01/Accounts/${twilio_id}/SMS/Messages`

    const args = {
        From: twilio_from,
        To: to,
        Body: msg,
        ProvideFeedback: true
    }

    return await fetcher.asJson().withAuth(twilio_id, twilio_token).post(url, args)
}
