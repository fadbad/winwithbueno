<script>
	// https://flatpickr.js.org/
	import { onMount, createEventDispatcher } from 'svelte';
	import flatpickr from './flatpickr';
	import './flatpickr/styles/main.css'
	import './flatpickr/styles/themes/airbnb.css'

	import weekSelectPlugin from './flatpickr/plugins/weekSelect/weekSelect'
	import monthSelectPlugin from './flatpickr/plugins/monthSelect'
	import rangePlugin from './flatpickr/plugins/rangePlugin'

	import { Icon } from '../..'

	const hooks = new Set([
		'onChange',
		'onOpen',
		'onClose',
		'onMonthChange',
		'onYearChange',
		'onReady',
		'onValueUpdate',
		'onDayCreate',
	]);

	export let value = '',
		formattedValue = '',
		element = null,
		dateFormat = null,
		options = {},
		icon = false,
		chevron = false,
		range = false,
		monthview = false,
		weekview = false;

	let ready = false;

	let secondInputID = `flatpickr-second-${Date.now()}`;

	let plugins = []

	if(range) plugins.push( rangePlugin({ input: `#${secondInputID}`}) )
	if(monthview) plugins.push( monthSelectPlugin() )
	if(weekview) plugins.push( weekSelectPlugin() )

	options.plugins = plugins

	export let input = undefined, fp = undefined;

	export { fp as flatpickr };

	$: if (fp && ready) {
		fp.setDate(value, false, dateFormat);
	}

	$: value && fp.setDate(value, false, dateFormat);

	onMount(() => {
		const elem = element || input;

		const opts = addHooks(options);
		opts.onReady.push(() => {
			ready = true;
		});

		fp = flatpickr(
			elem,
			Object.assign(opts, element ? { wrap: true } : {})
		);

		return () => {
			fp.destroy();
		};
	});

	const dispatch = createEventDispatcher();

	$: if (fp && ready) {
		for (const [key, val] of Object.entries(addHooks(options))) {
			fp.set(key, val);
		}
	}

	function addHooks(opts = {}) {
		opts = Object.assign({}, opts);

		for (const hook of hooks) {
			const firer = (selectedDates, dateStr, instance) => {
				dispatch(stripOn(hook), [selectedDates, dateStr, instance]);
			};

			if (hook in opts) {
				// Hooks must be arrays
				if (!Array.isArray(opts[hook])) opts[hook] = [opts[hook]];

				opts[hook].push(firer);
			} else {
				opts[hook] = [firer];
			}
		}

		if (opts.onChange && !opts.onChange.includes(updateValue))
			opts.onChange.push(updateValue);

		return opts;
	}

	function updateValue(newValue, dateStr, fp) {
		const mode = fp?.config?.mode ?? 'single';

		value = mode === 'single' ? newValue[0] : newValue;
		formattedValue = dateStr;
	}

	function stripOn(hook) {
		return hook.charAt(2).toLowerCase() + hook.substring(3);
	}
</script>

<slot>
	<div class="flex w-full items-center" on:click={() => input.click()}>
		{#if icon}
			<div class="hidden md:block">
				<Icon name={'calendar'} />
			</div>
		{/if}

		<div class="flex-1 md:mx-3">
			<input bind:this={input} bind:value {...$$restProps} class="w-full cursor-pointer" />
		</div>

		{#if chevron}
			<div class="hidden md:block">
				<Icon name={'chevron-down'} />
			</div>
		{/if}
	</div>
	{#if range}
		<input id={secondInputID} type="hidden" />
	{/if}
</slot>
