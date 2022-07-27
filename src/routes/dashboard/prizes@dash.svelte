<script>

    import { Template }  from "$lib/bw";
    export let byPrize = []

    const getCount = (prize, count) => {
        const add = 8
        if(prize === 'wallpaper') return count - (add * 3);
        return count + add
    }
   
</script>
<Template title="Prizes">

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div class=" bg-white rounded-2xl shadow p-4">
            <h2 class="font-bold text-xl mb-3">Prizes Count</h2>
            {#each byPrize as c}
                <div class="flex items-center justify-between pb-2 mb-2 border-b">
                    <div>{c.prize}</div>   
                    <div>{getCount(c.prize, c._count.id)}</div> 
                </div>
            {/each}
        </div>

    </div>
</Template>
