<script>
    import { Swal } from "$lib/bw"
    export let data = [];
    export let name = 'export'

    const csvString = arr => [
        Object.keys(arr[0]), ...arr.map(item => Object.values(item))
    ].map(e => e.join(",")).join("\n");

    const run = () => {
        
        if(typeof data === 'undefined' || !data.length || !Array.isArray(data)) {
            return Swal.fire('Warning', 'no data detected, aborting', 'warning')
        }

        let csvContent = `data:text/csv;charset=utf-8,${csvString(data)}` 

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${name}.csv`);
        document.body.appendChild(link); 
        link.click();
    }

</script>

<div on:click={run} class="cursor-pointer {$$props.class ?? ''}">
    <slot />
</div>
