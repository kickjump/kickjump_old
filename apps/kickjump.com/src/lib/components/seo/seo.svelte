<script lang="ts">
  import { type SeoProps, DEFAULT_SEO } from './types.js';

  interface $$Props extends SeoProps {}

  $: props = { ...DEFAULT_SEO, ...$$props } as $$Props;
</script>

<svelte:head>
  {#if props.title}
    <title>{props.title}</title>
  {/if}

  <meta
    name="robots"
    content={`${props.noindex ? 'noindex' : 'index'},${props.nofollow ? 'nofollow' : 'follow'}`}
  />
  <meta
    name="googlebot"
    content={`${props.noindex ? 'noindex' : 'index'},${props.nofollow ? 'nofollow' : 'follow'}`}
  />

  {#if props.description}
    <meta name="description" content={props.description} />
  {/if}

  {#if props.canonical}
    <link rel="canonical" href={props.canonical} />
  {/if}

  {#if props.keywords}
    <meta name="keywords" content={props.keywords} />
  {/if}

  {#if props.openGraph}
    {#if props.openGraph.title}
      <meta property="og:title" content={props.openGraph.title} />
    {/if}

    {#if props.openGraph.description}
      <meta property="og:description" content={props.openGraph.description} />
    {/if}

    {#if props.openGraph.url || props.canonical}
      <meta property="og:url" content={props.openGraph.url || props.canonical} />
    {/if}

    {#if props.openGraph.type}
      <meta property="og:type" content={props.openGraph.type.toLowerCase()} />
    {/if}

    {#if props.openGraph.article}
      {#if props.openGraph.article.publishedTime}
        <meta property="article:published_time" content={props.openGraph.article.publishedTime} />
      {/if}

      {#if props.openGraph.article.modifiedTime}
        <meta property="article:modified_time" content={props.openGraph.article.modifiedTime} />
      {/if}

      {#if props.openGraph.article.expirationTime}
        <meta property="article:expiration_time" content={props.openGraph.article.expirationTime} />
      {/if}

      {#if props.openGraph.article.section}
        <meta property="article:section" content={props.openGraph.article.section} />
      {/if}

      {#if props.openGraph.article.authors && props.openGraph.article.authors.length > 0}
        {#each props.openGraph.article.authors as author}
          <meta property="article:author" content={author} />
        {/each}
      {/if}

      {#if props.openGraph.article.tags && props.openGraph.article.tags.length > 0}
        {#each props.openGraph.article.tags as tag}
          <meta property="article:tag" content={tag} />
        {/each}
      {/if}
    {/if}

    {#if props.openGraph.images && props.openGraph.images.length > 0}
      {#each props.openGraph.images as image}
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

  {#if props.twitter}
    <meta name="twitter:card" content={props.twitter.card || 'summary_large_image'} />
    {#if props.twitter.site}
      <meta name="twitter:site" content={props.twitter.site} />
    {/if}
    {#if props.twitter.title}
      <meta name="twitter:title" content={props.twitter.title} />
    {/if}
    {#if props.twitter.description}
      <meta name="twitter:description" content={props.twitter.description} />
    {/if}
    {#if props.twitter.image}
      <meta name="twitter:image" content={props.twitter.image} />
    {/if}
    {#if props.twitter.imageAlt}
      <meta name="twitter:image:alt" content={props.twitter.imageAlt} />
    {/if}
    {#if props.twitter.player}
      <meta name="twitter:player" content={props.twitter.player} />
    {/if}
    {#if props.twitter.playerWidth}
      <meta name="twitter:player:width" content={`${props.twitter.playerWidth}`} />
    {/if}
    {#if props.twitter.playerHeight}
      <meta name="twitter:player:height" content={`${props.twitter.playerHeight}`} />
    {/if}
  {/if}
  <slot />
</svelte:head>
