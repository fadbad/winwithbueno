<script>
    import { Lottie, __date_item, api, json_list, Template, Modal }  from "$lib/bw";
    import { onMount } from "svelte";

    let loading = false
    let data = []
    let more = ''

    const delLogs = async () => {
        loading = true;
        await api.get('/bitwize/logs/flush')
        setTimeout(async () => {
            loading = false
            await getData()
        }, 500);
    }

    const getData = async () => {
        if (typeof window === "undefined") return;

        loading = true;
        let body = await api.get('/bitwize/logs')

        if (body){
            body.sort( (a,b) => {
                if (a.timestamp && b.timestamp){
                    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                }
                return -1
            })
            data = [...body]
        }


        setTimeout(() => loading = false, 500);
    }

    let columns = [
        { id: "level", value: i => `
            <div class="badge badge-error">${i.level}</div>
            <div>${__date_item(i.timestamp)}</div>
        ` },
        { name: "message", class: 'whitespace-normal', value: i => (`
            <div>${i.message ?? i.query ?? '---'}</div>
        `) },
        { id: 'more'}
    ]
    
    onMount(() => {
        getData()
    })
</script>
<Template title="Error Logs">
    <div class="overflow-x-auto">
        <table 
            class={`table w-full`} 
        >
            <thead><tr>
                {#each columns as column, i}
                    <th 
                        class="capitalize bg-slate-200 duration-100 text-slate-600 hover:text-black p-3 font-normal text-left z-0 {column.class || ''}"
                    >
                        <div 
                            class="flex items-center justify-start"
                            class:justify-end={column.id === 'more'}
                        >
                            {#if column.id === 'level'}

                                <button class="btn btn-sm mr-2" class:loading on:click={getData}>
                                    Reload
                                </button>

                            {:else if column.id === 'more'}

                                <button class="btn btn-sm btn-warning" on:click={delLogs}>
                                    Delete
                                </button>

                            {:else}
                            <span class="font-bold mx-2 text-lg">
                                {column.label || column.name || ''}
                            </span>
                            {/if}
                        </div>
                    </th>
                {/each}
            </tr></thead>

            {#if loading}
                <tr><td colspan="9999" class="p-0 relative h-1">
                    <progress class="progress progress-info w-full h-1 absolute inset-0"></progress>
                </td></tr>
            {/if}

            <tbody>
                {#each data as item, i}
                    <tr class="hover:bg-slate-50 border-slate-200 border-t border-b px-3">
                        {#each columns as column, idx}
                            <td class="relative p-3 font-normal text-lg text-left {column.class || ''}">
                                {#if column.id === 'more'}
                                    <label 
                                        for="modal-more" class="btn btn-sm"
                                        on:click={() => more = json_list(item)}
                                    >More</label>
                                {:else if column.component}
                                    <svelte:component this={column.component} {...(column.componentProps ? column.componentProps(item) : {})} />
                                {:else if column.value}
                                    {@html column.value(item)}
                                {:else}
                                    {@html item[column.name]}
                                {/if}
                            </td>
                        {/each}
                    </tr>
                {/each}
            </tbody>

        </table>
    </div>
    {#if !loading && !data.length}
        <div class="mb-3 flex items-center justify-center">
            <Lottie src={'happy'} width={300} height={300} />
        </div>
    {/if}
</Template>

<Modal id="modal-more" width="w-8/12 max-w-5xl">
    {@html more}
</Modal>
