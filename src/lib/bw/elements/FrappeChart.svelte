<script>
    // https://github.com/himynameisdave/svelte-frappe-charts
    // https://frappe.io/charts/docs
    import { onMount, onDestroy, tick } from 'svelte';
    import { Chart } from 'frappe-charts';
	
    export let data = {}
    export let title = '';
    export let type = 'line'; // line | bar | axis-mixed | pie | percentage | heatmap
    export let height = 300;
    export let animate = true;
    export let axisOptions = {};
    export let barOptions = {};
    export let lineOptions = {};
    export let tooltipOptions = {};
    export let colors =['light-blue', 'blue', 'red', 'violet', 'orange', 'yellow', 'green', 'light-green', 'purple', 'magenta', 'light-grey', 'dark-grey'];
    export let valuesOverPoints = 0;
    export let isNavigable = true;
    export let maxSlices = 3;
	
    let chart = null;
    let chartRef;

    function ifChartThen(fn) {
		return (...args) => chart && fn(...args)
    }
	
    export const addDataPoint = ifChartThen((label, valueFromEachDataset, index) => chart.addDataPoint(label, valueFromEachDataset, index));
    export const removeDataPoint = ifChartThen(index => chart.removeDataPoint(index));
    export const exportChart = ifChartThen(() => chart.export());
	
    const updateChart = ifChartThen((newData) => chart.update(newData));
    $: updateChart(data);
	
    onMount(async () => {
		await tick()
		
		chart = new Chart(chartRef, {
			data,
			title,
			type,
			height,
			animate,
			colors,
			axisOptions,
			barOptions,
			lineOptions,
			tooltipOptions,
			valuesOverPoints,
			isNavigable,
			maxSlices,
			truncateLegends: true
		});
    });
	
    onDestroy(() => {
      	chart = null;
    });
</script>
  
<div>
	<div
		bind:this={chartRef}
		on:data-select
	></div>

</div>

<style>
    :global(.chart-legend) {
      	display: none;
    }
</style>
