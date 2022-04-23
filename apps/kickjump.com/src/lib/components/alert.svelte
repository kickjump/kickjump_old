<script context="module" lang="ts">
  import type { Maybe } from '$types';
  import clsx from 'clsx';
  import Icon from './icon.svelte';

  const ALERT_TYPE = /*tw*/ {
    default: { style: '', icon: undefined },
    /** Alert with `info` color */
    info: { style: 'alert-info', icon: 'info' },
    /** Alert with `success` color */
    success: { style: 'alert-success', icon: 'checkboxCircle' },
    /** Alert with `warning` color */
    warning: { style: 'alert-warning', icon: 'warning' },
    /** Alert with `error` color */
    error: { style: 'alert-error', icon: 'error' },
  } as const;

  export type AlertType = keyof typeof ALERT_TYPE;
</script>

<script lang="ts">
  export let type: AlertType = 'default';
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
    <span><slot /></span>
  </div>
</div>
