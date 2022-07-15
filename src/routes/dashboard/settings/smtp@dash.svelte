<script lang="ts">
    import { Input, Template, api, Swal, RadioGroup } from "$lib/bw";
    import { onMount } from "svelte";


    let opts:any = {
        smtp_email: '',
        smtp_name: '',
        smtp_enc_type: '',
        smtp_host: '',
        smtp_port: '',
        smtp_username: '',
        smtp_password: '',
    }

    let loading = false

    const save = async () => {
        loading = true 
        const res = await api.post('/bitwize/options', opts)
        Swal.fire('Options Saved', '', 'success')
        loading = false
    }

    onMount(async () => {
        loading = true 
        const res = await api.get('/bitwize/options')
        res.forEach( i => opts[i.key] = i.value )
        loading = false
    })

    $: opts

</script>
<Template title="Settings" header="SMTP">
    <div class="card bg-white shadow">
        <div class="card-body">
            <Input label="Email Address" bind:value={opts.smtp_email} />
            <Input label="From Name" bind:value={opts.smtp_name} />

            <RadioGroup 
                items={[
                    {label: 'None', value: ''},
                    {label: 'SSL', value: 'ssl'},
                    {label: 'TLS', value: 'tls'},
                ]}
                defaults={opts.smtp_enc_type ?? ''}
                on:change={ev => opts.smtp_enc_type = ev.detail}
            />

            <Input label="SMTP Host" bind:value={opts.smtp_host} />
            <Input label="SMTP Port" bind:value={opts.smtp_port}
                help={'NONE: 25, SSL: 465, TLS: 587'}
            />
            <Input label="SMTP Username" bind:value={opts.smtp_username} />
            <Input label="SMTP Password" bind:value={opts.smtp_password} />
        </div>
    </div>

    <div class="py-6">
        <button 
            class="btn btn-lg btn-block" 
            class:loading
            on:click={save}
        >
            SAVE
        </button>
    </div>

</Template>
