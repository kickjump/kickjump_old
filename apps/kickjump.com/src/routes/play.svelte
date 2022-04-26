<script lang="ts">
  import {
    IconButton,
    Alert,
    Button,
    ButtonGroup,
    Modal,
    ModalDescription,
    ModalTitle,
  } from '$components';
  import ConnectionProvider from '$components/solana/connection-provider.svelte';
  import WalletAdapter from '$components/solana/wallet-adapter.svelte';
  import WalletProvider from '$components/solana/wallet-provider.svelte';
  import WalletSteps from '$components/solana/wallet-steps.svelte';
  let isOpen = false;
  let button: Button | undefined;

  const onToggle = () => {
    isOpen = !isOpen;
  };

  $: message = isOpen ? 'Close' : 'Open';
</script>

<div class="place-self-center container gap-y-5 grid grid-flow-row pt-8 mb-24">
  <section class="flex flex-col gap-y-3">
    <h2 class="">Solana</h2>
    <ConnectionProvider />
    <WalletProvider />
    <div><WalletSteps /></div>
  </section>
  <section class="flex flex-col gap-y-3">
    <h2 class="">Modal</h2>
    <span><Button onClick={onToggle} theme="primary">{message}</Button></span>
    <Modal bind:isOpen initialFocus={button?.getElement()}>
      <ModalTitle as="h3" slot="heading">Title</ModalTitle>
      <svelte:fragment slot="content">
        <ModalDescription>This is the content. And it is pretty.</ModalDescription>
      </svelte:fragment>
      <svelte:fragment slot="footer">
        <!-- <ButtonGroup> -->
        <Button theme="default" onClick={() => (isOpen = false)}>Default</Button>
        <Button theme="primary" bind:this={button}>Button</Button>
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
    <h2 class="">Solana</h2>
    <div>
      <WalletAdapter />
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
