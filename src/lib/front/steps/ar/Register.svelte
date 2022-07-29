<script>
    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();
    import { assets_aecities, fetcher, countries_codes } from '$lib/bw'
    import { Logo, Input, Btn, validEmail, validPhone } from '$lib'

    let lang = 'en'
    let terms = false

    let defaultState = {
        first_name: '',
        last_name: '',
        email: '',
        code: '',
        mobile: '',
        city: '',
    }

    let errors = {...defaultState}
    let state = {...defaultState}

    $: state 
    $: errors

    const check = () => {
        let err = false
        errors = {...defaultState}

        if(state.first_name.length < 2) {
            errors.first_name = 'required'
            err = true
        }

        if(state.last_name.length < 2) {
            errors.last_name = 'required'
            err = true
        }

        if(!validEmail(state.email)) {
            errors.email = 'valid email required'
            err = true
        }
        
        if(state.code.length < 1){
            errors.code = 'required'
            err =true
        }

        if(!validPhone(state.mobile)){
            errors.mobile = 'valid phone number required'
            err = true
        }

        if(state.city.length < 1) {
            errors.city = 'required'
            err = true
        }

        return err
    }

    const submit = async () => {
        // if(check()) return
        dispatch('change', state)
        setTimeout(() => {
            errors = {...defaultState}
            state = {...defaultState}
        }, 100)
    }
    
</script>

<Logo />

<div class="container mx-auto max-w-3xl pb-40 rtl">
    <div class="text-center text-primary font-bold text-2xl my-4">
        التسجيل
    </div>

    <div class="p-4 bg-white rounded-lg shadow-lg">
        <div class="grid grid-cols-1 md:grid-cols-2 md:gap-4">
            <Input 
                label={'الاسم'}
                lang={'ar'}
                bind:value={state.first_name}
                on:change={ev => state.first_name = ev.detail}
                error={errors.first_name}
            />
            <Input 
                label={'الشهرة'}
                lang={'ar'}
                bind:value={state.last_name}
                on:change={ev => state.last_name = ev.detail}
                error={errors.last_name}
            />
        </div>

        <Input 
            label={'البريد الإلكتروني'}
            type='email'
            lang={'ar'}
            bind:value={state.email}
            on:change={ev => state.email = ev.detail}
            error={errors.email}
        />

        <div class="grid grid-cols-1 md:grid-cols-2 md:gap-4">

            <div class="flex items-start">
                <div class="w-[42%] ml-2">
                    <Input 
                        label={'الرمز'}
                        type={'select'}
                        lang={'ar'}
                        options={countries_codes.map(i => {
                            return {
                                label: i,
                                value: i,
                            }
                        })}
                        on:change={ev => state.code = ev.detail}
                        error={errors.code}
                    />
                </div>
                <div class="w-full">
                    <Input
                        label={'الرقم'}
                        lang={'ar'}
                        bind:value={state.mobile}
                        on:change={ev => state.mobile = ev.detail}
                        error={errors.mobile}
                    />
                </div>
            </div>

            <Input 
                label={'المدينة'}
                type={'select'}
                lang={'ar'}
                isSearchable={false}
                options={assets_aecities.map(i => {
                    return {
                        label: i.en,
                        value: i.en,
                    }
                })}
                on:change={ev => state.city = ev.detail}
                error={errors.city}
            />
        </div>

        <div>
            <label class="flex items-center my-3 w-full">
                <input type="checkbox" class="checkbox checkbox-accent checkbox-md rounded ml-2" bind:checked={terms} /> 
                <span class="leading-none ml-1">
                    لقد قرأت وأوافق على  <a href="/privacy" target="_blank" class=" text-primary font-bold underline">سياسة الخصوصية</a>
                </span>
            </label>
        </div>

        <div class="mx-8 pb-10 my-6">
            <Btn 
                onPress={submit}
                text={'ادخال'}
                disabled={!terms}
            />
</div>

    </div>
</div>
