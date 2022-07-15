<script>
    import { Input, Select, getAuthUser, setActiveMenu, Template, api, Swal } from "$lib/bw"
    import { onMount } from "svelte";
    
    let email = getAuthUser('email')
    let oldPassword = ''
    let oldPasswordErr = ''
    let password = ''
    let passwordErr = ''
    let loading = false

    const process = async () => {
        let err = false
        if(password.trim().length < 8){
            passwordErr = 'Required. Min 8 characters'
            err = true
        }
        
        if(password.trim().length < 5){
            oldPasswordErr = 'Required.'
            err = true
        }

        if (err) return false
        passwordErr = oldPasswordErr = ''

        loading = true
        const res = await api.post('/bitwize/account', {
            oldPassword,
            password
        })
        if(res.ok){
            Swal.fire('Success', 'Password Changed', 'success')
        } else {
            Swal.fire('Error Occured!', res.message || '', 'error')
        }
        loading = false
    }

    onMount(() => {
        setActiveMenu('Settings')
    })
</script>
<Template title="Settings - Account">

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-2">
            <div class="card bg-white">
                <div class="card-body">
                    <h2 class="card-title pb-2 mb-5 border-b">Account Information</h2>
                    <form on:submit|preventDefault={process}>
                        <Input 
                            label={'Email'}
                            bind:value={email}
                            disabled
                            help={'To change your login email, you need to consult with management'}
                        />

                        <Input
                            label={'Old Password'}
                            type={'password'}
                            bind:value={oldPassword}
                            error={oldPasswordErr}
                        />

                        <Input
                            label={'New Password'}
                            type={'password'}
                            help={'New password must be at least 8 characters long'}
                            bind:value={password}
                            error={passwordErr}
                        />

                        <div class="card-actions justify-end">
                            <button class="btn" type="submit" class:loading>Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="md:col-span-1">
            <div class="card bg-white overflow-visible">
                <div class="card-body">
                    <h2 class="card-title pb-2 mb-5 border-b">Preferences</h2>
                    <div class="flex justify-center mb-4">
                        <img src={getAuthUser('avatar')} alt="" class="w-24 h-24 object-cover rounded-full" />
                    </div>
                    <Select 
                        label={'Prefered Language'}
                        items={[
                            {value: 'en', label: 'English'},
                            {value: 'ar', label: 'Arabic'},
                        ]} 
                        help={'Selecting this will change the language of your dashboard'}
                    />

                    <div>
                        Please note, while all currency and date adjustments are complete, language translations are at varying degrees of completion.
                    </div>
                </div>
            </div>
        </div>
    </div>

</Template>
