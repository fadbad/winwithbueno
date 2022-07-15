<script>
    export let children
    export let onClick = () => {}
</script>
<div on:click={onClick}>
    {@html children}
</div>
