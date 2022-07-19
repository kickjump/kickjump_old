<script lang="ts" context="module">
  import Icon from '../../components/icon/icon.svelte';
  import type { CreateProjectStep } from './project-steps.js'
</script>

<script lang="ts">
  export let heading = 'Tell us what’s your situation ✨';
  export let previous: CreateProjectStep | undefined = { href: '#', title: 'Previous Step' };
  export let next: CreateProjectStep | undefined = { href: '#', title: 'Next Step' };
</script>

<div class="px-4 py-8">
  <div class="max-w-md mx-auto">
    <h1 class="text-3xl text-slate-800 font-bold mb-6">{heading}</h1>
    <slot />
    <!-- Form -->
    <form>
      <div class="space-y-3 mb-8">
        <label class="relative block cursor-pointer">
          <input type="radio" name="radio-buttons" class="peer sr-only" checked />
          <div
            class="flex items-center bg-white text-sm font-medium text-slate-800 p-4 rounded border border-slate-200 hover:border-slate-300 shadow-sm duration-150 ease-in-out"
          >
            <svg class="w-6 h-6 shrink-0 fill-current mr-4" viewBox="0 0 24 24">
              <path
                class="text-indigo-500"
                d="m12 10.856 9-5-8.514-4.73a1 1 0 0 0-.972 0L3 5.856l9 5Z"
              />
              <path
                class="text-indigo-300"
                d="m11 12.588-9-5V18a1 1 0 0 0 .514.874L11 23.588v-11Z"
              />
              <path
                class="text-indigo-200"
                d="M13 12.588v11l8.486-4.714A1 1 0 0 0 22 18V7.589l-9 4.999Z"
              />
            </svg>
            <span>I have a company</span>
          </div>
          <div
            class="absolute inset-0 border-2 border-transparent peer-checked:border-indigo-400 rounded pointer-events-none"
            aria-hidden="true"
          />
        </label>
        <label class="relative block cursor-pointer">
          <input type="radio" name="radio-buttons" class="peer sr-only" />
          <div
            class="flex items-center bg-white text-sm font-medium text-slate-800 p-4 rounded border border-slate-200 hover:border-slate-300 shadow-sm duration-150 ease-in-out"
          >
            <svg class="w-6 h-6 shrink-0 fill-current mr-4" viewBox="0 0 24 24">
              <path
                class="text-indigo-500"
                d="m12 10.856 9-5-8.514-4.73a1 1 0 0 0-.972 0L3 5.856l9 5Z"
              />
              <path
                class="text-indigo-300"
                d="m11 12.588-9-5V18a1 1 0 0 0 .514.874L11 23.588v-11Z"
              />
            </svg>
            <span>I’m a freelance / contractor</span>
          </div>
          <div
            class="absolute inset-0 border-2 border-transparent peer-checked:border-indigo-400 rounded pointer-events-none"
            aria-hidden="true"
          />
        </label>
        <label class="relative block cursor-pointer">
          <input type="radio" name="radio-buttons" class="peer sr-only" />
          <div
            class="flex items-center bg-white text-sm font-medium text-slate-800 p-4 rounded border border-slate-200 hover:border-slate-300 shadow-sm duration-150 ease-in-out"
          >
            <svg class="w-6 h-6 shrink-0 fill-current mr-4" viewBox="0 0 24 24">
              <path
                class="text-indigo-500"
                d="m12 10.856 9-5-8.514-4.73a1 1 0 0 0-.972 0L3 5.856l9 5Z"
              />
            </svg>
            <span>I’m just getting started</span>
          </div>
          <div
            class="absolute inset-0 border-2 border-transparent peer-checked:border-indigo-400 rounded pointer-events-none"
            aria-hidden="true"
          />
        </label>
      </div>
      <div class="flex items-center justify-between">
        {#if previous}
          <a
            class="text-sm underline hover:no-underline text-accent-content inline-flex items-center"
            href={previous.href}
            title={previous.title}
          >
            <Icon icon="arrowLeft" class="mr-2" /> Back
          </a>
        {/if}
        {#if next}
          <a
            class="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-auto"
            href={next.href}
            title={next.title}
          >
            Next Step <Icon icon="arrowRight" class="ml-2" />
          </a>
        {/if}
      </div>
    </form>
  </div>
</div>
