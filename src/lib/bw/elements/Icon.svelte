<script>
    import * as icons from "$lib/bw/lib/icons/heroicons"
    
    export let name = '';
    export let type = 'outline' // solid
    export let size = 6; // tailwind sizes
    export let flip = false;
    export let spin = false;
    export let pulse = false;

    const toCamelCase = str => {
    if (typeof str !== 'string') return str;
    return str
        .trim()
        .replace(/_+|\-+/g, ' ')
        .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
            if (Number(match) === 0) return '';
            return match.toUpperCase();
            // return (index === 0) ? match.toLowerCase() : match.toUpperCase();
        });
    }

    const formatName = n => `${toCamelCase(n)}Icon${toCamelCase(type)}`

    $: IconObject = icons[formatName(name)] || ''
</script>

{#if IconObject}
    <span
      class:flip={flip && typeof flip === "boolean"}
      class:flip-h={typeof flip !== "boolean" && flip === "h"}
      class:flip-v={typeof flip !== "boolean" && flip === "v"}
      class:spin
      class:pulse={pulse && !spin}
      class={$$props.class || ''}
      on:click
    >
      <svelte:component this={IconObject} className={`w-${size} h-${size}`} />
    </span>
{/if}

<style>
    .flip {
      transform: scale(-1, -1);
    }
    .flip-h {
      transform: scale(-1, 1);
    }
    .flip-v {
      transform: scale(1, -1);
    }
    .spin {
      animation: spin 1s 0s infinite linear;
    }
    .pulse {
      animation: spin 1s infinite steps(8);
    }
    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
</style>
