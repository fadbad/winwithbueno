<script>
    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();
    import { fetcher, Swal } from '$lib/bw'
    import { Logo } from '$lib'

    let code = 'SEEE3TR2'
    let loading = false

    const handle = async () => {
        // SEEE3TR2
        if(!code) return Swal.fire('Kindly supply the code', '', 'error')
        if(code.length !== 8) return Swal.fire('Code format not accepted', '', 'warning')

        loading = true
        const res = await fetcher.asJson().withCors().get('/api/codes', { code })
        loading = false
        if(res.ok){
            if(res.data.valid){
                dispatch('change', code)
            } else {
                Swal.fire('Error occured', res.data.message, 'warning')
            }
        } else {
            Swal.fire('Error occured', 'Error communicating with server', 'warning')
        }

    }
</script>

<Logo />

<div class="block md:flex items-center justify-center md:mt-24 pb-40">

    <div class="flex flex-col items-center justify-center">
        <div class="skew-x-6 -rotate-[9deg] text-primary montserrat font-extrabold text-center tracking-tighter text-[32px] italic">
            ENTER THE CODE
        </div>
        <div class=" bg-primary -mt-2 -skew-x-[9deg] -rotate-[9deg] px-4 py-3 montserrat font-extrabold text-white text-center text-[64px] tracking-tighter leading-none">
            TO WIN!
        </div>
    </div>
    <div class="mt-10 md:mt-0 md:ml-10">
        <div class="w-[96vw] md:w-[400px] relative  mx-auto">
            <div class="absolute inset-0 ">
                <img src="/assets/goal.svg" alt="" class="w-[96vw] md:w-[400px]" />
            </div>
            <div class="px-8 py-6">
                <div class="bg-white rounded-2xl shadow-md p-4 h-[155px] relative z-10">
                    <div class="montserrat text-sm mb-3 text-center text-black">ENTER THE CODE ON YOUR WRAPPER</div>
                    <input type="text" bind:value={code} class="border-primary border-2 rounded-lg bg-[#e9e9e9] w-full py-1 px-2" />
                    <div class="mt-4 flex justify-center">
                        <button type="button" class="btn border-0 h-[30px] min-h-[30px] bg-primary hover:bg-secondary rounded-md px-6 py-1 montserrat font-extrabold text-white" on:click|preventDefault={handle} class:loading={loading}>
                            CONFIRM
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>

<div class="z-50 hidden md:flex justify-end relative">
    <img src="/assets/chocolate.png" alt="" class=" absolute right-0 -top-[178px] h-52 mt-10" />
</div>
