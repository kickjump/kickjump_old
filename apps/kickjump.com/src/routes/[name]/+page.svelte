<script lang="ts">
  import { Button } from '$components';
  import { Viewer } from '$modules/editor';

  import type { PageData } from './$types';

  export let data: PageData;
  $: ({ project } = data);
  // $: console.log(project);
</script>

<section>
  <div class="flex items-center gap-3">
    <h2>{project.name}</h2>
    <Button href="/{project.name}/edit" class="align-middle" variant="link">Edit</Button>
  </div>

  <Viewer value={project.description} />

  <span>visibility: <strong>{project.visibility}</strong></span>
</section>
