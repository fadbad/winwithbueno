<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    onMount(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setTimeout(() => goto('/dashboard/auth/login'), 400)
    })
</script>

<div class="w-screen h-screen flex bg-gray-700 items-center justify-center">
    <h2 class="text-white uppercase text-3xl font-thin">
        Logging out...
    </h2>
</div>
