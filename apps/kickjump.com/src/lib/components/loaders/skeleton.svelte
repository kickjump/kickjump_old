<script lang="ts">
  import { useId } from '$lib/stores/use-id';
  import type { Maybe } from '$types';

  export let secondaryColor = '#F5F5F7'; // do not use rgba() - not working in Safari on iOS 11
  export let primaryColor = '#EBECEF';
  export let height: string | number = 200;
  export let width: string | number = 400;
  export let speed = 2;
  export let animate = true;
  export let secondaryColorPercentWidth = 100;
  export let ariaLabel: Maybe<string> = null;
  const idClip = `skeleton-loader-clip${useId()}`;
  const idGradient = `skeleton-loader-gradient${useId()}`;
</script>

<svg {width} {height} aria-label={ariaLabel} preserveAspectRatio="none">
  <rect fill="url(#{idGradient})" clip-path="url(#{idClip})" {width} {height} x="0" y="0" />
  <defs>
    <clipPath id={idClip}>
      <slot>
        <rect {width} {height} x="0" y="0" rx="8" ry="8" />
      </slot>
    </clipPath>
    <linearGradient id={idGradient} x1="-{secondaryColorPercentWidth}%" y1="50%" x2="0%" y2="50%">
      {#if animate}
        <animate
          attributeName="x1"
          from="-{secondaryColorPercentWidth}%"
          to="100%"
          dur="{speed}s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="x2"
          from="0%"
          to="{100 + secondaryColorPercentWidth}%"
          dur="{speed}s"
          repeatCount="indefinite"
        />
      {/if}

      <stop stop-color={primaryColor} offset="0%" />
      <stop stop-color={secondaryColor} offset="50%" />
      <stop stop-color={primaryColor} offset="100%" />
    </linearGradient>
  </defs>
</svg>
