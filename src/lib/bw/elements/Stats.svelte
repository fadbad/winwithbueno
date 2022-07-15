<script>
    import { Icon } from "$lib/bw"
    export let items = []
</script>
<div class="stats shadow w-full {$$props.class || ''}">

    {#each items as item}
        <div class="stat">
            {#if item.icon}
                <div class="stat-figure {item.color || ''}">
                    <Icon name={item.icon} size={8} />
                </div>
            {/if}

            {#if item.title}
                <div class="stat-title">{item.title}</div>
            {/if}

            {#if item.value}
                <div class="stat-value {item.color || ''}">{item.value}</div>
            {/if}

            {#if item.desc}
                <div class="stat-desc">{item.desc}</div>
            {/if}
        </div>
    {/each}
    
</div>
