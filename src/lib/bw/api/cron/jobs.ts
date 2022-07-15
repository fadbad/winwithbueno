import { cronAddJob, toSlack, toMsegat, toOneSignal, toTwillio, toSendGrid, toMailazy, toEmail } from '$lib/bw/api'

export const toMsegatJob = async (to, msg) => await cronAddJob('msegat', { to, msg })
export const toOneSignalJob = async (to, msg) => await cronAddJob('onesignal', { to, msg })
export const toTwillioJob = async (to, msg) => await cronAddJob('twilio', { to, msg })
export const toSlackJob = async (text) => await cronAddJob('slack', { text })
export const toEmailJob = async (to, subject, msg) => await cronAddJob('mail', { to, subject, msg })
export const toSendGridJob = async (to, subject, msg) => await cronAddJob('sendgrid', { to, subject, msg })
export const toMailazyJob = async (to, subject, msg) => await cronAddJob('mailazy', { to, subject, msg })

export const cronProcessJob = async (payload) => {
    const { cmd, args } = payload
    
    console.log('cronProcessJob')
    console.log('cmd', cmd)
    console.log('args', args)

    let res
    switch(cmd){
        case 'msegat':
            res = await toMsegat(args.to ?? '', args.msg ?? '')
        break;
        case 'slack':
            res = await toSlack(args.text ?? '')
        break;
        case 'onesignal':
            res = await toOneSignal(args.to ?? '', args.msg ?? '')
        break;
        case 'twilio':
            res = await toTwillio(args.to ?? '', args.msg ?? '')
        break;
        case 'mail':
            res = await toEmail(args.to ?? '', args.subject ?? '', args.msg ?? '')
        break;
        case 'sendgrid':
            res = await toSendGrid(args.to ?? '', args.subject ?? '', args.msg ?? '')
        break;
        case 'mailazy':
            res = await toMailazy(args.to ?? '', args.subject ?? '', args.msg ?? '')
        break;
    }

    return res
}
