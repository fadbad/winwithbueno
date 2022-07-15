<script lang="ts">
    import { Buffer } from 'buffer';
    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();
    
    export let disabled = false;
    export let title = "Drop file here to upload";
    export let label = ''
    export let help = ''
    export let error = ''
    
    let isActive = false;
    let throttleRef = null;
    let fileInput
    let FILE = null

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

    const process = async (e) => {
        unhighlight(e)
        const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0]
        console.log('file', file);
        
        const name = file.name
        const type = file.type || 'unknown'
        const size = formatSize(file.size)
        const ext = file.name.split('.').pop();
        FILE = { ext, name, type, size }

        dispatch('change', file)
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
            class="hidden"
            accept={'video/*'}
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


    {#if FILE}
        <div class="p-2 border-b flex items-center">
            <div class="w-20 h-16 rounded bg-slate-500 text-white uppercase flex items-center justify-center">
                {FILE.ext}
            </div>
            <div class="flex-1 ml-4">
                {FILE.name}
                <div class="text-sm text-gray-500">
                    {FILE.type} - {FILE.size}
                </div>
            </div>
        </div>
    {/if}
</div>
