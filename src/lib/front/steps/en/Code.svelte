<script>
    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();
</script>

<div class="flex justify-center">
    <img src="/assets/bueno.png" alt="" class=" h-28" />
</div>

<div class="flex items-center justify-center mt-24 pb-40">

    <div class="flex flex-col items-center justify-center">
        <div class="skew-x-6 -rotate-[9deg] text-primary montserrat font-extrabold text-center tracking-tighter text-[32px] italic">
            ENTER THE CODE
        </div>
        <div class=" bg-primary -mt-2 -skew-x-[9deg] -rotate-[9deg] px-4 py-3 montserrat font-extrabold text-white text-center text-[64px] tracking-tighter leading-none">
            TO WIN!
        </div>
    </div>

    <div class="w-[310px] ml-10 relative">
        <div class="absolute inset-0 h-[165.11px]">
            <img src="/assets/goal.svg" alt="" class="w-[310px]" />
        </div>

        <div class="mx-8 my-6 bg-white rounded-md shadow p-4 h-[125px] relative z-10">

        </div>
    </div>
</div>

<div class="z-50 flex justify-end relative">
    <img src="/assets/chocolate.png" alt="" class=" absolute right-0 -top-[178px] h-52 mt-10" />
</div>
