<script>
    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();
    import { Logo, Btn } from '$lib'

    let lang = 'en'
    let terms = false
    let privacy = false

    const submit = async () => {
        if(terms && privacy) {
            dispatch('change', 'yes')
        }
    }
</script>

<Logo />

<div class="container mx-auto max-w-[94%] md:max-w-3xl pb-40">
    <div class="text-center text-primary montserrat font-bold text-2xl my-4 leading-none">
        TERMS AND<br />CONDITIONS
    </div>

    
    <div class="overflow-y-scroll text-black mb-4" style="height: calc(100vh * 0.35);">
        <ol>
            <li>Promotion is valid from 20 June until 13 July 2022 in the United Arab Emirates (the &ldquo;Promotion&rdquo;).</li>
            <li>Buy any Lay's pack (twin or tripack) and get a chance to win instant prizes.&nbsp;</li>
            <li>Upon checkout, the shopper must scan the QR code and will be directed to the promotion microsite.</li>
            <li>If the shopper wins, an email will be sent to the email address provided by the shopper with the prize details.</li>
            <li>Validity of the prize will be as per the terms and conditions specified in the email.</li>
            <li>Promotion is available to all residents and non-residents of the UAE, aged 16 and above, excluding in-store promoters, all and any subsidiary or affiliate companies of PepsiCo, Saudi Snack Foods Ltd, PepsiCo Bottlers, and any other individuals/groups involved in this promotion.</li>
            <li>The Prizes are not subject to refund, division, transfer, or exchange for any other item or cash.</li>
            <li>The Prizes are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranty of any kind either expressed or implied, including but not limited to implied warranties of merchantability or fitness for a specific purpose or non-infringement.</li>
            <li>Prizes to be won:</li>
            <li>Anghami &ndash; 425 codes &ndash; 1 month subscription</li>
            <li>Vox &ndash; 200 tickets</li>
            <li>Dubai Opera &ndash; 50 gift certificates</li>
            <li>Senseasia SPA experience &ndash; 50 gift vouchers</li>
            <li>The Organizer's decisions in relation to any aspect of the Promotion are final and binding on every person who enters and/or partakes in the Promotion.</li>
            <li>By participating in this promotion, you agree to the privacy policy of PepsiCo; to view the privacy policy, please visit http://www.pepsico.com</li>
            <li>Saudi Snack Foods Co. Ltd. (the &ldquo;Organizer&rdquo;) reserves the right to cancel this promotion or make changes to the Terms and Conditions from time to time at their sole discretion and without notice, and it is the participating shoppers' responsibility to review the Terms for any changes.</li>
            <li>Continued participation in the Promotion following any amendments to the Terms and Conditions will be deemed acceptance of such changes.</li>
            <li>Participants understand that entry to the Promotion does not create an affiliation between the Participants and the Organizer.</li>
            <li>The Organizer and their related companies and entities are respectively the exclusive owners of all copy, text, software, graphics, logos, pictures, designs and all copyright, trademarks and other intellectual property or proprietary rights and all associated rights relating to the Promotion.</li>
            <li>The Terms and Conditions, together with any other notices published by the Organizer on the Website and/or on advertising material related to the Promotion, shall constitute the entire Terms and Conditions governing the relationship between Participants and the Organizer concerning the participation in the Promotion.</li>
            <li>This promotion is subject to the laws of the United Arab Emirates.</li>
            <li>By participating in this promotion, you acknowledge that you reviewed and accepted the above Terms and Conditions.</li>
            <li>the winners agree and acknowledge that the Company is not liable or can't be held accountable for any direct, incidental, consequential, indirect or penalizing damages due to the winners' participation; and</li>
            <li>the winners may have to partake in some publicity and consent to the full use of their names, photographs, personal data and likeness in such publicity.</li>
        </ol>
    
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 md:gap-4">

        <label class="flex items-center my-3 w-full">
            <input type="checkbox" class="checkbox checkbox-accent checkbox-md rounded mr-2" bind:checked={terms} /> 
            <span class="leading-none ml-1 text-black">
                I agree with the Terms & Conditions
            </span>
        </label>

        <label class="flex items-center my-3 w-full">
            <input type="checkbox" class="checkbox checkbox-accent checkbox-md rounded mr-2" bind:checked={privacy} /> 
            <span class="leading-none ml-1 text-black">
                I agreed with the <a href="/privacy" target="_blank" class=" text-primary font-bold underline">Privacy Policy</a>
            </span>
        </label>
    </div>

    <div class="mx-8 my-6">
        <Btn 
            onPress={submit}
            text={'SUBMIT'}
            disabled={!terms || !privacy}
        />
    </div>

</div>

<style>
    ol {
        padding: 0 32px 10px;
        list-style: decimal;
        line-height: 1.1;
        font-size: 14px;
    }
    ol li {
        margin-bottom: 8px;
    }
</style>
