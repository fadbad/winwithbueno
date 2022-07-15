<script>
    export let id = `modal-${Date.now()}`
    export let value = false
    export let title = ''
    export let width = ''
    // <label for="test" class="btn">Open Modal</label>
</script>

<input type="checkbox" id={id} class="modal-toggle" bind:checked={value}>
<div class="modal" on:click|self={() => value=false}>
    <div class="modal-box {width}">
        <label for={id} class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        {#if title}
            <h3 class="font-bold text-lg">{title}</h3>
        {/if}

        <p class="py-4">
            <slot />
        </p>

        {#if $$slots.actions}
            <div class="modal-action">
                <slot name="actions" />
            </div>
        {/if}
    </div>
</div>
