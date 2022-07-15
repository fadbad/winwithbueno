<script>
    import { FrappeChart, setActiveMenu, api, Template, Stats } from "$lib/bw"
    import { onMount } from "svelte";

    let loading = true, chart_data, chartjs_data, stats

    onMount(async () => {
        setActiveMenu('')
        loading = true
        const res = await api.get('/charts/home')
        chart_data = {
            labels: res.labels,
            datasets: res.datasets
        }
        chartjs_data = {
            labels: res.labels,
            datasets: res.datasets_cjs
        }
        stats = res.stats
        loading = false
    })

    let chartRef
</script>

<Template title="Dashboard">
    {#if loading}
        <button class="btn loading"></button>
    {:else}
        <Stats class="mb-4" items={stats} />

        <FrappeChart data={chart_data} bind:this={chartRef} />

    {/if}

</Template>
