<script>

    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import Transition from "./Transition.svelte";
    import {Dropdown, DarkLight, Icon, getAuthUser, storage, setActiveMenu} from "$lib/bw"
    import _menu from './dashboard-menu'
    import _devMenu from './dashboard-dev-menu'

    export let menu = _menu

    let menu_compact = true
    export let mobile_menu_opened = false
    let open = false
    let selected_menu = null
    let active_menu = ''

    onMount(() => {
        const isDev = getAuthUser('isDev')
        if (isDev){
            menu = [
                ...menu, 
                ..._devMenu,
            ]
        }
        
        active_menu = storage.get('active-menu') ?? ''
        menu_compact = storage.get('menu_compact') ?? true
    })

    const toggle_menu_compact = () => {
        menu_compact = !menu_compact
        storage.set('menu_compact', menu_compact);
    }

    $: active_menu
    $: menu_compact
</script>

<div class="w-full h-full min-h-screen bg-slate-100 dark:bg-slate-900">
    <!-- MENU -->
    <div 
        class:menu-opened={menu_compact} 
        class:mobile-menu-opened={mobile_menu_opened}
    >

        <div 
            class="w-0 -left-[500px] md:left-0 z-50 md:w-20 h-screen overflow-visible fixed bg-white dark:bg-slate-900 md:z-10 transition-all ease-linear"
            class:md:w-52={!menu_compact} 
            class:left-0-important={mobile_menu_opened}
            class:w-60={mobile_menu_opened}
        >
            <a class="w-full h-12 flex items-center justify-center relative bg-slate-300 transition-all ease-in" href="/dashboard" sveltekit:prefetch>
                <Icon name="adjustments" />
            </a>

            <div class="hidden md:flex absolute z-50 h-8 w-8 top-8 -right-4 bg-white dark:bg-slate-900 rounded-full border border-[#eaeaea] items-center justify-center" on:click={toggle_menu_compact}>
                <span class="ease-linear transition-all" class:rotate-180={menu_compact}>
                    <Icon name="chevron-left" />
                </span>
            </div>

            <div class="md:hidden cursor-pointer w-[42px] h-[42px] rotate-0 bg-white dark:bg-slate-900 ml-4 rounded-full absolute left-[260px] flex items-center justify-center shadow-md" on:click={() => mobile_menu_opened = false}>
                <Icon name="x" />
            </div>

            <div 
                class="py-5 h-screen bg-white dark:bg-slate-900 md:z-[5]" 
                class:active={open}
            >

                <div class="absolute top-0 left-0 w-0 cursor-pointer h-screen opacity-20 bg-black -z-10" class:w-screen={open} on:click={() => {
                    selected_menu = null,
                    open = false
                }}></div>

                {#each menu as m}
                    <div class="menu-item" class:open={m.name === selected_menu?.name}>
                        <a 
                            sveltekit:prefetch
                            href="{m.submenu ? '' : m.link}" 
                            class="hover:bg-slate-100 py-2 block border-b border-gray-100 relative transition-all ease-in"
                            class:has-submenu={m.submenu} 
                            class:menu-active={m.name === active_menu}
                            on:click={() => { 
                                if(m.submenu){
                                    selected_menu = m
                                    open = true
                                } else {
                                    setActiveMenu(m)
                                }
                            }}
                        >
                            <div class="tooltip tooltip-right flex relative items-center px-5" data-tip={m.name}>
                            <Icon name={m.icon} size={8} />
                            <div 
                                class:md:opacity-0={menu_compact}
                                class:md:hidden={menu_compact}
                                class="cursor-pointer text-left text-[16px] font-medium pl-3 uppercase leading-none mt-1">{m.name}</div>
                            </div>
                        </a>
                        {#if m.submenu}
                            <div 
                                class="absolute top-0 w-60 md:w-52 h-screen bg-white transition-all ease-linear z-[3] md:-z-[1]"
                                class:right-60={m.name !== selected_menu?.name}
                                class:right-0={m.name === selected_menu?.name}
                                class:md:right-0={m.name !== selected_menu?.name}
                                class:md:-right-52={m.name === selected_menu?.name}
                            >
                                <h2 class="mx-7 mt-7 mb-4 border-b pb-[22px] text-[20px] font-medium relative">
                                    {m.name}
                                    <div class="absolute top-0 right-0 w-8 h-8 border cursor-pointer rounded-full flex items-center justify-center" on:click={() => {
                                        selected_menu = null,
                                        open = false
                                    }}>
                                        <Icon name="chevron-left" />
                                    </div>
                                </h2>
                                {#each m.submenu as sm}
                                    <a 
                                        sveltekit:prefetch
                                        class="block px-7 py-2 mb-2 border-b border-gray-100 text-[16px] font-medium leading-6" 
                                        href="{sm.link}"
                                        on:click={() => {
                                            setActiveMenu(m)
                                            selected_menu = null,
                                            open = false
                                        }}
                                    >{sm.name}</a>
                                {/each}
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
    </div>

    {#if open}
        <div 
            class="absolute inset-0 bg-slate-200 bg-opacity-50 z-[2]"
            on:click|self={() => {
                selected_menu = null,
                open = false
            }}
        ></div>
    {/if}

    <!-- CONTENT -->
    <div class:md:pl-20={menu_compact} class:md:pl-52={!menu_compact} class="w-full transition-all ease-in min-h-screen flex flex-col">
        <div class="px-6 pt-4">
            <div class="h-10 flex items-center">

                <div class="md:hidden relative rounded-full ease-in-out mr-4 bg-white rotate-0 w-10 h-10 flex items-center justify-center" on:click={() => mobile_menu_opened = !mobile_menu_opened}>
                    <Icon name="menu-alt-2" />
                </div>

                <div class="flex-1"></div>

                <!-- <div class="mx-4">
                    <DarkLight class="rounded-full bg-slate-400 text-white w-10 h-10 flex items-center justify-center" />
                </div> -->

                <div class="bg-white px-2 py-1 h-10 rounded-full">

                    <Dropdown>
                        <div class="flex items-center cursor-pointer">
                            <img src={getAuthUser('avatar')} alt="" class="w-8 h-8 object-cover rounded-full" />
                            <div class="flex items-center text-gray-500">
                                <span class="text-sm md:text-base ml-2 mr-4">
                                    {getAuthUser('menu-name')}
                                </span>  
                                <Icon name="chevron-down" size={4} class="" /> 
                            </div>
                        </div>
    
                        <div slot="dropdown" class="py-3 px-5">
                            <a sveltekit:prefetch class="block py-2" href="/dashboard/settings/account">Account Settings</a>
                            <a href="/dashboard/auth/logout" class="block">Logout</a>
                        </div>
                    </Dropdown>
                </div>
            </div>
        </div>

        <div class="px-6 py-4 flex-1 relative">
            <div class="pb-8">
                <Transition url={$page.url}>
                    <slot />
                </Transition>
            </div>

            <div class="absolute left-6 bottom-0">
                <div class="text-left text-xs py-3">
                    <a href="https://bitwize.ae" target="_blank" class="text-slate-300 hover:text-slate-600">
                        ♥ by Bitwize™
                    </a>
                </div>
            </div>

        </div>
        
    </div>
</div>

<style>
    .left-0-important {
        left: 0 !important;
    }
    :global(.menu-item svg), :global(.menu-item svg *) {
        stroke-width: 0.85 !important;
    }
    :global(.menu-active:before){
        content: '';
        position: absolute;
        left: 0; top:0;
        width: 3px; height: 100%;
        background-color: #047afe;
    }
</style>
