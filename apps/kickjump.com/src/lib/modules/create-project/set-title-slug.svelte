<script lang="ts">
  let title: string;
  let slug: string;
</script>

<div class="form-control">
  <div class="label">
    <span class="label-text">Project Title</span>
  </div>
  <label class="input-group">
    <span>Title</span>
    <input
      bind:value={title}
      type="text"
      placeholder="Good stuff project"
      class="input input-bordered"
    />
  </label>
</div>
<input
  type="text"
  bind:value={slug}
  placeholder="Type here"
  class="input input-bordered input-md w-full max-w-xs"
/>
