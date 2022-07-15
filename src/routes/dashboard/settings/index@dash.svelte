<script>
    import { Input, api, Swal, Template } from "$lib/bw";
    import { onMount } from "svelte";


    let opts = {

        mailazy_from_email: '',
        mailazy_from_name: '',
        mailazy_apikey: '',
        mailazy_apisecret: '',

        sendgrid_from_email: '',
        sendgrid_from_name: '',
        sendgrid_apikey: '',

        slack_hook: '',

        onesignal_apikey: '',
        onesignal_app_id: '',

        msegat_apikey: '',
        msegat_username: '',
        msegat_usersender: '',

        twilio_id: '',
        twilio_token: '',
        twilio_from: ''
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
<Template title="Settings">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- MSEGAT -->
        <div class="card bg-white shadow">
            <div class="card-body">
                <div class="card-title">Msegat</div>
                <Input label="Api Key" bind:value={opts.msegat_apikey} />
                <Input label="Username" bind:value={opts.msegat_username} />
                <Input label="Sender Name" bind:value={opts.msegat_usersender} />
            </div>
        </div>

        <!-- ONESIGNAL -->
        <div class="card bg-white shadow">
            <div class="card-body">
                <div class="card-title">One Signal</div>
                <Input label="App ID" bind:value={opts.onesignal_app_id} />
                <Input label="Rest API Key" bind:value={opts.onesignal_apikey} />
            </div>
        </div>

        <!-- SLACK -->
        <div class="card bg-white shadow">
            <div class="card-body">
                <div class="card-title">Slack</div>
                <Input label="Hook" bind:value={opts.slack_hook} />
            </div>
        </div>
        
        <!-- TWILIO -->
        <div class="card bg-white shadow">
            <div class="card-body">
                <div class="card-title">Twilio</div>
                <Input label="ID" bind:value={opts.twilio_id} />
                <Input label="Token" bind:value={opts.twilio_token} />
                <Input label="From" bind:value={opts.twilio_from} />
            </div>
        </div>

        <!-- SENDGRID -->
        <div class="card bg-white shadow">
            <div class="card-body">
                <div class="card-title">Send Grid</div>
                <Input label="Api Key" bind:value={opts.sendgrid_apikey} />
                <Input label="From Email" bind:value={opts.sendgrid_from_email} />
                <Input label="From Name" bind:value={opts.sendgrid_from_name} />
            </div>
        </div>

        <!-- MAILAZY -->
        <div class="card bg-white shadow">
            <div class="card-body">
                <div class="card-title">Mailazy</div>
                <Input label="Api Key" bind:value={opts.mailazy_apikey} />
                <Input label="Api Secret" bind:value={opts.mailazy_apisecret} />
                <Input label="From Email" bind:value={opts.mailazy_from_email} />
                <Input label="From Name" bind:value={opts.mailazy_from_name} />
            </div>
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
