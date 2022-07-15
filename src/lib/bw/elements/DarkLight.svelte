<script>
    // tailing.config.cjs {... darkMode: 'class' }
    export let theme = "dark";

    export let key = "theme";

    import { onMount, afterUpdate, createEventDispatcher } from "svelte";

    const SCHEME = "(prefers-color-scheme: dark)";

    const THEME = { dark: "dark", light: "light" };
    
    const dispatch = createEventDispatcher();
    
    const validTheme = (t) => t in THEME;
    
    const handleChange = (e) => (theme = e.matches ? THEME.dark : THEME.light);
    onMount(() => {
        const darkMode = matchMedia(SCHEME);
        const persisted_theme = localStorage.getItem(key);
        if (validTheme(persisted_theme)) {
            theme = persisted_theme;
        } else {
            theme = darkMode.matches ? THEME.dark : THEME.light;
        }
        darkMode.addEventListener("change", handleChange);
        return () => darkMode.removeEventListener("change", handleChange);
    });

    afterUpdate(() => {
        if (validTheme(theme)) {
            dispatch("change", theme);
            localStorage.setItem(key, theme);
        }
    });

    $: switchTheme = theme === "dark" ? "light" : "dark";
    $: typeof document !== 'undefined' && (document.body.className = theme);

</script>

<button on:click={() => (theme = switchTheme)} {...$$props}>
    {#if theme === 'dark'}
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
    {/if}

    {#if theme === 'light'}
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
    {/if}
</button>
