<script>
    import { Seo } from '$lib/bw'
    import { onMount } from 'svelte';
    import {Logo, Footer, Hamburger} from './svg'
    
    export let title = ''
    export let siteTitle = 'Win with Bueno'

    let withHeader = 'yes'

    $: hasHeader = withHeader === 'yes'

    onMount(() => {
        withHeader = localStorage.getItem('withHeader') || 'no'
    })
</script>

<Seo siteTitle={siteTitle} title={title}  />

<div class="min-h-screen w-screen bg-white">
    
    {#if hasHeader}
        <!-- HEADER -->
        <div class="h-[50px] bg-[#f3410e]">
            <div class="container mx-auto px-3 md:px-0">
                <div class="flex relative justify-end ">
                    <div class=" absolute left-0">
                        <Logo />
                    </div>
        
                    <!-- HAMBURGER -->
                    <button class="mt-[6px]">
                        <Hamburger />
                    </button>
                </div>
            </div>
        </div>
    {/if}

    <div class="pt-[50px] min-h-[100px]">
        <slot />
    </div>

    <!-- FOOTER WAVE -->
    <div class="relative -mt-14 z-20">
        <Footer />
        <div class="bg-primary h-10"></div>
    </div>
</div>
