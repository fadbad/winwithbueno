<script>
    export let text = ''
    export let style = ''
    export let onPress = () => {}
    export let disabled = false
    export let loading = false
</script>
<div class="flex w-full justify-center {$$props.containerClass || ''}">
    <button 
        type="button" 
        class="btn bg-[#DCAF50] text-[#0b0100] font-bold uppercase text-xl rounded w-[70%] py-2 border-0 hover:bg-[#DCA32A] {$$props.class || ''}" 
        class:opacity-50={disabled}
        class:pointer-events-none={disabled}
        class:cursor-default={disabled}
        class:loading={loading}
        style={style}
        on:click={() => !disabled && onPress()}
    >
        {text}
    </button>
</div>
