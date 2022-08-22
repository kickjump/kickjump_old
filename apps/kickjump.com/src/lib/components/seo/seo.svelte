<script lang="ts">
  import { type SeoProps, DEFAULT_SEO } from './types.js';

  export let seo: SeoProps = DEFAULT_SEO;
</script>

<svelte:head>
  {#if seo.title}
    <title>{seo.title}</title>
  {/if}

  <meta
    name="robots"
    content={`${seo.noindex ? 'noindex' : 'index'},${seo.nofollow ? 'nofollow' : 'follow'}`}
  />
  <meta
    name="googlebot"
    content={`${seo.noindex ? 'noindex' : 'index'},${seo.nofollow ? 'nofollow' : 'follow'}`}
  />

  {#if seo.description}
    <meta name="description" content={seo.description} />
  {/if}

  {#if seo.canonical}
    <link rel="canonical" href={seo.canonical} />
  {/if}

  {#if seo.keywords}
    <meta name="keywords" content={seo.keywords} />
  {/if}

  {#if seo.openGraph}
    {#if seo.openGraph.title}
      <meta property="og:title" content={seo.openGraph.title} />
    {/if}

    {#if seo.openGraph.description}
      <meta property="og:description" content={seo.openGraph.description} />
    {/if}

    {#if seo.openGraph.url || seo.canonical}
      <meta property="og:url" content={seo.openGraph.url || seo.canonical} />
    {/if}

    {#if seo.openGraph.type}
      <meta property="og:type" content={seo.openGraph.type.toLowerCase()} />
    {/if}

    {#if seo.openGraph.article}
      {#if seo.openGraph.article.publishedTime}
        <meta property="article:published_time" content={seo.openGraph.article.publishedTime} />
      {/if}

      {#if seo.openGraph.article.modifiedTime}
        <meta property="article:modified_time" content={seo.openGraph.article.modifiedTime} />
      {/if}

      {#if seo.openGraph.article.expirationTime}
        <meta property="article:expiration_time" content={seo.openGraph.article.expirationTime} />
      {/if}

      {#if seo.openGraph.article.section}
        <meta property="article:section" content={seo.openGraph.article.section} />
      {/if}

      {#if seo.openGraph.article.authors && seo.openGraph.article.authors.length > 0}
        {#each seo.openGraph.article.authors as author}
          <meta property="article:author" content={author} />
        {/each}
      {/if}

      {#if seo.openGraph.article.tags && seo.openGraph.article.tags.length > 0}
        {#each seo.openGraph.article.tags as tag}
          <meta property="article:tag" content={tag} />
        {/each}
      {/if}
    {/if}

    {#if seo.openGraph.images && seo.openGraph.images.length > 0}
      {#each seo.openGraph.images as image}
        <meta property="og:image" content={image.url} />
        {#if image.alt}
          <meta property="og:image:alt" content={image.alt} />
        {/if}
        {#if image.width}
          <meta property="og:image:width" content={image.width.toString()} />
        {/if}
        {#if image.height}
          <meta property="og:image:height" content={image.height.toString()} />
        {/if}
      {/each}
    {/if}
  {/if}

  {#if seo.twitter}
    <meta name="twitter:card" content={seo.twitter.card || 'summary_large_image'} />
    {#if seo.twitter.site}
      <meta name="twitter:site" content={seo.twitter.site} />
    {/if}
    {#if seo.twitter.title}
      <meta name="twitter:title" content={seo.twitter.title} />
    {/if}
    {#if seo.twitter.description}
      <meta name="twitter:description" content={seo.twitter.description} />
    {/if}
    {#if seo.twitter.image}
      <meta name="twitter:image" content={seo.twitter.image} />
    {/if}
    {#if seo.twitter.imageAlt}
      <meta name="twitter:image:alt" content={seo.twitter.imageAlt} />
    {/if}
    {#if seo.twitter.player}
      <meta name="twitter:player" content={seo.twitter.player} />
    {/if}
    {#if seo.twitter.playerWidth}
      <meta name="twitter:player:width" content={`${seo.twitter.playerWidth}`} />
    {/if}
    {#if seo.twitter.playerHeight}
      <meta name="twitter:player:height" content={`${seo.twitter.playerHeight}`} />
    {/if}
  {/if}
  <slot />
</svelte:head>
