<script>
  import Icon from "./Icon.svelte";
  import { createEventDispatcher } from "svelte/internal";
  const dispatch = createEventDispatcher();
  export let current_page = 1;
  export let total = 120;
  export let per_page = 5;
  export let rounded = true;
  export let small = false;
  export let color = "blue";
  $: s = small ? 8 : 12;
  $: num_pages = Math.ceil(total / per_page);
  let arr_pages = [];
  function buildArr(c, n) {
    if (n <= 7) {
      return [...Array(n)].map((_, i) => i + 1);
    } else {
      if (c < 3 || c > n - 2) {
        return [1, 2, 3, "...", n - 2, n - 1, n];
      } else {
        return [1, "...", c - 1, c, c + 1, "...", n];
      }
    }
  }
  function setArrPages() {
    arr_pages = buildArr(current_page, num_pages);
  }
  
  $: total
  $: per_page
  $: current_page

  $: if (current_page) {
    setArrPages();
  }
  $: if (per_page) {
    setArrPages();
    current_page = 1;
  }
  $: if (total) {
    num_pages = Math.ceil(total / per_page);
    current_page = current_page || 1;
  }
  function setCurrent(i) {
    if (isNaN(i)) return;
    current_page = i;
    dispatch("navigate", current_page);
  }
</script>

{#if arr_pages.length > 1}
  
<div class="flex text-slate-700 text-{small ? 'base' : 'lg'}">
    <div
        class="h-{s} w-{s} mr-1 flex justify-center items-center {rounded
        ? 'rounded-full bg-slate-200'
        : ''}
        {current_page > 1 ? 'cursor-pointer' : 'text-slate-400'}"
        on:click={() => current_page > 1 && setCurrent(1)}
    >
        <Icon name="chevron-double-left" className="w-{s / 2} h-{s / 2}" />
    </div>

    <div
        class="h-{s} w-{s} mr-1 flex justify-center items-center {rounded
        ? 'rounded-full bg-slate-200'
        : ''}
        {current_page > 1 ? 'cursor-pointer' : 'text-slate-400'}"
        on:click={() => current_page > 1 && setCurrent(current_page - 1)}
    >
        <Icon name="chevron-left" className="w-{s / 2} h-{s / 2}" />
    </div>

    <div
        class="flex h-{s} font-medium {rounded ? 'rounded-full bg-slate-200' : ''}"
    >
    {#each arr_pages as i}
        <div
            class="w-{s} sm:flex justify-center items-center hidden select-none
            cursor-pointer leading-5 transition duration-150 ease-in {i ==
            current_page
            ? rounded
                ? `rounded-full bg-${color}-600 text-white`
                : `border-t-2 border-${color}-600 `
            : rounded
            ? 'rounded-full '
            : 'border-t-2 border-white'}
            "
            on:click={() => setCurrent(i)}
        >
            {i}
        </div>
    {/each}
    <div
        class="w-{s} h-{s} sm:hidden flex justify-center select-none items-center
            cursor-pointer leading-5 transition duration-150 ease-in {rounded
            ? `rounded-full bg-${color}-600 text-white`
            : `border-t-2 border-${color}-600`}"
        >
            {current_page}
        </div>
    </div>

    <div
        class="h-{s} w-{s} ml-1 flex justify-center items-center {rounded
        ? 'rounded-full bg-slate-200'
        : ''}
            {current_page < num_pages ? 'cursor-pointer' : 'text-slate-400'}"
        on:click={() => current_page < num_pages && setCurrent(current_page + 1)}
    >
        <Icon name="chevron-right" className="w-{s / 2} h-{s / 2}" />
    </div>

    <div
        class="h-{s} w-{s} ml-1 flex justify-center items-center {rounded
        ? 'rounded-full bg-slate-200'
        : ''}
            {current_page < num_pages ? 'cursor-pointer' : 'text-slate-400'}"
        on:click={() => current_page < num_pages && setCurrent(num_pages)}
    >
        <Icon name="chevron-double-right" className="w-{s / 2} h-{s / 2}" />
    </div>
</div>

{/if}

<div class=" text-slate-400 text-sm text-center my-2 bg-white rounded-full px-5 py-1 border border-slate-200">
  {total} records / {num_pages} pages
</div>
