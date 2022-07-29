<script>
    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();
    import { fetcher, Swal } from '$lib/bw'
    import { Logo } from '$lib'

    let code = ''
    let loading = false

    const handle = async () => {
        // SEEE3TR2
        if(!code) return Swal.fire('يرجى تزويد الكود', '', 'error')
        if(code.length !== 8) return Swal.fire('تنسيق الكود غير مقبول', '', 'warning')

        loading = true
        const res = await fetcher.asJson().get('/api/codes', { code })
        loading = false
        if(res.ok){
            if(res.data.valid){
                dispatch('change', code)
            } else {
                Swal.fire('حدث خطأ', res.data.message, 'warning')
            }
        } else {
            Swal.fire('حدث خطأ', 'خطأ في الاتصال بالخادم', 'warning')
        }

    }
</script>

<Logo />

<div class="block md:flex items-center justify-center md:mt-16 pb-10">

    <div class="flex flex-col items-center justify-center">
        <div class="skew-x-6 -rotate-[9deg] text-primary font-extrabold text-center tracking-tighter text-[48px] italic mb-1">
            ادخل الرمز
        </div>
        <div class=" bg-primary -mt-2 -skew-x-[9deg] -rotate-[9deg] px-4 py-3 font-extrabold text-white text-center text-[80px] tracking-tighter leading-none">
            لتربح
        </div>
    </div>
    <div class="mt-10 md:mt-0 md:ml-10">
        <div class="w-[96vw] md:w-[400px] relative  mx-auto">
            <div class="absolute inset-0 ">
                <img src="/assets/goal.svg" alt="" class="w-[96vw] md:w-[400px]" />
            </div>
            <div class="px-8 py-6">
                <div class="bg-white rounded-2xl shadow-md p-4 h-[155px] relative z-10">
                    <div class="text-sm mb-3 text-center text-black">ادخل الرمز على الغلاف</div>
                    <input type="text" bind:value={code} class="border-primary border-2 rounded-lg bg-[#e9e9e9] w-full py-1 px-2" />
                    <div class="mt-4 flex justify-center">
                        <button type="button" class="btn border-0 h-[30px] min-h-[36px] bg-primary hover:bg-secondary rounded-md px-6 py-1 font-extrabold text-white text-xl" on:click|preventDefault={handle} class:loading={loading}>
                            تأكيد
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </div>

</div>

<div class="z-50 relative flex md:justify-end w-screen overflow-hidden">
    <img src="/assets/chocolate.png" alt="" class="mt-4 md:h-52 md:-mr-16 md:mt-10 md:-rotate-[20deg]" />
</div>
