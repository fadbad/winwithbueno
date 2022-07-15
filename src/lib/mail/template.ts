import { logo_ar, logo_en, bgimage, congrats_ar, congrats_en, almarai, anghamiLogo, vox } from './assets'

const gold = '#D8B265'

const __keep = (lang = 'en') => {
    const t = lang === 'ar' ? `احتفظ بهذا البريد لتتمكن من استلام جائزتك.` : `Keep this email to redeem your prize.`
    return `
        <div style="padding: 48px 0;">${t}</div>
    `
}

const __prizes = [
    {
        name: 'vox',
        title: {
            en: `You've just won a ticket<br><b>for Vox Cinema!</b>`,
            ar: `فزت بتذكرة سينما في فوكس!`
        },
        text: {
            en: `
                Follow the attached instructions<br>on how to redeem your prize.<br>Sit back, and enjoy your favourite movie!
                <div><img src="${vox}" alt="vox" style="width: 100%; margin: 24px 0;" /></div>
                ${__keep('en')}
            `,
            ar: `
                اتبع التعليمات المرفقة بهذا البريد<br>واستمتع بفيلم من خيارك!
                <div><img src="${vox}" alt="vox" style="width: 100%; margin: 24px 0;" /></div>
                ${__keep('ar')}
            `
        },
    },
    {
        name: 'anghami',
        title: {
            en: `You've just won<br><b>a 1-month Anghami subscription!</b>`,
            ar: `فزت بإشتراك أنغامي لمدة شهر!`
        },
        text: {
            en: `Use the code below to activate your subscription<br>and enjoy your favourite music!`,
            ar: `استخدم الرمز التالي<br>لتفعيل اشتراكك واستمتع بالاغاني المضلة لديك`
        },
        before: {
            en: `<div><img src="${anghamiLogo}" alt="anghami" style="width: 180px; margin: 24px auto;" /></div>`,
            ar: `<div><img src="${anghamiLogo}" alt="anghami" style="width: 180px; margin: 24px auto;" /></div>`,
        },
        after: {
            en: `
                <div style="font-family: 'Open Sans', 'Arial', sans-serif; color: #ffffff; font-size: 15px; padding: 24px 0; text-align: left;">
                    <h3 style="font-size: 18px; font-weight: bold;">
                        How to redeem the voucher? 
                    </h3>
                    <ol>
                        <li>Log in to an existing account. If you don’t have one, you can create a new account for free by visiting <a href="https://anghami.com" style="color: #ffffff; text-decoration: none;">anghami.com</a>.</li>
                        <li>Go to: <a href="https://anghami.com/redeem" style="color: #ffffff; text-decoration: none;">anghami.com/redeem</a></li>
                        <li>Insert the code and click on Redeem</li>
                        <li>DONE! You can now enjoy all Anghami Plus features</li>
                    </ol>
                    
                    <h3 style="font-size: 18px; font-weight: bold;">
                        Terms & Conditions:
                    </h3>
                    <ul>
                        <li>Add to existing account or create a new one. Entire value credited to your Anghami account upon redemption.</li>
                        <li>Expires after 1 year of the issuance date. No resale.</li>
                        <li>Anghami is not responsible for lost or stolen cards or unauthorized use. It cannot be replaced if tampered or activated.</li>
                        <li>Non-refundable and not redeemable for cash except when required by law.</li>
                    </ul>
                    <p>
                        For info & inquiries: Get in touch with us on <a href="mailto:support@anghami.com" style="color: #ffffff; text-decoration: none;">support@anghami.com</a>
                    </p> 
                </div>
            `,
            ar: `
                <div style="font-family: 'Almarai', 'Tahoma', sans-serif; color: #ffffff; font-size: 15px; padding: 24px 0; text-align: right;">
                    <h3 style="font-size: 18px; font-weight: bold;">
                        كيف تحصّل القسيمة:
                    </h3>
                    <ol>
                        <li>قم بتسجيل الدخول الى حساب موجود. إذا ليس لديك حساب، يمكنك انشاء حساب جديد مجاناً من خلال زيارة موقع <a href="https://anghami.com" style="color: #ffffff; text-decoration: none;">anghami.com</a></li>
                        <li>اذهب الى <a href="https://anghami.com/redeem" style="color: #ffffff; text-decoration: none;">anghami.com/redeem</a></li>
                        <li>ادخل الرمز واضغط على استرداد.</li>
                        <li>تم! يمكنك الآن الاستمتاع بكل ميزات أنغامي بلَس.</li>
                    </ol>
                    
                    <h3 style="font-size: 18px; font-weight: bold;">
                        الشروط والأحكام:
                    </h3>
                    <ul>
                        <li>يمكنك إضافة القيمة الى حساب موجود أو انشاء حساب جديد. تضاف القيمة الكاملة الى حساب أنغامي الخاص بك عند الاسترداد.</li>
                        <li>تنتهي صلاحية القسيمة بعد سنة من تاريخ الإصدار. لا إعادة بيع.</li>
                        <li>أنغامي غير مسؤولة عن البطاقات المفقودة أو المسروقة أو الاستخدام غير المصرّح به. لا يمكنك استبدالها إذا تم العبث بها أو تفعيلها.</li>
                        <li>غير قابلة للاسترداد أو الاستبدال نقداً إلا بحال وجوب القانون.</li>
                    </ul>
                    <p>
                        للمزيد من المعلومات والاستفسارات: تواصلوا معنا على: <a href="mailto:support@anghami.com" style="color: #ffffff; text-decoration: none;">support@anghami.com</a>
                    </p>
                </div>
            `
        },
    },
    {
        name: 'opera',
        title: {
            en: `You've just <b>won a Dubai Opera</b><br>gift certificate!`,
            ar: `فزت بقسيمة لدبي أوبرا!`
        },
        text: {
            en: `Open the attachment to redeem your prize.<br>Dress up, and enjoy an elegant experience! ${__keep('en')}`,
            ar: `افتح المرفق لتحصيل٬ واستمتع بتجربة راقية! ${__keep('ar')}`
        },
    },
    {
        name: 'sensasia',
        title: {
            en: `You've just <b>won a Sensasia Spa</b><br>gift certificate!`,
            ar: `فزت بقسيمة لسنسيشيا سبا!`
        },
        text: {
            en: `Open the attachment to redeem your prize.<br>Relax, and enjoy a luxurious experience! ${__keep('en')}`,
            ar: `افتح المرفق لتحصيل٬ واستمتع بتجربة فاخرة! ${__keep('ar')}`
        },
    },
    {
        name: 'wallpaper',
        title: {
            en: `You've just won<br><b>a digital wallpaper!</b>`,
            ar: `فزت بخلفيّة للموبايل!`
        },
        text: {
            en: `Click here to download it!`,
            ar: `اضغط هنا لتحميلها.`
        },
    },
]

