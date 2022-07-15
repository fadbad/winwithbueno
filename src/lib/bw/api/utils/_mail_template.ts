import config from "../config"

export const mailTemplate = (text) => {
    const baseUrl = config.BASE_URL
    const template = mailBaseTemplate({
        bgcolor: '#000',
        header_display: 'logo',
        logo: `${baseUrl}/assets/front/images/logo.png`,
        logo_height: 32,
        header_bgcolor: '#000',
        body_bgcolor: '#404040',
        body_color: '#fff',
        footer_bgcolor: '#404040',
        footer_color: '#ffffff',
    })

    return template.replace('%%CONTENT%%', text)
}

export const mailBaseTemplate = (args:any = {}) => {
    const defaults = {
        preview: false,
        bgcolor: '#53585f',
        borderradius: 6,
        logo: null,
        logo_height: 60,
        header_display: 'text', // text, logo
        header_content: '',
        header_bgcolor: '#fff',
        header_color: '#222',
        header_textsize: 24,
        header_textalign: 'center',
        body_bgcolor: '#fff',
        body_color: '#222',
        body_textsize: 18,
        body_textalign: 'center',
        footer_bgcolor: '#fff',
        footer_color: '#222',
        footer_textsize: 16,
        footer_textalign: 'center',
        footer_content: '',
        bottomfooter_color: '#fff',
        bottomfooter_textsize: 14,
        bottomfooter_textalign: 'center',
        bottomfooter_content: '',
    }

    args = { ...defaults, ...args }

    const content_preview = `<p>Here you will see the email content</p><p>The email template is responsive and fully customizable.</p><h3>Placeholders</h3><p>You can use any of these placeholders in your emails content or templates and they will be automatically replaced</p>`

    const CONTENT = args.preview ? content_preview : '%%CONTENT%%';

    const start = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            </head>
            <body style="margin:0; padding: 0; background-color: ${args.bgcolor};">
                <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" style="background-color: ${args.bgcolor}; padding:20px;"><tbody>
                    <tr><td align="center" valign="top">
                        <table border="0" cellpadding="0" cellspacing="0" id="template_container" style="border-radius: ${args.borderradius}px !important; width: 680px;" width="680"><tbody>
    `
    
    if (args.header_display == 'logo'){
        args.header_content = `<img src="${args.logo}" style="max-height:${args.logo_height}px;"></img>`;
    }

    const header = `
        <tr><td align="center" valign="top">
            <table border="0" cellpadding="0" cellspacing="0" id="template_header" style="
background-color: ${args.header_bgcolor}; color: ${args.header_color}; -webkit-border-top-left-radius:${args.borderradius}px !important; -webkit-border-top-right-radius:${args.borderradius}px !important; border-top-left-radius:${args.borderradius}px !important; border-top-right-radius:${args.borderradius}px !important; border-bottom: 0; font-family:Arial; font-weight:bold; line-height:100%; vertical-align:middle; " width="100%"><tbody>
                <tr><td style="padding:0;">
                    <h1 id="logo" style="color: ${args.header_color}; margin:0; padding: 16px 24px; display:block; font-family:Arial; font-size: ${args.header_textsize}px; font-weight:bold; text-align: ${args.header_textalign};">
                        ${args.header_content}
                    </h1>
                </td></tr>
            </tbody></table>
        </td></tr>
    `;

    const body = `
        <tr><td align="center" valign="top">
            <table border="0" cellpadding="0" cellspacing="0" id="template_body" width="100%"><tbody>
                <tr><td id="mailtpl_body_bg" style="background-color: ${args.body_bgcolor};" valign="top">
                    <table border="0" cellpadding="20" cellspacing="0" width="100%"><tbody>
                        <tr><td valign="top" style="padding:0;">
                            <div id="mailtpl_body" style="color: ${args.body_color};font-family:Arial;font-size: ${args.body_textsize}px;line-height:150%;text-align:${args.body_textalign};padding:15px;">
                                ${CONTENT}
                            </div>
                        </td></tr>
                    </tbody></table>
                </td></tr>
            </tbody></table>
        </td></tr>
    `;

    const footer = `
        <tr><td align="center" valign="top">
            <table border="0" cellpadding="10" cellspacing="0" id="template_footer" style="background: ${args.footer_bgcolor};-webkit-border-bottom-left-radius:${args.borderradius}px !important;-webkit-border-bottom-right-radius:${args.borderradius}px !important;border-bottom-left-radius:${args.borderradius}px !important;border-bottom-right-radius:${args.borderradius}px !important;" width="100%"><tbody>
                <tr><td valign="top" style="padding:0;">
                    <table border="0" cellpadding="10" cellspacing="0" width="100%"><tbody>
                        <tr><td colspan="2" id="credit" style="border:0;color: ${args.footer_color};font-family: Arial;font-size: ${args.footer_textsize}px;line-height:125%;text-align:${args.footer_textalign};padding:10px;" valign="middle">
                            <div>${args.footer_content}</div>
                        </td></tr>
                    </tbody></table>
                </td></tr>
            </tbody></table>
        </td></tr>
    `;

    const bottom_footer = `
        <tr><td align="center" valign="top">
            <table border="0" cellpadding="10" cellspacing="0" id="template_after_footer" style="" width="100%"><tbody>
                <tr><td style="padding:0;" valign="top">
                    <table border="0" cellpadding="10" cellspacing="0" width="100%"><tbody>
                        <tr><td colspan="2" id="after_footer" style="border:0;color: ${args.bottomfooter_color};font-family: Arial;font-size: ${args.bottomfooter_textsize}px;line-height:125%;text-align:${args.bottomfooter_textalign};padding:10px;" valign="middle">
                            <div>${args.bottomfooter_content}</div>
                        </td></tr>
                    </tbody></table>
                </td></tr>
            </tbody></table>
        </td></tr>
    `;

    const end = `
                </tbody></table>
            </td></tr>
        </tbody></table>
        </body></html>
    `;

    return `${start}${header}${body}${footer}${bottom_footer}${end}`;
}
