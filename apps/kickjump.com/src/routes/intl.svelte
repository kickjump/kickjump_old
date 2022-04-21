<script>
  import Button from '$lib/components/button/button.svelte';
  import { t, locale, locales } from '$lib/utils/intl';
  let count = 1;
  let time = new Date();
  let gender = 'female';
</script>

<h1>Sample intl</h1>

<section>
  <p>{$t('plain')}</p>
  <p>{$t('interpolated', { values: { val: 'apple' } })}</p>
  <p>{$t('time', { values: { time } })}</p>
  <p>{$t('number', { values: { n: count } })}</p>
  <p>{$t('pluralized', { values: { count } })}</p>
  <p>{$t('pluralized-with-hash', { values: { count } })}</p>
  <p>{$t('selected', { values: { gender } })}</p>
  <hr />
  <Button type="button" on:click={() => count--}>Decrement counter</Button>
  <Button type="button" on:click={() => count++}>Increment counter</Button>
  <p>Select a gender:</p>
  <p>
    <Button type="button" on:click={() => (gender = 'male')}>Male</Button>
    <Button type="button" on:click={() => (gender = 'female')}>Female</Button>
    <Button type="button" on:click={() => (gender = 'other')}>Other</Button>
  </p>
</section>

<footer>
  Change language:
  {#each $locales as loc}
    <Button
      type="button"
      variant="outline"
      class={loc === $locale && 'current-locale'}
      on:click={() => ($locale = loc)}
      >{loc}
    </Button>
  {/each}
</footer>

<style>
  section {
    max-width: 400px;
    margin: 0 auto;
  }
</style>
