<script lang="ts">
  import {
    Alert,
    Button,
    ButtonGroup,
    IconButton,
    Modal,
    ModalDescription,
    ModalTitle,
  } from '$components';
  import { SolanaProvider, WalletSteps } from '$components/solana';

  let open = false;
  let button: Button | undefined;

  const onToggle = () => {
    open = !open;
  };

  $: message = open ? 'Close' : 'Open';
</script>

<div class="place-self-center container gap-y-5 grid grid-flow-row pt-8 mb-24">
  <section class="flex flex-col gap-y-3">
    <h2 class="">Solana</h2>
    <SolanaProvider />
    <div><WalletSteps /></div>
  </section>
  <section class="flex flex-col gap-y-3">
    <h2 class="">Modal</h2>
    <span><Button onClick={onToggle} theme="primary">{message}</Button></span>
    <Modal
      {open}
      onClose={() => {
        console.log('closing!!!');
        open = false;
      }}
      initialFocus={button?.getElement()}
    >
      <ModalTitle as="h3" slot="heading">Title</ModalTitle>
      <svelte:fragment slot="content">
        <ModalDescription>This is the content. And it is pretty.</ModalDescription>
      </svelte:fragment>
      <svelte:fragment slot="footer">
        <!-- <ButtonGroup> -->
        <Button theme="default" onClick={() => (open = false)}>Default</Button>
        <SolanaProvider />
        <div><WalletSteps /></div>
        <!-- </ButtonGroup> -->
      </svelte:fragment>
    </Modal>
  </section>
  <section class="flex flex-col gap-y-3">
    <h2 class="">Custom Icons</h2>
    <div>
      <IconButton icon="glow" />
      <IconButton icon="phantom" />
    </div>
  </section>
  <section class="flex flex-col gap-y-3">
    <h2 class="">Alerts</h2>
    <Alert type="default">This is an alert</Alert>
    <Alert type="info">This is an alert</Alert>
    <Alert type="success">This is an alert</Alert>
    <Alert type="warning">This is an alert</Alert>
    <Alert type="error">This is an alert</Alert>
  </section>
  <div class="flex flex-col gap-y-3">
    <h2 class="">Buttons</h2>
    <div class="flex flex-wrap flex-row gap-x-2">
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

    <div class="flex flex-wrap flex-row gap-x-2">
      <h3>Variants</h3>
      <Button theme="primary">Button</Button>
      <Button theme="primary" variant="outline">Outline</Button>
      <Button theme="primary" variant="ghost">Ghost</Button>
      <Button theme="primary" variant="link">Link</Button>
    </div>

    <div class="flex flex-wrap flex-row gap-x-2">
      <h3>Group</h3>
      <ButtonGroup>
        <Button theme="primary">1</Button>
        <Button theme="secondary">2</Button>
        <Button theme="accent">3</Button>
      </ButtonGroup>
    </div>
  </div>
</div>
