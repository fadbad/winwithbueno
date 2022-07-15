<script>
    import { fly } from "svelte/transition";
    import { Icon }  from "$lib/bw";
    export let show
    export let title = 'Edit'
</script>

{#if show}
    <div 
        class="fixed w-screen h-screen inset-0 bg-slate-400 bg-opacity-50 z-10"
        on:click={() => show = false}
    ></div>
    <div 
        class="fixed top-0 right-0 h-screen w-[90%] md:w-[70%] bg-white rounded-l-[24px] p-6 shadow-md z-20 overflow-y-scroll"
        transition:fly={{duration: 300, x: 600}}
    >
        <div class="flex items-center justify-between border-b mb-2 pb-2">
            <div>
                <h2 class="font-bold text-2xl">
                    {title}
                </h2>
            </div>
            <div 
                class="w-10 h-10 rounded-full bg-slate-100 shadow flex items-center justify-center cursor-pointer"
                on:click={() => show = false }
            >
                <Icon name={'x'} />
            </div>
        </div>

        <slot />
        
    </div>
{/if}
