<script lang="ts">
    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();
	import autoresize from './utils/autoresize'

	export let id = `inp-${Date.now()}`;
	export let type = 'text';
	export let value = '';
	export let name = '';
	export let label = '';
	export let required = false;
	export let disabled = false;
	export let divClass = 'relative z-0 mb-6 w-full group';
	export let color = 'blue'
	export let help = ''
	export let maxChars:any = ''
	export let error = ''

	export let inputClass = 'block pt-4 pb-2 px-0 w-full text-md text-slate-900 bg-transparent border-0 border-b-2 border-slate-300 appearance-none dark:text-white dark:border-slate-600 focus:outline-none focus:ring-0 peer';
	
	export let labelClass = 'absolute text-md text-slate-500 dark:text-slate-400 duration-300 transform -translate-y-6 scale-75 top-4 -z-10 origin-[0] peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6';
	
	export let inputColorClass = 'block bg-transparent w-16 h-10';
	export let labelColorClass = 'absolute text-md text-slate-500 dark:text-slate-400 transform left-0 top-1 -translate-y-6';

	// const getInputClass = color => `focus:border-${color}-600 dark:focus:border-${color}-500`

	// const getLabelClass = color => `peer-focus:text-${color}-600 peer-focus:dark:text-${color}-500`

	const setType:any = node => node.type = type

	$: value && dispatch('change', value)
	$: leftChars = parseInt(maxChars) - (value?.length ?? 0)
	$: value = parseInt(maxChars) - (value?.length ?? 0) <=0 ? value.substring(0, maxChars) : value
	$: getInputClass = `focus:border-${color}-600`
	$: getLabelClass = `peer-focus:text-${color}-600`
	$: color = error.length > 0 ? 'red' : 'blue'

</script>

<span class="hidden">
	<span class="focus:border-red-600 peer-focus:text-red-600"></span>
	<span class="focus:border-blue-600 peer-focus:text-blue-600"></span>
</span>

<div class={`${divClass} ${ $$props.class || '' } ${type === 'color' ? `mt-10` : ``}`}>
	{#if type === 'textarea'}
		<textarea 
			bind:value 
			use:autoresize
			{name} 
			class={`${inputClass} ${getInputClass}`} 
			placeholder=" " 
			{required} 
			{disabled}
			class:cursor-not-allowed={disabled}
		></textarea>
	{:else if type === 'color'}
		<input 
			bind:value 
			type="color"
			{name} 
			class={`${inputColorClass}`} 
			placeholder=" " 
			{required} 
			{disabled}
			class:cursor-not-allowed={disabled}
		/>
	{:else if type === 'number'}
		<input 
			bind:value 
			type="number"
			{name} 
			class={`${inputClass} ${getInputClass} outline-none appearance-none`} 
			placeholder=" " 
			{required} 
			{disabled}
			class:cursor-not-allowed={disabled}
		/>
	{:else}
		<input 
			bind:value 
			use:setType 
			{name} 
			class={`${inputClass} ${getInputClass}`} 
			placeholder=" " 
			{required} 
			{disabled}
			class:cursor-not-allowed={disabled}
		/>
	{/if}
	<label 
		for={id} 
		class={`${type === 'color' ? labelColorClass : labelClass} ${getLabelClass}`}
	>{label}</label>

	{#if error}
		<div class="text-red-500 mt-1 text-xs">{error}</div>
	{/if}

	<div class="flex items-center justify-between text-sm mt-2">
		{#if help}
			<div class="text-slate-400">{help}</div>
		{/if}
		{#if maxChars}
			<div 
				class="text-slate-500"
				class:text-yellow-500={leftChars <= 1}
			>{leftChars} characters left</div>
		{/if}
	</div>
</div>
