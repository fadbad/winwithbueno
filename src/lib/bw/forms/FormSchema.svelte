<script>
    import { 
        Input, Select, Dropzone, formatLabel, RadioGroup
    } from "$lib/bw"

    const label = field => field.label ?? formatLabel(field.name)

    export let schema
</script>

<div>
    {#each schema as field}
        {#if field.type === 'select'}
            <Select 
                label={label(field)}
                help={field.help ?? ''}
                items={field.options ?? []} 
                value={field.value ?? null}
                placeholder={label(field)}
                isMulti={field.multiple ?? false}
                on:change={e => {
                    field.onChange(e.detail?.value)
                    field.value = e.detail?.value
                }}
            />
        {:else if field.type === 'upload'}
            <Dropzone 
                label={label(field)}
                help={field.help ?? ''}
                value={field.value ?? null}
                onlyImages={field.onlyImages ?? false}
                on:change={e => field.onChange(e.detail[0].data)}
            />
        {:else if field.type === 'switch'}
            <RadioGroup 
                help={field.help ?? ''}
                items={field.options ?? []}
                defaults={field.value ?? null}
                value={field.value ?? null}
                on:change={e => field.onChange(e.detail)}
            />
        {:else if field.type === 'toggle'}
            <input 
                type="checkbox" 
                class="toggle" 
                checked={field.value ?? null} 
                on:change={e => field.onChange(e.target.checked)}
            />
        {:else}
            <Input 
                type={field.type}
                label={label(field)}
                help={field.help ?? ''}
                on:change={e => field.onChange(e.detail)}
                bind:value={field.value}
            />
        {/if}
    {/each}
</div>
