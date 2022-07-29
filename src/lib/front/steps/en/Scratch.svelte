<script>
    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();
    import { Logo, Scratch } from '$lib'

</script>


<div class="bg-[url(/assets/scratchbg-mobile.svg)] md:bg-[url(/assets/scratchbg.svg)] bg-top md:bg-bottom bg-no-repeat pb-72 relative" style="background-size: 100%;">
    
    <Logo />
    

    <div class="container mx-auto max-w-[98%] md:max-w-5xl relative -mt-4 md:-mt-0 md:pt-16">

        <div class="absolute top-[340px] md:-top-20 left-6">
            <img src="/assets/finger.svg" alt="" class="w-20 md:w-28" />
        </div>

        <div class="absolute top-28 md:top-0 right-4 md:right-auto md:left-1/2 md:-ml-20">
            <img src="/assets/arrow.svg" alt="" class="w-28 md:w-36" />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 md:gap-4">

            <div class="flex flex-col items-center justify-center pb-12 md:pb-0">
                <div class="skew-x-6 -rotate-[9deg] text-primary font-extrabold text-center tracking-tighter text-[24px] md:text-[36px] italic mb-1">
                    SCRATCH
                </div>
                <div class=" bg-primary -mt-2 -skew-x-[9deg] -rotate-[9deg] px-4 py-3 font-extrabold text-white text-center text-[40px] md:text-[64px] tracking-tighter leading-none">
                    TO REVEAL
                </div>
                <div class="skew-x-6 -rotate-[9deg] text-primary font-extrabold text-center tracking-tighter text-[24px] md:text-[32px] italic leading-none mt-1 z-[60]">
                    YOUR PRIZE
                </div>
            
            </div>

            <div class="relative w-[367px] mx-auto md:mx-0">
                <div class="absolute inset-0">
                    <img src="/assets/scratchBar.svg" alt="" />
                </div>
                <div class="relative mt-4 ml-[1.6px]">
                    <Scratch image="/assets/sorry.webp" on:finished={() => dispatch('change', '')} />
                </div>
            </div>
        </div>
    </div>

</div>
