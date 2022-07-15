<script>
    import { slide } from "svelte/transition";
    import { createEventDispatcher } from "svelte";
  
    export let closeOnClick = false;
    export let disabled = false;
  
    let isOpen = false;
    let dropdownRef;
    let hostRef;
  
    let innerHeight;
    let innerWidth;
    let maxHeight = 300; // auto
    let dropdownTop = "calc(100% + 4px)";
    let dropdownLeft = "0px";
  
    const dispatch = createEventDispatcher();
  
    const toggle = (state = !isOpen) => {
        isOpen = disabled ? false : state;
        dispatch(isOpen ? "open" : "close", null);
    };
    const close = () => {
        if (isOpen) toggle(false);
    };
  
    $: {
        if (dropdownRef && hostRef) {
            const { height, width } = dropdownRef.getBoundingClientRect();
            const { top, left, height: hostHeight } = hostRef.getBoundingClientRect();
    
            maxHeight = height > innerHeight ? innerHeight : height;
            if (top + hostHeight + maxHeight > innerHeight) {
                dropdownTop = `${innerHeight - maxHeight - top}px`;
            } else if (top + hostHeight + height < innerHeight) {
                dropdownTop = "calc(100% + 4px)";
            }
    
            if (left + width > innerWidth) {
                dropdownLeft = `${innerWidth - left - width}px`;
            } else if (left + width < innerWidth) {
                dropdownLeft = "0px";
            }
        }
    }
</script>
  
<div
    on:click|stopPropagation={() => toggle()}
    class={`inline-block relative ${$$props.class || ''}`}
    bind:this={hostRef}
>
    <slot />
    <div class="max-h-0 overflow-visible">
        {#if isOpen}
            <div
                style={`top:${dropdownTop}; right: 0; min-width: 200px;`}
                class="z-10 absolute top-[100%] min-w-full rounded shadow-md bg-white overflow-auto"
                transition:slide|local={{ duration: 200 }}
            >
                <div
                    bind:this={dropdownRef}
                    style={maxHeight ? `max-height:${maxHeight}px; ` : ''}
                    on:click|stopPropagation={closeOnClick ? close : undefined}
                >
                    <slot name="dropdown" />
                </div>
            </div>
        {/if}
    </div>
</div>
<svelte:body on:click={close} />
<svelte:window bind:innerHeight bind:innerWidth />
  
  