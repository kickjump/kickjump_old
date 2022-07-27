<script lang="ts">
  import { page } from '$app/stores';

  // import { DEFAULT_SEO } from './types.js';

  // interface $$$page.stuff extends Seo$page.stuff {}

  // $: $page.stuff = { ...DEFAULT_SEO, ...$page.stuff };
</script>

<svelte:head>
  {#if $page.stuff.title}
    <title>{$page.stuff.title}</title>
  {/if}

  <meta
    name="robots"
    content={`${$page.stuff.noindex ? 'noindex' : 'index'},${
      $page.stuff.nofollow ? 'nofollow' : 'follow'
    }`}
  />
  <meta
    name="googlebot"
    content={`${$page.stuff.noindex ? 'noindex' : 'index'},${
      $page.stuff.nofollow ? 'nofollow' : 'follow'
    }`}
  />

  {#if $page.stuff.description}
    <meta name="description" content={$page.stuff.description} />
  {/if}

  {#if $page.stuff.canonical}
    <link rel="canonical" href={$page.stuff.canonical} />
  {/if}

  {#if $page.stuff.keywords}
    <meta name="keywords" content={$page.stuff.keywords} />
  {/if}

  {#if $page.stuff.openGraph}
    {#if $page.stuff.openGraph.title}
      <meta property="og:title" content={$page.stuff.openGraph.title} />
    {/if}

    {#if $page.stuff.openGraph.description}
      <meta property="og:description" content={$page.stuff.openGraph.description} />
    {/if}

    {#if $page.stuff.openGraph.url || $page.stuff.canonical}
      <meta property="og:url" content={$page.stuff.openGraph.url || $page.stuff.canonical} />
    {/if}

    {#if $page.stuff.openGraph.type}
      <meta property="og:type" content={$page.stuff.openGraph.type.toLowerCase()} />
    {/if}

    {#if $page.stuff.openGraph.article}
      {#if $page.stuff.openGraph.article.publishedTime}
        <meta
          property="article:published_time"
          content={$page.stuff.openGraph.article.publishedTime}
        />
      {/if}

      {#if $page.stuff.openGraph.article.modifiedTime}
        <meta
          property="article:modified_time"
          content={$page.stuff.openGraph.article.modifiedTime}
        />
      {/if}

      {#if $page.stuff.openGraph.article.expirationTime}
        <meta
          property="article:expiration_time"
          content={$page.stuff.openGraph.article.expirationTime}
        />
      {/if}

      {#if $page.stuff.openGraph.article.section}
        <meta property="article:section" content={$page.stuff.openGraph.article.section} />
      {/if}

      {#if $page.stuff.openGraph.article.authors && $page.stuff.openGraph.article.authors.length > 0}
        {#each $page.stuff.openGraph.article.authors as author}
          <meta property="article:author" content={author} />
        {/each}
      {/if}

      {#if $page.stuff.openGraph.article.tags && $page.stuff.openGraph.article.tags.length > 0}
        {#each $page.stuff.openGraph.article.tags as tag}
          <meta property="article:tag" content={tag} />
        {/each}
      {/if}
    {/if}

    {#if $page.stuff.openGraph.images && $page.stuff.openGraph.images.length > 0}
      {#each $page.stuff.openGraph.images as image}
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

  {#if $page.stuff.twitter}
    <meta name="twitter:card" content={$page.stuff.twitter.card || 'summary_large_image'} />
    {#if $page.stuff.twitter.site}
      <meta name="twitter:site" content={$page.stuff.twitter.site} />
    {/if}
    {#if $page.stuff.twitter.title}
      <meta name="twitter:title" content={$page.stuff.twitter.title} />
    {/if}
    {#if $page.stuff.twitter.description}
      <meta name="twitter:description" content={$page.stuff.twitter.description} />
    {/if}
    {#if $page.stuff.twitter.image}
      <meta name="twitter:image" content={$page.stuff.twitter.image} />
    {/if}
    {#if $page.stuff.twitter.imageAlt}
      <meta name="twitter:image:alt" content={$page.stuff.twitter.imageAlt} />
    {/if}
    {#if $page.stuff.twitter.player}
      <meta name="twitter:player" content={$page.stuff.twitter.player} />
    {/if}
    {#if $page.stuff.twitter.playerWidth}
      <meta name="twitter:player:width" content={`${$page.stuff.twitter.playerWidth}`} />
    {/if}
    {#if $page.stuff.twitter.playerHeight}
      <meta name="twitter:player:height" content={`${$page.stuff.twitter.playerHeight}`} />
    {/if}
  {/if}
  <slot />
</svelte:head>
