<script>
    import { Template } from "$lib"
    import { Home, Code, Register, Terms, Scratch } from "$lib/front/steps/ar"
    let step = 1
    let code = ''
    let user = {}
</script>

<Template lang="ar">
    {#if step === 1}
        <Home on:change={() => step = 2} />
    {:else if step === 2}
        <Code on:change={ev => {
            code = ev.detail
            step = 3
        }} />
    {:else if step === 3}
        <Register on:change={ev => {
            user = ev.detail
            step = 4
        }} />
    {:else if step === 4}
        <Terms on:change={() => step = 5} />
    {:else if step === 5}
        <Scratch on:change={() => step = 6} />
    {/if}
</Template>
