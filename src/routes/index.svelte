<!-- <script context="module">
    export async function load({ session, url }) {

        const withHeader = url.searchParams.get('withHeader') || 'yes'

        return {
            status: 302,
            redirect: `/en?withHeader=${withHeader}`
        };
    }
</script> -->

<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores'
    const withHeader = $page.url.searchParams.get('withHeader') || 'yes'

    onMount(() => {
        localStorage.setItem('withHeader', withHeader)
        setTimeout(() => {
            window.location.href = '/en'
        }, 1)
    })
</script>
<div></div>
