<script>
    import { onMount } from 'svelte';

    let LottiePlayer;

    onMount(async () => {
        const module = await import('./lottie-player');
        LottiePlayer = module.LottiePlayer;
    });

    const anims = {
        happy: 'https://assets4.lottiefiles.com/packages/lf20_fetkcs3q.json',
        sad: 'https://assets6.lottiefiles.com/packages/lf20_kw7o4s5y.json',
        search: 'https://assets2.lottiefiles.com/packages/lf20_urdso8u9.json',
        search_bear: 'https://assets6.lottiefiles.com/private_files/lf30_jo7huq2d.json',
        dino: 'https://assets8.lottiefiles.com/datafiles/40aX5db74VvGPWw/data.json',
        loading: 'https://assets8.lottiefiles.com/packages/lf20_YMim6w.json',
        loading_serious: 'https://assets4.lottiefiles.com/packages/lf20_t9gkkhz4.json',
        under_construction: 'https://assets6.lottiefiles.com/packages/lf20_byuzwmds.json',
    }

    export let src = 'sad'
    export let autoplay = true
    export let loop = true
    export let height = 360
    export let width = 360
</script>

{#if LottiePlayer}
    <svelte:component this={LottiePlayer}
        src={anims[src] || src}
        autoplay={autoplay}
        loop={loop}
        renderer="svg"
        background="transparent"
        height={height}
        width={width}
    />
{/if}
