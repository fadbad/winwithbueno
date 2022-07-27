<script context="module">
    export async function load({ session }) {
        const url = `/en`
        return {
            status: 302,
            redirect: url
        };
    }
</script>
