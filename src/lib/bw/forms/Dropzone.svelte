<script>
    import Sortable from './Sortable.svelte';
    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();

    import { Icon } from '..'
    
    export let disabled = false;
    export let title = "Drop files here to upload";
    export let label = ''
    export let help = ''
    export let multiple = false
    export let onlyImages = false
    export let value = ''
    export let error = ''

    export let accept = onlyImages ? 'image/*' : '.pdf,.doc,.xls,.docx,.xlsx,image/*,video/*,audio/*'
    
    let isActive = false;
    let throttleRef = null;
    let fileInput
    let files = []

    const highlight = e => changeHighlight(e, true);
    const unhighlight = e => changeHighlight(e, false);

    const changeHighlight = (e, val) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;
        clearTimeout(throttleRef);
        throttleRef = setTimeout(() => (isActive = val), val ? 0 : 10);
    };

    const formatSize = (bytes, decimals = 2) => {
        if(bytes == 0) return '0 Bytes';
        var k = 1024,
            dm = decimals,
            sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    const readFileAsync = (file) => {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = e =>  resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        })
    }

    const isImage = file => /\.(jpe?g|png|gif|svg)$/i.test(file.name.toLowerCase()) 

    const processMulti = async file => {
        const data = await readFileAsync(file);
        const name = file.name
        const type = file.type || 'unknown'
        const size = formatSize(file.size)
        const is_image = isImage(file)
        const ext = file.name.split('.').pop();
        const newfile = {is_image, ext, name, type, size, data}
        if(multiple){
            files = [...files, newfile]
        } else {
            files = [newfile]
        }
        dispatch('change', files)
    }

    const process = async (e) => {
        unhighlight(e)
        const _files = e.dataTransfer ? e.dataTransfer.files : e.target.files
        await Array.from(_files).forEach.call(_files, processMulti);
    }

    const del = name => {
        files = files.filter((item, index) => item.name !== name)
        dispatch('change', files)
    }

    // $: files

</script>
<div class="mb-6">
    {#if label}
        <div class="font-bold text-md mb-2">{label}</div>
    {/if}
    <div 
        on:dragenter={highlight}
        on:dragover={highlight}
        on:dragleave={unhighlight}
        on:drop={process}
        on:click={ () => fileInput.click() }
        class="relative border-4 border-gray-300 border-dashed rounded-md"
        class:border-blue-600={isActive}
    >
        <input 
            type="file" 
            disabled={disabled} 
            multiple={multiple} 
            class="hidden"
            accept={accept}
            bind:this={fileInput} 
            on:change={e => process(e)} 
        />

        <div class="flex items-center justify-center rounded-md h-20 cursor-pointer">
            <span class="text-lg text-gray-600 cursor-pointer">
                {title}
            </span>
        </div>

    </div>
	
	{#if error}
		<div class="text-red-500 mt-1 text-xs">{error}</div>
	{/if}

    {#if help}
        <div class="text-sm my-1 text-slate-500">{help}</div>
    {/if}

    {#if value && files.length < 1}
        <div class="p-2 border-b flex items-center bg-slate-200 rounded">
            <img src={value} alt="" class="w-20 h-16 rounded object-cover" />
            <div class="flex-1 ml-4">
                Current
            </div>
            <div on:click={() => {
                value = ''
                dispatch('change', files)
            }} class="text-slate-600">
                <Icon name="trash" />
            </div>
        </div>
    {/if}

    <Sortable
        list={files} 
        key="name" 
        on:sort={ev => {
            files = ev.detail
            dispatch('change', files)
        }}
        let:item
        let:index
    >
        <div class="p-2 border-b flex items-center">
            {#if files.length > 1}
                <div class="mr-4 text-slate-400">
                    <Icon name="switch-vertical" size={4} />
                </div>
            {/if}
            {#if item.is_image}
                <img src={item.data} alt="" class="w-20 h-16 rounded object-cover" />
            {/if}
            {#if !item.is_image}
                <div class="w-20 h-16 rounded bg-slate-500 text-white uppercase flex items-center justify-center">
                    {item.ext}
                </div>
            {/if}
            <div class="flex-1 ml-4">
                {item.name}
                <div class="text-sm text-gray-500">
                    {item.size}
                </div>
            </div>
            <div on:click={() => del(item.name)} class="text-slate-600">
                <Icon name="trash" />
            </div>
        </div>
    </Sortable>

</div>
