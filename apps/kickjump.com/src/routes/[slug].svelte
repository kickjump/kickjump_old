<script lang="ts" context="module">
  import type { ProjectModel } from '@kickjump/db';
</script>

<script lang="ts">
  export let project: ProjectModel.Project;
</script>

<h2>{project.title}</h2>
<p>{project.description}</p>
