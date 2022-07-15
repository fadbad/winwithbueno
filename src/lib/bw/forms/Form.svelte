<script lang="ts">
    import { onMount } from "svelte";
    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();
    import { PanelRight, FormSchema, Icon, api, Swal }  from "$lib/bw";

    export let show = false
    export let schema = []
    export let withAdd = true
    export let loading = false
    export let url = ''
    export let method = 'post' // post, patch
    let title

    const defaultItem = (item = null) => {
        let i = {}
        schema.forEach(s => {
            if(item){
                i['id'] = item.id,
                i[s.name] = item[s.name] ?? ''
            } else {
                i[s.name] = s.default ?? ''
            }
            
            return s
        })
        return i
    }

    let __item: any = defaultItem()

    export const onAdd = () => {
        title = 'Create New'
        __item = defaultItem()
        schema = [...schema.map(e => {
            e.value = e.defaultValue ?? ''
            return e
        })]
        method = 'post'
        setTimeout(() => show = true, 100)
    }

    export const onEdit = item => {
        title = 'Edit'
        __item = defaultItem(item)
        schema = [...schema.map(e => {
            e.value = e.name === 'image' ? item['avatar'] : item[e.name] ?? ''
            return e
        })]
        method = 'patch'
        setTimeout(() => show = true, 100)
    }

    export const onDelete = async item => await api.delete(url, {id: item.id})

    const handle = async () => {
        loading = true
        try {
            const res = await api[method](url, {...__item})
            if(res.ok){
                show = false
                dispatch(method, res)
            } else {
                Swal.fire('Error', res.message, 'error')
            }
        } catch (error) {
            Swal.fire('Error', JSON.stringify(error), 'error')
        }

        loading = false
    }

    $: __item
    $: schema
    $: show

    onMount(() => {

    })
</script>

{#if show}
    <PanelRight {title} bind:show>
        <FormSchema schema={[...schema.map(e => {
            e.onChange = v => {
                const x = {...__item}
                x[e.name] = v
                __item = {...x}
            }
            return e
        })]} />
        <button 
            class="btn px-10 mb-5" 
            class:loading
            on:click={handle}
        >
            Save
        </button>
    </PanelRight>
{/if}

{#if withAdd}
    <button 
        class="btn btn-circle fixed bottom-3 right-3 text-white z-10 shadow-md bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-600 border-0 w-16 h-16"
        on:click={onAdd}
        >
        <Icon name="plus" size={8} />
    </button>
{/if}
