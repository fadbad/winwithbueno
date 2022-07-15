<script>
    import { goto } from "$app/navigation";
    import { Input } from "$lib/bw"
    import LoginImg from "$lib/bw/dashboard/img/login.png"
    
    let email

    const reset = () => {
        goto('/dashboard/auth/login')
    }
</script>

<div class="w-screen h-screen grid grid-cols-1 md:grid-cols-2">
        
    <div class="flex items-center justify-center relative">
        <div class="w-3/4">
            
            <form on:submit|preventDefault={reset}>
                <div class="fs-13 mb-4 color-gray-500">
                    Forgot your password? Don't worry, we'll reset it for you.
                </div>

                <Input 
                    bind:value={email}
                    label={'Email'}
                    type={'email'}
                    required
                    class={'mb-4'}
                />
                
                <button type="submit" class="btn px-10">
                    SEND INSTRUCTIONS
                </button>
            </form>
            
            <div class="mt-6">
                <a href="/dashboard/auth/login" class="inline-block p-3 text-gray-500 text-[13px]">
                    Back to login
                </a>
            </div>

        </div>
        
    </div>
    <div class="hidden md:flex relative items-center justify-end">
        <img src={LoginImg} class="max-h-screen	" alt="" />
    </div>
</div>
