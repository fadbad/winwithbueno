<script>
    import { goto } from "$app/navigation";
    import { Input, Swal, api, encrypt } from "$lib/bw"
    import LoginImg from "$lib/bw/dashboard/img/login.png"
    
    // let email = 'ifadbad@gmail.com', password = 'password'
    let email = '', password = ''

    let loading = false

    const login = async () => {
        loading = true
        const json = await api.post('/auth/login', {email, password})
        
        loading = false
        if(json.ok){
            localStorage.setItem('token', encrypt(json.token))
            localStorage.setItem('user', encrypt(JSON.stringify(json.user)))
            goto('/dashboard')
        } else {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            Swal.fire('Invalid login', json.message || '', 'error')
        }
        
    }
</script>

<div class="w-screen h-screen grid grid-cols-1 md:grid-cols-2">
        
    <div class="flex items-center justify-center relative">
        <div class="w-3/4">
            
            <div class="pb-4 text-[24px] font-black italic tracking-tight">
                WELCOME BACK!
            </div>
            <form on:submit|preventDefault={login}>
                <Input
                    label="Email"
                    bind:value={email}
                    type={'email'}
                    required
                    autofocus
                />
            
                <Input
                    label="Password"
                    bind:value={password}
                    type={'password'}
                    required
                />
            
                <div class="text-right my-3">
                    <a href="/dashboard/auth/reset" class="inline-block primary-text font-bold fs-[13px]">
                        Forgot your Password?
                    </a>
                </div>
            
                <div class="right-align">
                    <button type="submit" class="btn px-10" class:loading>LOGIN</button>
                </div>
            </form>

        </div>
        
    </div>
    <div class="hidden md:flex relative items-center justify-end">
        <img src={LoginImg} class="max-h-screen	" alt="" />
    </div>
</div>
