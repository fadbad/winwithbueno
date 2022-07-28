<script>
    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();
    import { Logo } from '$lib'
</script>

<Logo />

<div class="flex flex-col items-center justify-center">
    <div class="skew-x-6 -rotate-[9deg] text-primary montserrat font-extrabold text-center tracking-tighter text-[32px] italic">
        SURPRISING TASTE.
    </div>
    <div class=" bg-primary -mt-2 -skew-x-[9deg] -rotate-[9deg] px-4 py-3 montserrat font-extrabold text-white text-center text-[54px] tracking-tighter leading-none">
        BIG WINS!
    </div>
    <div class="skew-x-6 -rotate-[9deg] text-primary montserrat font-extrabold text-center tracking-tighter text-[18px] italic leading-none mt-2 z-[60]">
        TV, SURROUND SYSTEM AND MANY MORE.
    </div>

</div>

<div class="relative">

    <div class="absolute inset-0 z-0 -mt-24">
        <svg viewBox="0 0 100 60" width="100%" xmlns="http://www.w3.org/2000/svg"><path d="m100 .34980678c-14.22166-2.68257002-22.4941297 10.85552372-41.4906569 13.65145982-13.2255936 1.9465514-40.9786755-13.16986318-58.5093431 4.3039749v41.6900635h99.9505184z" fill="#ffcc02" fill-rule="evenodd" transform="translate(0 .004695)"/></svg>
    </div>

    <div class="relative z-50">
        <div class="container mx-auto max-w-5xl">
            <div class="flex justify-between">

                <div class="text-white relative mt-20 ml-auto">
                    <div class="flex items-center">
                        <img src="/assets/icon-one.svg" alt="" class="mr-2 h-6" />
                        <div class="hacen text-[20px]">
                            ابحث عن الرمز الترويجي داخل الغلاف
                        </div>
                    </div>

                    <div class="montserrat font-bold text-[14px]">
                        Find the promo code inside the wrapper
                    </div>

                    <div class="flex items-center mt-3">
                        <img src="/assets/icon-two.svg" alt="" class="mr-2 h-6" />
                        <div class="hacen text-[20px]">
                            ابحث عن الرمز الترويجي تحت المغلّف للمينيز 
                        </div>
                    </div>

                    <div class="montserrat font-bold text-[14px]">
                        Find the promo code inside the sleeve for minis
                    </div>

                    <div class=" mt-32">

                        <button type="button" class="inline-block px-10 py-3 montserrat font-extrabold tracking-tighter text-3xl text-white bg-primary rounded-md" on:click={() => dispatch('change', 'yes')}>
                            START NOW
                        </button>
                    </div>
                </div>

                <img src="/assets/tv.png" alt="tv" class="w-full md:w-[600px] -mt-16" />
            </div>
        </div>
    </div>
</div>

<div class="relative bg-[url(/assets/grass.png)] bg-repeat-x h-[290px] bg-top -mt-24 z-10" ></div>
