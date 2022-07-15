<script>
    export let value = 0;
    export let min = 0;
    export let max = 999;
    export let step = 1;

    export let style = "padding: 10px 30px"
  
    $: safeValue = clamp(min, max, value);

    const dec = () => value = safeValue - step
    const inc = () => value = safeValue + step
    const clamp = (min, max, v) => {
        if (v <= min) return min;
        if (v >= max) return max;
        return v;
    }

</script>
  
<div class="btn-group">
    <button class="btn btn-primary" on:click={dec} {style}>-</button>
    <button class="btn btn-primary btn-outline" {style}>{safeValue}</button>
    <button class="btn btn-primary" on:click={inc} {style}>+</button>
</div>
  
