<script>
    import { onMount, afterUpdate, onDestroy } from 'svelte';
    import { Chart, registerables } from 'chart.js/dist/chart.esm';
    Chart.register(...registerables);

    const clean = ($$props, extra_keys) => {
        let keys = ["children", "$$scope", "$$slots"].concat(extra_keys)
        const rest = {};
        for (const key of Object.keys($$props)) {
            if (!(keys.includes(key))) {
            rest[key] = $$props[key];
            }
        }
        return rest;
    }

    export let data = {
        labels: [],
        datasets: [
            {data: []}
        ],
        yMarkers: {},
        yRegions: [],
    };
    
    // bar, bubble, doughnut, horizontalBar, line, pie, polarArea, radar, scatter
    export let type = 'line'; 
    export let options = {};
    export let plugins = [];

    let chart = null;
    let chartRef;
    let props = clean($$props, ["data", "type", "options", "plugins"]);
    
    onMount(() => {
        chart = new Chart(chartRef, {
            type,
            data,
            options,
            plugins
        });
    });

    afterUpdate(() => {
        if (!chart) return;
        chart.data = data;
        chart.type = type;
        chart.options = options;
        chart.plugins = plugins;
        chart.update()
    });

    onDestroy(() => {
        if (chart) chart.destroy();
        chart = null;
    });
</script>

<canvas bind:this={chartRef} {...props}></canvas>
