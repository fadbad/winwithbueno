<script>
    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();
    import { Logo, LangSwitch } from '$lib'
</script>

<Logo />

<div class="absolute right-4 top-4">
    <LangSwitch lang="en" />
</div>

<div class="flex flex-col items-center justify-center -mt-4 md:-mt-0 z-[60] relative">
    <div class="skew-x-6 -rotate-[9deg] text-primary font-extrabold text-center tracking-tighter text-[32px] italic">
        SURPRISING TASTE.
    </div>
    <div class=" bg-primary -mt-2 -skew-x-[9deg] -rotate-[9deg] px-4 py-3 font-extrabold text-white text-center text-[54px] tracking-tighter leading-none">
        BIG WINS!
    </div>
    <div class="skew-x-6 -rotate-[9deg] text-primary font-extrabold text-center tracking-tighter text-[18px] italic leading-none mt-2">
        TV, SURROUND SYSTEM AND MANY MORE.
    </div>

</div>

<div class="relative">

    <div class="absolute inset-0 z-0 -mt-24 bg-[url(/assets/yellow-mobile.svg)] md:bg-[url(/assets/yellow.svg)] bg-cover"></div>

    <div class="relative z-50">
        <div class="container mx-auto max-w-5xl">
            <div class="flex flex-col md:flex-row justify-between">

                <div class="order-2 md:order-1 text-white relative mt-4 md:mt-20 ml-3 md:ml-auto">
                    <div class="flex items-center">
                        <img src="/assets/icon-one.svg" alt="" class="mr-2 h-6" />
                        <div class="hacen text-[20px]">
                            ابحث عن الرمز الترويجي داخل الغلاف
                        </div>
                    </div>

                    <div class="font-bold text-[14px]">
                        Find the promo code inside the wrapper
                    </div>

                    <div class="flex items-center mt-3">
                        <img src="/assets/icon-two.svg" alt="" class="mr-2 h-6" />
                        <div class="hacen text-[20px]">
                            ابحث عن الرمز الترويجي تحت المغلّف للمينيز 
                        </div>
                    </div>

                    <div class="font-bold text-[14px]">
                        Find the promo code inside the sleeve for minis
                    </div>

                    <div class="mt-10 md:mt-32">

                        <button type="button" class="inline-block px-10 py-3 font-extrabold tracking-tighter text-3xl text-white bg-primary rounded-md" on:click={() => dispatch('change', 'yes')}>
                            START NOW
                        </button>
                    </div>
                </div>

                <img src="/assets/tv.png" alt="tv" class="order-1 md:order-2 w-full md:w-[500px] md:-mt-16 object-contain" />
            </div>
        </div>
    </div>
</div>

<div class="relative bg-[url(/assets/grass.png)] bg-repeat-x h-[400px] md:h-[240px] -mt-[290px] md:-mt-[140px] z-10 bg-top bg-cover" ></div>
