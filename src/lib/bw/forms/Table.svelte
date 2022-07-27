<script lang="ts">
    import {createEventDispatcher, onMount} from 'svelte';
    const dispatch = createEventDispatcher();
    import { Icon, Paginate, DatePicker, Swal, __date_item, Lottie, api, formatLabel, Dropdown, BASE_URL, decrypt } from "../";

    interface Column {
        label?: string, 
        name?: string,
        class?: string,
        sortable?: any,
        value?: any,
        component?: any,
        componentProps?: any,
        onclick?: any,
        content?: any,
        info?: boolean,
        append?: any,
        prepend?: any,
    }

    interface Columns extends Array<Column>{}

    let data: any = [];
    export let url = ''
    export let searchable = true
    export let exportable = true
    export let dates = true
    export let actions = []
    export let tags = []
    export let btns = []
    let selectedTag: any = null

    export let columns: Columns = Object.keys(data[0] || null).map(i => ({ 
        label: formatLabel(i), 
        name: i
    }));

    let order = 'desc';
    let orderBy = 'createdAt';
    let search = ''
    let loading = false
    let current_page = 1
    let per_page = 30
    let total = 0
    let date_from = ''
    let date_to = ''

    const checkDateRange = str => {
        if(str.includes(' to ')){
            const arr = str.split(' to ')
            if(arr[0] && arr[1]){
                date_from = arr[0]
                date_to = arr[1]
            }
        }
    }

    $: dateRangeValue = (date_from && date_to) ? `${date_from} to ${date_to}` : ''

    let timeout = undefined;
    let calling = false;

    function debounceFn(fn, wait = 300) {
        if (calling) return;
        calling = true;
        timeout = setTimeout(async () => {
            await fn();
            calling = false;
        }, wait);
    }

    const getData = async (fromsearch = false) => {
        if (typeof window === "undefined") return;
        if(!url) return
        if(fromsearch) current_page = 1

        loading = true;
        
        const body = await api.get(url, { 
            search, orderBy, order, page: current_page, date_range: dateRangeValue 
        })

        data = [...body.data]
        dispatch('data', data)

        current_page = body.current_page || 1
        per_page = body.per_page || 30
        total = body.total || 0

        setTimeout(() => loading = false, 500);
    }

    export const onAdd = item => {
        data = [item, ...data]
        total = total + 1
    }
    export const onEdit = item => {
        console.log('editting', item)
        const i = data.findIndex(e => e.id === item.id)
        if(i > -1){
            data[i] = {...item}
        }
    }
    export const onDelete = item => {
        data = [...data].filter(e => e.id !== item.id)
        total = total - 1
    }

    export const onSearch = q => {
        search = q
    }

    export const onRefresh = () => getData()

    let showInfo = false
    let infoContent: any = ''

    // onMount( () => getData() )
    $: data
    $: total
    $: search && debounceFn( () => getData(true), 500 )
    // $: search === '' && debounceFn( () => getData(true), 500 )
    $: (orderBy || order || current_page || (date_from && date_to)) && getData()

    const getColumnName = column => {
        let name = column.label || column.name || ''
        name = name.toLowerCase()
        if(name === 'edit' || name === 'delete' || name === 'avatar') name = ''
        if(name === 'dates' || name === 'dates-auth') name = 'dates'
        return formatLabel(name)
    }

    const getColumnClass = column => {
        let name = column.label || column.name || ''
        name = name.toLowerCase()
        if(name === 'edit' || name === 'delete') return "w-4"
        if(name === 'id') return "md:w-10"
        if(name === 'avatar') return "w-14"
        if(name === 'dates' || name === 'dates-auth') return "md:w-10"
        return column.class || ''
    }

    const confirmDelete = (fn, id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                if(typeof fn === 'function') {
                    const res = await fn();
                    if(res.ok){
                        const arr = data.filter((item) => item.id !== id)
                        data = [...arr]
                        Swal.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                        )
                    } else {
                        Swal.fire('Error', res?.message ?? '', 'error')
                    }
                }
            } else {
                Swal.fire('You are safe!')
            }
        })
    }

    const getToken = () => decrypt(localStorage.getItem('token') ?? '')
</script>

