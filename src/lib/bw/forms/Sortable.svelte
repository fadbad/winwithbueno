<script>
    import { flip } from "svelte/animate";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
  
    // DRAG AND DROP
    let isOver = false;
    const getDraggedParent = node => node.dataset && node.dataset.index ? node.dataset : getDraggedParent(node.parentNode);
    const start = ev => {
        ev.dataTransfer.setData("source", ev.target.dataset.index);
    };
    const over = ev => {
        ev.preventDefault();
        let dragged = getDraggedParent(ev.target);
        if (isOver !== dragged.id) isOver = JSON.parse(dragged.id);
    };
    const leave = ev => {
        let dragged = getDraggedParent(ev.target);
        if (isOver === dragged.id) isOver = false;
    };
    const drop = ev => {
        isOver = false;
        ev.preventDefault();
        let dragged = getDraggedParent(ev.target);
        let from = ev.dataTransfer.getData("source");
        let to = dragged.index;
        reorder({ from, to });
    };
  
    // DISPATCH REORDER
    const reorder = ({ from, to }) => {
        let newList = [...list];
        newList[from] = [newList[to], (newList[to] = newList[from])][0];
    
        dispatch("sort", newList);
    };
  
    // UTILS
    const getKey = item => (key ? item[key] : item);

    // PROPS
    export let list;
    export let key;
</script>
  
{#if list && list.length}
    <ul class="p-0 list-none">
        {#each list as item, index (getKey(item))}
            <li
                data-index={index}
                data-id={JSON.stringify(getKey(item))}
                draggable="true"
                on:dragstart={start}
                on:dragover={over}
                on:dragleave={leave}
                on:drop={drop}
                animate:flip={{ duration: 300 }}
                class="border-2 border-dashed border-gray-100 rounded transition-all ease-in"
                class:border-blue-600={getKey(item) === isOver}
            >
                <slot {item} {index} />
            </li>
        {/each}
    </ul>
{/if}
