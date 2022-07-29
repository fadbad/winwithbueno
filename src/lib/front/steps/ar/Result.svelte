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

<div>
    <div class="flex flex-col items-center justify-center">
        <div class="skew-x-6 -rotate-[9deg] text-primary font-extrabold text-center tracking-tighter text-[48px] italic mb-1">
            حظ أوفر
        </div>
        <div class=" bg-primary -mt-2 -skew-x-[9deg] -rotate-[9deg] px-4 py-3 font-extrabold text-white text-center text-[40px] md:text-[64px] tracking-tighter leading-none">
            في المرة القادمة!
        </div>
    </div>

    <div class="md:hidden -mt-5">
        <img src="/assets/bg-ball-mobile.svg" alt="" class="w-full" />
    </div>

    <div class="hidden md:block -mt-8">
        <img src="/assets/bg-ball.svg" alt="" class="w-full" />
    </div>

    <div class="rtl text-center px-6 text-primary -mt-4">
        <h2 class="font-extrabold text-3xl">بسرعة!</h2>
        <p class="font-bold text-xl my-2">احصل على كيندر بوينو وجرّب مجدداً لفرصة الفوز بالهدية الكبرى!</p>
        <p>اضغط <a href="https://kinder.com" class="underline font-bold">هنا</a> لاكتشاف مجموعة منتجاتنا</p>
    </div>
    
    <div class="z-50 relative flex md:justify-end w-screen overflow-hidden">
        <img src="/assets/chocolate.png" alt="" class="mt-4 md:h-52 md:-mr-16 md:mt-10 md:-rotate-[20deg]" />
    </div>

</div>