<div class="flex items-center mb-2">
    {#if searchable}
        <div class="col-span-2 w-full md:w-2/3 mb-2 md:mb-0 relative mx-auto text-gray-600">
            <input 
                class="w-full input input-bordered"
                placeholder="Search"
                bind:value={search}
            />
            <span class="absolute right-0 top-0 mt-3 mr-4">
                <Icon name="search" />
            </span>
        </div>
    {/if}

    {#if dates}
        <div class="w-full md:w-1/3 md:ml-2 border border-gray-300 bg-white h-12 p-2 rounded-lg hidden md:flex items-center">
            <DatePicker 
                range 
                on:change={e => checkDateRange(e.detail[1] || '')} 
                value={dateRangeValue}
                placeholder="Limit dates" 
                icon chevron 
            />
        </div>
    {/if}

    {#if search || selectedTag || (date_from && date_to)}
        <div class="btn btn-sm btn-error btn-circle h-10 w-10 ml-2" on:click={() => {
            search = ''
            date_from = ''
            date_to = ''
            selectedTag = null
            getData()
        }}>
            <Icon name="x" />
        </div>
    {/if}
    
    {#if (exportable || Array.isArray(actions) && actions.length)}
        <Dropdown class="hidden md:block">
            <div class="btn btn-sm btn-circle h-10 w-10 ml-2" on:click={null}>
                <Icon name="dots-vertical" />
            </div>

            <div slot="dropdown" class="py-3 px-5">
                {#if exportable}
                    <a href={`${BASE_URL}/export${url}?token=${getToken()}`} target="_blank" class="py-2 flex">
                        <Icon name="download" />
                        <span class="ml-2">Export</span>
                    </a>
                {/if}
                {#each actions as action}
                    {@html action}
                {/each}
            </div>
        </Dropdown>
    {/if}

</div>

{#if tags.length}
    <div class="my-2">
        {#each tags as tag, idg}
            <button class="btn btn-xs mr-2" class:btn-accent={selectedTag === idg} on:click={() => {
                selectedTag = idg
                tag.onClick && tag.onClick()
            }}>
                {tag.name}
            </button>
        {/each}
    </div>
{/if}

{#if btns.length}
    <div class="my-2">
        {#each btns as btn, ida}
            <button class="btn btn-xs mr-2" on:click={btn.onClick}>
                {btn.name}
            </button>
        {/each}
    </div>
{/if}

<div class="overflow-x-auto">
<table 
    class={`table w-full`} 
>
    <thead><tr>
        {#each columns as column, i}
            <th 
                class="capitalize bg-slate-200 duration-100 text-slate-600 hover:text-black p-3 font-normal text-left z-0"
                class:cursor-pointer={column.sortable}
                on:click={() => {
                    if(!column.sortable) return
                    orderBy = column.sortable !== true ? column.sortable : column.name
                    order = order === 'asc' ? 'desc' : 'asc'
                }}
            >
                <div class="flex items-center justify-start {getColumnClass(column)}">
                    {#if column.sortable}
                        <span class="text-slate-400">
                            {#if (orderBy === column.name || orderBy === column.sortable)}
                                <Icon name={order === 'asc' ? 'arrow-sm-up' : 'arrow-sm-down'} size={4} />
                            {:else}
                                <Icon name={'switch-vertical'} size={4} />
                            {/if}
                        </span>
                    {/if}
                
                    <span 
                      class="font-bold mx-2 text-[16px]"
                      class:underline={(orderBy === column.name || orderBy === column.sortable)}
                    >
                      {getColumnName(column)}
                    </span>
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
            <tr 
            class="border-slate-200 border-t border-b px-3 bg-white hover:bg-slate-50"
            >
                {#each columns as column, idx}
                    <td class="relative p-3 font-normal text-md text-left bg-transparent {getColumnClass(column)}">
                        {#if column.prepend}
                            <div>{@html column.prepend(item)}</div>
                        {/if}
                        {#if column.name === 'edit'}
                            <div class="cursor-pointer" on:click={() => typeof column.onclick === 'function' && column.onclick(item)}>
                                <Icon name="pencil" />
                            </div>
                        {:else if column.name === 'delete'}
                            <div class="cursor-pointer" on:click={() => typeof column.onclick === 'function' && confirmDelete(() => column.onclick(item), item.id)}>
                                <Icon name="trash" />
                            </div>
                        {:else if column.name === 'avatar'}
                            <img src={item.avatar} class="w-14 h-14 max-w-14 rounded-full" alt="" />

                        {:else if column.name === 'dates'}
                            {@html __date_item(item.createdAt, 'Created')}
                            {@html __date_item(item.updatedAt, 'Updated')}
                            

                        {:else if column.name === 'dates-auth'}
                            {@html __date_item(item.createdAt, 'Created')}
                            {@html __date_item(item.loginAt, 'Login')}
                            <div class="text-sm">
                                <span class="text-xs text-slate-400">IP: </span>
                                <span class="text-slate-800">{item.loginIp ?? '--'}</span>
                            </div>

                        {:else if column.component}
                            <svelte:component this={column.component} {...(column.componentProps ? column.componentProps(item) : {})} />
                        {:else if column.value}
                            {@html column.value(item)}
                        {:else}
                            {#if column.content}
                                {@html column.content}
                            {:else}
                                {@html item[column.name]}
                            {/if}
                        {/if}

                        {#if column.info}
                            <span 
                                class="inline-flex items-center justify-center w-4 h-4 bg-slate-500 rounded-full text-slate-100 mx-1 cursor-pointer"
                                on:click={() => {
                                    infoContent = item
                                    setTimeout(() => showInfo = true, 100)
                                }}
                            >
                                i
                            </span>
                        {/if}

                        {#if column.append}
                            <div>{@html column.append(item)}</div>
                        {/if}
                    </td>
                {/each}
            </tr>
        {/each}
    </tbody>

</table>

{#if !data.length}
    <div class="flex items-center justify-center mb-3" class:mt-3={loading}>
        <Lottie src={ loading ? 'search_bear' : 'happy'} />
    </div>
{/if}

</div>

<div class="md:flex items-center justify-center mt-4 space-x-4">
    <Paginate small
        bind:current_page
        bind:per_page
        bind:total
        on:navigate={e => {
            const newpage = parseInt(e.detail)
            if(newpage !== current_page) current_page = newpage
        }}
    />
</div>

<input type="checkbox" id="modal-info" class="modal-toggle" bind:checked={showInfo}>
<div class="modal" on:click|self={() => showInfo = false}>
    <div class="modal-box relative w-9/12 max-w-5xl">
        <label for="modal-info" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        <div class="py-4">
            <pre>{JSON.stringify( infoContent, null, 2 )}</pre>
        </div>
    </div>
</div>
