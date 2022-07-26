<script lang="ts" context="module">
  import 'bytemd/dist/index.css';

  import { validator } from '@felte/validator-zod';
  import { context, trpc } from '@kickjump/trpc/client';
  import { ProjectUtils } from '@kickjump/types';
  import cx from 'clsx';
  import { createForm } from 'felte';
  import type { z } from 'zod';

  import { goto } from '$app/navigation';
  import { authenticated } from '$lib/route-loaders';
  import { Editor } from '$modules/editor';

  export const load = authenticated();
</script>

<script lang="ts">
  const { proxy } = context();

  const schema = ProjectUtils.createSchema(async (value) => {
    try {
      const result = await proxy.project.slugAvailable.query(value);
      return result.available;
    } catch {
      return false;
    }
  });

  type FormFields = z.infer<typeof schema>;
  const create = trpc.project.create.mutation();
  const { form, errors, handleSubmit, isValid, data, touched } = createForm<FormFields>({
    transform: (input) => ({
      ...(input as FormFields),
      name: (input as FormFields).name.toLocaleLowerCase(),
    }),
    onSubmit: async (input) => {
      const { description, name } = input;

      await $create.mutateAsync({ name, description });
      await goto(`/${name}/edit`);
    },
    initialValues: { description: '', name: '' },
    extend: [validator({ schema })],
  });

  $: {
    if ($data.description) {
      $touched.description = true;
    }
  }
</script>

<form class="grid-cols-2 grid gap-4" use:form>
  <section>
    <h1 class="text-3xl text-base-content font-bold pb-14">Create a new project</h1>
    <div class="form-control">
      <label class="input-group">
        <span>Name <span class="text-error">*</span></span>
        <input
          name="name"
          type="text"
          placeholder="project-name"
          class={cx('input input-bordered w-full', $errors.name && 'input-error')}
          on:keypress={(event) => (event.key === 'Enter' && $isValid ? handleSubmit() : undefined)}
        />
      </label>
      <ul class="label flex-col items-start list-disc">
        {#if $errors.name}
          {#each $errors.name as error}
            <li class="label-text text-error">
              {error}
            </li>
          {/each}
        {:else}
          <span class="label-text text-error-content"> &nbsp; </span>
        {/if}
      </ul>
    </div>
    <button type="submit" class="btn btn-primary">Create</button>
  </section>
  <section class="pt-6">
    <ul class="label flex-col items-start list-disc">
      {#if $errors.description}
        {#each $errors.description as error}
          <li class="label-text text-error">
            {error}
          </li>
        {/each}
      {:else}
        <span class="label-text text-error-content"> &nbsp; </span>
      {/if}
    </ul>
    <Editor bind:value={$data.description} />
    <!-- <textarea name="description" placeholder="enter here" /> -->
  </section>
</form>

<style>
  :global(.bytemd) {
    height: 60vh;
    max-height: 800px;
  }
</style>
