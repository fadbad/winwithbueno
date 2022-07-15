import type { RequestHandler } from "@sveltejs/kit";
import { toEmail } from "$lib/bw/api"
import { template, voucher } from "$lib/mail"

export const get: RequestHandler = async () => {

    const __voucher = await voucher()

    const subject = 'Lays Gourmet Voucher'
    // const msg = template(__voucher?.name, __voucher?.voucher?.name, 'ar')
    // const res = await toEmail(to, subject, msg, __voucher?.voucher?.attachment || [])

    // const to = 'fadi@bitwize.ae'
    // const to = 'trisha.m@mindspace-me.com'
    // // wallpaper, opera, anghami, vox, sensasia
    // const msg = template('vox', '123456', 'ar')
    // const res = await toEmail(to, subject, msg)

    return {
        body: {
            __voucher,
            // res,
        }
    }
}
