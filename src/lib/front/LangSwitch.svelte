<script>
    import {fly} from 'svelte/transition'

    import { Icon, clickOutside } from "$lib/bw"

    export let lang = 'en'
    let showLang = false
</script>

<div class="relative rounded border border-black px-3 py-1 z-[100]" use:clickOutside={() => showLang = false}>
    <div class="flex items-center justify-between w-full cursor-pointer" on:click={() => showLang = !showLang}>
        <div>
            {#if lang === 'ar'}
                <span class="text-xl">🇦🇪</span>
                <span class="mx-1 hacen -mt-1">عربي</span>
            {:else}
                <span class="text-xl">🇺🇸</span>
                <span class="montserrat mx-1 font-medium">English</span>
            {/if}
        </div>
        <Icon name="chevron-down" size={4} />
    </div>
    {#if showLang}
        <div 
            class="absolute top-full left-0 right-0 bg-white rounded py-2 px-3 mt-[3px]"
            transition:fly={{ y: -12 }}
        >
            <div class="flex-col">
                <a href="/en" class="flex items-center">
                    <span class="text-xl">🇺🇸</span>
                    <span class="montserrat font-medium mx-1">English</span>
                </a>
                <a href="/ar" class="flex items-center">
                    <span class="text-xl">🇦🇪</span>
                    <span class="mx-1 hacen -mt-1">عربي</span>
                </a>
            </div>
        </div>
    {/if}
</div>
