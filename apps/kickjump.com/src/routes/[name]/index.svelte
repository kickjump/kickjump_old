<script lang="ts" context="module">
  import type { ProjectUtils } from '@kickjump/types';

  import { Button } from '$components';
  import { Viewer } from '$modules/editor';
</script>

<script lang="ts">

  export let project: ProjectUtils.Project;
</script>

<section>
  <div class="flex items-center gap-3">
    <h2>{project.name}</h2>
    <Button href="/{project.name}/edit" class="align-middle" variant="link">Edit</Button>
  </div>

  <Viewer value={project.description} />

  <span>visibility: <strong>{project.visibility}</strong></span>
</section>
