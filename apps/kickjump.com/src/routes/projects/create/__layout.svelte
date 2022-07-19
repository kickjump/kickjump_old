<script lang="ts">
  import { ProgressBar, ProgressForm } from '$modules/create-project';
</script>

<div class="grid-cols-2 grid ">
  <section>
    <ProgressBar />
    <slot />
  </section>
</div>
