<script>
    import { Seo } from '$lib/bw'
    export let title = ''
    export let siteTitle = 'Lays Gourmet'
</script>

<Seo siteTitle={siteTitle} title={title}  />

<div class="min-h-screen w-screen bg-black bg-[url(/assets/bg.webp)] bg-no-repeat bg-top bg-cover">
    <div class="p-4">
        <div class="max-w-[400px] da-slot mx-auto">
            <slot />
        </div>
    </div>
</div>
