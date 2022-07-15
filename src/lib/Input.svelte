<script lang="ts">
    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();
	import { 
		Icon, Select, SveltyPicker, sveltypicker_ar, sveltypicker_en
	} from "./bw"

	export let id = `inp-${Date.now()}`;
	export let type = 'text';
    export let placeholder = '';
    export let options: any = [];
	export let value = '';
	export let name = '';
	export let label = '';
	export let required = false;
	export let disabled = false;
	export let divClass = 'relative w-full group mb-3';
	export let help = ''
	export let maxChars:any = ''
	export let error = ''
	export let startDate = null
	export let endDate = null
	export let lang = 'en'
	export let isSearchable = true

	export let inputClass = 'p-3 bg-black rounded text-white w-full placeholder-[#ccc] border-2 border-primary';
	
	export let labelClass = 'block mb-[2px] mx-3 color-gold uppercase font-normal text-xs font-semibold';


	const setType:any = node => node.type = type

	$: value && dispatch('change', value)
	$: leftChars = parseInt(maxChars) - (value?.length ?? 0)
	$: value = parseInt(maxChars) - (value?.length ?? 0) <=0 ? value.substring(0, maxChars) : value

</script>

<div class={`${divClass} ${ $$props.class || '' }`}>
    <label 
		for={id} 
		class={`${labelClass}`}
	>{label} {required ? '*' : ''}</label>
	{#if type === 'textarea'}
		<textarea 
			bind:value
			{name} 
			class={`input ${inputClass} min-h-[100px]`} 
			{placeholder}
			{required} 
			{disabled}
			class:cursor-not-allowed={disabled}
		></textarea>
	{:else if type === 'select_orig'}
        <select 
            bind:value 
            class={`select ${inputClass} leading-none font-normal text-[#DCAF50]`}
        >
            {#if placeholder}
                <option value="">{placeholder}</option>
			{:else}
                <option value=""></option>
            {/if}
            {#each options as option}
                <option value={option.value || option}>{option.label || option}</option>
            {/each}
        </select>
	{:else if type === 'select'}
		<Select 
			placeholder={placeholder}
			items={options}
			isSearchable={isSearchable}
			value={value}
			on:change={ev => {
				console.log('dispatched', ev.detail)
				dispatch('change', { detail: ev.detail?.value || ''})
				value = ev.detail?.value
			}}
			on:clear={ev => dispatch('change', { detail: '' })}
			containerStyles={`
				padding: 0.75rem; 
				background: #000; 
				border-radius: 0.25rem; 
				width: 100%; 
				line-height: 1; 
				height: 3rem; 
				border: 2px solid #DCAF50; 
				--inputColor: #fff; 
				--placeholderColor: #ccc; 
				--indicatorColor: #DCAF50; 
				--indicatorFill: #DCAF50; 
				--indicatorStroke: #DCAF50; 
				--clearSelectColor: #DCAF50; 
				--clearSelectHoverColor: #fff; 
				--clearSelectFocusColor: #DCAF50; 
				--indicatorTop: 14px;
				--indicatorRight: ${lang === 'ar' ? 'auto' : '10px'};
				--indicatorLeft: ${lang === 'ar' ? '10px' : 'auto'};
				--clearSelectRight: ${lang === 'ar' ? 'auto' : '10px'};
				--clearSelectLeft: ${lang === 'ar' ? '10px' : 'auto'};
				--selectedItemPadding: ${lang === 'ar' ? '0 0 0 20px' : '0 20px 0 0'};
				--internalPadding: 0 0.75rem;
			`}
			selectedItemStyles={`color: #fff`}
			wrapperClasses={''}
		/>
	{:else if type === 'number'}
		<input 
			bind:value 
			type="number"
			{name} 
			class={`input ${inputClass} outline-none appearance-none`} 
			{placeholder}
			{required} 
			{disabled}
			class:cursor-not-allowed={disabled}
		/>
	{:else if type === 'date'}
		<div class="relative">
			<SveltyPicker 
				{placeholder}
				{required} 
				{disabled}
				inputClasses={`input ${inputClass} outline-none appearance-none cursor-pointer`}
				format="yyyy-mm-dd"
				bind:value
				startDate={startDate}
				endDate={endDate}
				i18n={lang === 'ar' ? sveltypicker_ar : sveltypicker_en}
			/>
			<div class="absolute right-2 top-3 text-[#DCAF50] date-input-icon">
				<Icon name="calendar" size={6} />
			</div>
		</div>
	{:else}
		<input 
			bind:value 
			use:setType 
			{name} 
			class={`input ${inputClass}`} 
			{placeholder}
			{required} 
			{disabled}
			class:cursor-not-allowed={disabled}
		/>
	{/if}

	{#if error}
		<div class="mt-1 text-xs text-secondary font-bold mx-3">{error}</div>
	{/if}

    {#if help || maxChars}
	<div class="flex items-center justify-between text-sm mt-2">
		{#if help}
			<div>{help}</div>
		{/if}
		{#if maxChars}
			<div 
				class:text-yellow-500={leftChars <= 1}
			>{leftChars} characters left</div>
		{/if}
	</div>
    {/if}
</div>
