<script>
    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();
</script>

<div class="flex justify-center">
    <img src="/assets/bueno.png" alt="" class=" h-28" />
</div>
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
        <svg viewBox="0 0 4070 1584" width="100%">
            <mask id="a" fill="#fff"><path d="m0 0h4070v1583.8088h-4070z" fill="#fff" fill-rule="evenodd"/></mask>
            <path d="m4071.1089 14.2248002c-579.137-109.086-916.01 441.4369998-1689.59 555.1329998-538.575 79.156-1668.741-535.5489998-2382.628 175.02v839.431h4070.203z" fill="#ffcc02" fill-rule="evenodd" mask="url(#a)" transform="translate(0 .1911)"/>
        </svg>

    </div>

    <div class="relative z-50">
        <div class="container mx-auto">
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

                        <a href="/" class="inline-block px-10 py-3 montserrat font-extrabold tracking-tighter text-3xl text-white bg-primary rounded-md" on:click|preventDefault={() => dispatch('change', 'yes')}>
                            START NOW
                        </a>
                    </div>
                </div>

                <img src="/assets/tv.png" alt="tv" class="w-full md:w-[600px] -mt-16" />
            </div>
        </div>
    </div>
</div>

<div class="relative bg-[url(/assets/grass.png)] bg-repeat-x h-[290px] bg-top -mt-24 z-10" ></div>
