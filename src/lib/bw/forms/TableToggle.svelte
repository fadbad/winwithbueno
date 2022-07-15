<script>
    import { api } from '../lib'
    let url = '/bitwize/update'
    export let table = 'user'
    export let field = 'verified'
    export let id = 0
    export let value = false

    const handleChange = async e => {
        const v = e.target.checked
        await api.post(url, {table, id, field, value: v})
    }
</script>

<input type="checkbox" class="toggle" bind:checked={value} on:change={handleChange}>