const __font = (text, style = '', lang = 'en') => {
    const font = lang === 'ar' ? `'Almarai', 'Tahoma'` : `'Open Sans', 'Arial'`
    return `
        <div style="font-family: ${font}, sans-serif; text-align: center; ${style}">
            ${text}
        </div>
    `
}

const __title = (text, lang = 'en') => {
    return __font(text, `font-size: 28px; line-height: 30px; color: ${gold}; padding-bottom: 64px; font-weight: ${lang === 'ar' ? 'bold' : 'normal'};`, lang)
}

const __text = (text, lang = 'en') => {
    return __font(text, `font-size: 15px; line-height: 18px; font-weight: bold; color: #ffffff; padding-bottom: 32px;`, lang)
}

const baseTemplate = (body, lang = 'en') => {
    const bg = '#000000'
    return `
        <!DOCTYPE html>
        <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <style>
                    @import url('${almarai}');
                    @import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');
                </style>
            </head>
            <body style="margin:0; padding: 0; background-color: ${bg};">
                <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" style="background-color: ${bg}; text-align: center;">
                    <tr><td align="center" style="background: url('${bgimage}') no-repeat top center; background-size: 100% auto;">
                        
                    
                    <table border="0" cellpadding="0" cellspacing="0" style="min-height: 700px; width: 100%; max-width:500px;">
                        <tr><td align="center" style="vertical-align: top; text-align: center; padding: 24px; direction: ${lang === 'ar' ? 'rtl' : 'ltr'};">
                            <div style="text-align: center;">
                                <img src="${lang === 'ar' ? logo_ar : logo_en}" style="width: 140px; margin: 0 auto;" alt="logo" />
                            </div>

                            <div style="padding: 64px 0 80px; text-align: center;">
                                <img src="${lang === 'ar' ? congrats_ar : congrats_en}" style="width: 200px; margin: 0 auto;" alt="congrats" />
                            </div>

                            ${body}

                        </td></tr>
                    </table>

                    </td></tr>
                </table>
            </body>
        </html>
    `
}

export const template = (type, file, lang = 'en') => {
    let text = ''
    const item = __prizes.find(i => i.name === type)
    if(type === 'anghami'){
        text = `
            ${__title(item.title[lang], lang)}
            ${lang === 'ar' ? item.before.ar : item.before.en}
            ${__text(item.text[lang], lang)}
            ${__font(file, `font-size: 48px; font-weight: bold; color: ${gold}; padding-bottom: 32px;`, lang)}
            ${lang === 'ar' ? item.after.ar : item.after.en}
        `
    } else if (type === 'wallpaper') {
        text = `
            ${__title(item.title[lang], lang)}
            ${__text(`<a href="${file}" style="color:#ffffff; text-decoration: none;">${item.text[lang]}</a>`, lang)}
        `
    } else {
        text = `
            ${__title(item.title[lang], lang)}
            ${__text(item.text[lang], lang)}
        `
    }
    return baseTemplate(text, lang)
}
