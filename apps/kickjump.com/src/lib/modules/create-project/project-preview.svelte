<script lang="ts" context="module">
  import type { ProjectModel } from '@kickjump/db';
</script>

<script lang="ts">
  export let project: ProjectModel.Project;
</script>

<h1>{project.title}</h1>
