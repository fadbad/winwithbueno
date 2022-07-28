<script>
    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();
    import { Logo, Btn, Scratch } from '$lib'

</script>

<Logo />

<div class="bg-[url(/assets/scratchbg.svg)] bg-bottom pb-72 relative" style="background-size: 100%;">

    

    <div class="container mx-auto max-w-[94%] md:max-w-5xl relative pt-16">

        <div class="absolute -top-20 left-6">
            <img src="/assets/finger.svg" alt="" class="w-28" />
        </div>

        <div class="absolute top-0 left-1/2 -ml-20">
            <img src="/assets/arrow.svg" alt="" class="w-36" />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 md:gap-4">

            <div class="flex flex-col items-center justify-center">
                <div class="skew-x-6 -rotate-[9deg] text-primary montserrat font-extrabold text-center tracking-tighter text-[36px] italic">
                    SCRATCH
                </div>
                <div class=" bg-primary -mt-2 -skew-x-[9deg] -rotate-[9deg] px-4 py-3 montserrat font-extrabold text-white text-center text-[64px] tracking-tighter leading-none">
                    TO REVEAL
                </div>
                <div class="skew-x-6 -rotate-[9deg] text-primary montserrat font-extrabold text-center tracking-tighter text-[32px] italic leading-none mt-2 z-[60]">
                    YOUR PRIZE
                </div>
            
            </div>

            <div class="relative">
                <div class="absolute inset-0">
                    <img src="/assets/scratchBar.svg" alt="" />
                </div>
                <div class="relative mt-5">
                    <Scratch />
                </div>
            </div>
        </div>
    </div>

</div>
