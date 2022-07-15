<script>
    import { page } from '$app/stores'

    const clean_url = str => str.replace(/([^:])(\/\/+)/g, '$1/');

    const baseurl = $page.url.protocol + '//' + $page.url.host

    export let image = '';
    export let description = '';
    export let title = '';
    export let siteTitle = '';
    export let twitterUsername = '';
    export let s3_url = '';

    const pageTitle =  title ? `${title} | ${siteTitle}` : `${siteTitle}`;

    const url = clean_url(baseurl + $page.url.pathname)
    const img_url = image ? clean_url(baseurl+'/'+image) : ''
</script>

<svelte:head>
    <title>{pageTitle}</title>
    {#if description}
        <meta name="description" content={description} />
    {/if}

    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

    <link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com">

    {#if s3_url}
        <link rel="dns-prefetch" href={s3_url} />
        <link rel="preconnect" href={s3_url} />
    {/if}

    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="author" content="Bitwize - http://bitwize.com.lb" />
    <meta name="generator" content="Bitwize - http://bitwize.com.lb" />

    <meta
        name="robots"
        content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
    />
    <meta property="og:site_name" content={siteTitle} />
    <meta property="og:url" content={url} />
    <meta property="og:type" content={'website'} />
    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content={description} />

    {#if image}
        <meta property="og:image" content={img_url} />
        <meta name="twitter:image" content={img_url} />
    {/if}

    <!-- TWITTER -->
    <meta name="twitter:card" content="summary_large_image" />
    
    {#if twitterUsername}
        <meta name="twitter:creator" content={`@${twitterUsername}`} />
        <meta name="twitter:site" content={`@${twitterUsername}`} />
    {/if}
</svelte:head>
