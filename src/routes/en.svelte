<script>
    import { Template } from "$lib"
    import { Home, Code } from "$lib/front/steps/en"
    let step = 1
</script>

<Template>
    {#if step === 1}
        <Home on:change={() => step = 2} />
    {:else if step === 2}
        <Code on:change={ev => {
            // sms = ev.detail
            step = 3
        }} />
    {/if}
</Template>
