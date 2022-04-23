<script lang="ts">
  import { Alert, Button } from '$components';
</script>

<div class="gap-y-5 grid grid-flow-row pt-8 mb-24">
  <section class="flex flex-col gap-y-3">
    <h2 class="">Alerts</h2>
    <Alert type="default">This is an alert</Alert>
    <Alert type="info">This is an alert</Alert>
    <Alert type="success">This is an alert</Alert>
    <Alert type="warning">This is an alert</Alert>
    <Alert type="error">This is an alert</Alert>
  </section>
  <div class="flex flex-col gap-y-3 items-center">
    <h2 class="">Buttons</h2>
    <div class="flex flex-wrap flex-row gap-x-2 justify-center">
      <h3>Themes</h3>
      <Button theme="default">Default</Button>
      <Button theme="primary">Button</Button>
      <Button theme="secondary">Button</Button>
      <Button theme="accent">Button</Button>
      <Button theme="info">Button</Button>
      <Button theme="success">Button</Button>
      <Button theme="warning">Button</Button>
      <Button theme="error">Button</Button>
    </div>

    <div class="flex flex-wrap flex-row gap-x-2 justify-center">
      <h3>Variants</h3>
      <Button theme="primary">Button</Button>
      <Button theme="primary" variant="outline">Outline</Button>
      <Button theme="primary" variant="ghost">Ghost</Button>
      <Button theme="primary" variant="link">Link</Button>
    </div>
  </div>
</div>
