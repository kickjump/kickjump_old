<p align="center">
  <a href="#">
    <img width="300" height="300" src="./.monots/assets/logo.svg" alt="svg logo from openmoji.org" title="SVG Logo from openmoji.org" />
  </a>
</p>

<p align="center">
  Your toolkit for financially sustainable open source development.
</p>

<br />

<p align="center">
  <a href="#getting-started"><strong>Getting Started</strong></a> ·
  <a href="#why"><strong>Why?</strong></a> ·
  <a href="#plans"><strong>Plans</strong></a> ·
  <a href="./docs/docs"><strong>Documentation</strong></a> ·
  <a href="./.github/contributing.md"><strong>Contributing</strong></a>
</p>

<br />

<p align="center">
  <a href="https://github.com/kickjump/kickjump/actions?query=workflow:ci">
    <img src="https://github.com/kickjump/kickjump/workflows/ci/badge.svg?branch=main" alt="Continuous integration badge for github actions" title="CI Badge" />
  </a>
</p>

<br />

## Description

Open source software has taken over the world.

Everything we work on, whether as employees, artistic souls, musically inclined or a side project junkies, we are reliant on open source software.

The value created by open source developers projects and developers is astounding.

The problem is that almost none of the value created is passed onto the teams behind these open source projects. This is true even of ecosystem critical projects. Creators find themselves pleading for enough to sustain their work.

**KickJump** solves this fundamental problem by providing a toolkit for open source developers to build financially sustainable projects.

- Stakeholders can financially speculate on projects via their tokens.
- Governance is incentivized and monetized via tokens and credentials.
- Project specific rules based on the needs and requirements.
- Provide a suite of tools to enhance value creation of project stakeholders via zero-effort revenue share arrangements.

## Contributing

You will need the following installed on your machine:

- [node](https://nodejs.org/en/) - the recommended way of installing is with [fnm](https://github.com/Schniz/fnm)
- [rust](https://www.rust-lang.org/tools/install)

I recommend using [`fnm`](https://github.com/Schniz/fnm) for node and [rustup](https://github.com/rust-lang/rustup) for rust. Once setup they will automatically derive the recommended version of rust and node without impacting your global installations.

To get started:

```bash
npm run bootstrap
```

This initializes the project and all requirements. The first time this runs it might take a few minutes installing `anchor` and building the rust dependencies.

The package manager used is `pnpm` which will be available after running the bootstrap command.

To experiment with the GitHub API you will need to create your own GitHub application. More information to follow.

In order to test the webhooks, etc, your best bet is to set up `cloudflared` which is a super fast and free tunnelling tool. The url and domain name that you should be used in your development github application.

Here is the [guide](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/).

The setup is quite tricky but it should work eventually and is very fast and free.

## License

BSD 3-Clause, see the [LICENSE](./LICENSE) file.
