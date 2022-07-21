<script lang="ts" context="module">
  import { context, trpc } from '@kickjump/trpc/client';
  import { setSlugAndTitle, validator } from '@kickjump/types';
  import cx from 'clsx';
  import { createForm } from 'felte';
  import type * as z from 'zod';

  import { getStepHref, persistedProject } from './project-steps.js';
</script>

<script lang="ts">
  const { proxy } = context();

  const schema = setSlugAndTitle(async (value) => {
    try {
      const result = await proxy.project.slugAvailable.query(value);
      return result;
    } catch {
      return false;
    }
  });

  const createProject = trpc.project.setSlugAndTitle.mutation();
  const { form, errors, data, isValid } = createForm<z.infer<typeof schema>>({
    onSubmit: async (values) => {
      console.log({ $isValid });

      if (!$isValid) {
        return;
      }

      $persistedProject = await $createProject.mutateAsync({
        slug: values.slug,
        title: values.title,
      });

      const { goto } = await import('$app/navigation');

      await goto(getStepHref(1));
    },
    extend: [validator({ schema })],
  });

  $: console.log($errors);
  $: console.log($data);
</script>

<form use:form>
  <div class="form-control">
    <label class="input-group">
      <span>Title</span>
      <input
        name="title"
        type="text"
        placeholder="A new JS framework"
        class={cx('input input-bordered w-full', $errors.title && 'input-error')}
      />
    </label>
    <div class="label flex-col items-start">
      {#if $errors.title}
        {#each $errors.title as error}
          <span class="label-text text-error">
            {error}
          </span>
        {/each}
      {:else}
        <span class="label-text text-error-content"> &nbsp; </span>
      {/if}
    </div>
  </div>
  <div class="form-control pt-8">
    <label class="input-group sketchy-4">
      <span>Slug</span>
      <input
        name="slug"
        type="text"
        placeholder="new-js-framework"
        class={cx('input input-bordered w-full', $errors.slug && 'input-error')}
      />
    </label>
    <ul class="label flex-col items-start list-disc">
      {#if $errors.slug}
        {#each $errors.slug as error}
          <li class="label-text text-error">
            {error}
          </li>
        {/each}
      {:else}
        <span class="label-text text-error-content"> &nbsp; </span>
      {/if}
    </ul>
  </div>
</form>
