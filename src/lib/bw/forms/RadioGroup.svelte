<script>
    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();
    import { uuid } from "$lib/bw"

    export let items = []
    export let btnClass = ''
    export let name = uuid()
    export let defaults = ''
    export let label = ''

    let selected = defaults;

    const onChange = (e) => {
		selected = e.currentTarget.value;
        dispatch('change', selected)
	}
</script>

{#if label}
    <div class="font-bold text-md mb-2">{label}</div>
{/if}

<div class="btn-group flex md:block {$$props.class ?? 'mb-4'}">
    {#each items as item}
        <input 
            type="radio" 
            name={name} 
            data-title={item['label']} 
            value={item['value']}
            class="btn flex-1 md:flex-none {btnClass}"
            checked={selected === item['value']}
            on:change={onChange}
        />
        
    {/each}
</div>
