<script context="module" lang="ts">
  import clsx from 'clsx';
  import { createEventDispatcher } from 'svelte';

  import type { Maybe } from '$types';

  import { Button } from '../buttons/index.js';
  import { Icon } from '../icon/index.js';
  import {
    type AlertInteraction,
    type AlertResult,
    type AlertType,
    ALERT_TYPE,
  } from './alert-types.js';
</script>

<script lang="ts">
  const dispatch = createEventDispatcher<{ interaction: AlertResult }>();

  export let type: AlertType = 'default';
  export let title: Maybe<string> = undefined;
  export let config: Maybe<AlertInteraction> = undefined;
  let className: Maybe<string> = undefined;

  $: value = ALERT_TYPE[type];
  $: combinedClass = clsx('alert', 'shadow-lg', className, value.style);

  export { className as class };
</script>

<div class={combinedClass}>
  <div>
    {#if $$slots.icon}
      <slot name="icon" />
    {:else if value.icon}
      <Icon icon={value.icon} class="flex-shrink-0" size="1.5em" />
    {/if}
    {#if title}
      <div>
        <h3 class="font-bold">New message!</h3>
        <div class="text-xs"><slot /></div>
      </div>
    {:else}
      <div><slot /></div>
    {/if}
    {#if config?.type === 'dismiss'}
      <Button
        size="sm"
        variant="outline"
        on:click={() => dispatch('interaction', { type: 'dismiss' })}
      >
        <Icon size="2em" icon="close" />
      </Button>
    {:else if config?.type === 'confirm'}
      <div class="flex-none">
        <Button
          variant="ghost"
          size="sm"
          on:click={() => dispatch('interaction', { type: 'confirm', accept: false })}
          >{config.deny}
        </Button>
        <Button
          theme="primary"
          size="sm"
          on:click={() => dispatch('interaction', { type: 'confirm', accept: true })}
        >
          {config.accept}
        </Button>
      </div>
    {:else if config?.type === 'prompt'}
      <div class="flex-none">
        <Button size="sm" on:click={() => dispatch('interaction', { type: 'prompt' })}>
          {config.text}
        </Button>
      </div>
    {/if}
  </div>
</div>
