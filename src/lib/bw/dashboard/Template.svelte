<script>
    import { onMount } from "svelte";
    import { navigating } from "$app/stores";
    import { browser } from "$app/env";
    import { goto } from "$app/navigation";
    import Menu from "./Menu.svelte";

    import { Seo, api, encrypt, Swal, Lottie } from "$lib/bw"
    export let title = 'Dashboard'
    export let header = ''
    let canRender = false

    onMount(async () => {
        const token = localStorage.getItem('token')
        if(!token) goto('/dashboard/auth/login')
        try {
            const json = await api.post('/auth/fetch')
            if(json.ok){
                localStorage.setItem('token', encrypt(json.token))
                localStorage.setItem('user', encrypt(JSON.stringify(json.user)))
                canRender = true
            } else {
                goto('/dashboard/auth/login')
            }
        } catch (error) {
            Swal.fire('Error', error, 'error')
            goto('/dashboard/auth/login')
        }
    })
</script>
<div data-theme="winter" class="dashboard-layout">
    
    <Seo siteTitle={'Lays Gourmet'} title={title}  />
    
        {#if !!$navigating}
            <div class="w-full h-1 absolute top-0 left-0 z-50">
                <progress class="progress progress-info w-full h-1 absolute inset-0"></progress>
            </div>
        {/if}
        
        {#if canRender}
            <Menu>
                {#if header}
                    <div class="text-xl font-bold mb-2">
                        {@html header}
                    </div>
                {/if}
                <slot />
            </Menu>
        {/if}
    
</div>
<style>
    :global .table th:first-child{
        z-index: 0;
    }
</style>
