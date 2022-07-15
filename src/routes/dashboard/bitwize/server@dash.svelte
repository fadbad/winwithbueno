<script>
    import { __date_item, api, json_list, Icon, Template }  from "$lib/bw";
    import { onMount } from "svelte";

    const numberFormat = num => +num.toFixed(2)

    let loading = true
    let data = {}

    const getData = async () => {
        if (typeof window === "undefined") return;
        loading = true;
        let body = await api.get('/bitwize/system')
        if (body) data = {...body}
        setTimeout(() => loading = false, 500);
    }
    
    onMount(() => {
        getData()
    })
</script>
<Template title="Server Usage">
    <div class="mb-3">
        <button 
            class="btn mb-4" 
            class:loading
            on:click={getData}
        >Fetch Details</button>

    </div>
    {#if !loading}
        <div class="stats shadow-md mb-4">
            <div class="stat">
                <div class="stat-figure">
                    <Icon name={'desktop-computer'} size={8} />
                </div>
                <div class="stat-value">System</div>
                <div class="stat-title">
                    {data.system.platform}<br />
                    {data.system.operatingSystem}
                </div>
                <div class="stat-desc">{data.system.osType} {data.system.arch}</div>
                <div class="stat-desc">{data.system.ip}</div>
            </div>

            <div class="stat">
                <div class="stat-figure">
                    <Icon name={'chip'} size={8} />
                </div>
                <div class="stat-value">CPU</div>
                <div class="stat-title">{data.cpu.count} CPUs</div>
                <div class="stat-desc">USED: {data.cpu.usedPerc}%</div>
                <div class="stat-desc">FREE: {data.cpu.freePerc}%</div>
            </div>

            <div class="stat">
                <div class="stat-figure">
                    <Icon name={'variable'} size={8} />
                </div>
                <div class="stat-value">Memory</div>
                <div class="stat-title">{numberFormat(data.memory.totalGB)} GB</div>
                <div class="stat-desc">USED: {numberFormat(data.memory.usedGB)} GB</div>
                <div class="stat-desc">FREE: {numberFormat(data.memory.freeGB)} GB</div>
            </div>

            <div class="stat">
                <div class="stat-figure">
                    <Icon name={'database'} size={8} />
                </div>
                <div class="stat-value">Drive</div>
                <div class="stat-title">{data.drive.totalGB} GB</div>
                <div class="stat-desc">USED: {data.drive.usedGB} GB</div>
                <div class="stat-desc">FREE: {data.drive.freeGB} GB</div>
            </div>
        </div>
        
        <pre>{JSON.stringify(data, null, 2)}</pre>

        <!-- <div>
            {@html json_list(data)}
        </div> -->
    {/if}
</Template>
