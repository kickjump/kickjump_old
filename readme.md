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

Everything we work on, whether as employees, artistic souls, musically inclined or a side project junkies, we are reliant on open source software at some layer.

The value created by open source developers is astounding.

The problem is that almost none of the value created is passed onto the teams behind these open source projects. This is true even of ecosystem critical projects. Creators find themselves pleading for enough to sustain their work.

**KickJump** solves this fundamental problem by providing a toolkit for open source developers to build financially sustainable projects.

- Stakeholders can financially speculate on projects via their tokens.
- Governance is incentivized and monetized via tokens and credentials.
- Project specific rules based on the needs and requirements.
- Provide a suite of tools to enhance value creation of project stakeholders via zero-effort revenue share arrangements.

## Contributing

You will need the following installed on your machine:

- node >= 16
- rust

```bash
npm run bootstrap
```

This initializes the project and all requirements. The first time this runs it might take a few minutes while installing `anchor`.

The package manager used is `pnpm` which will be available after running the initial command.

To experiment with the GitHub API you will need to create your own development GitHub application.

Set the url of the app to `dev1.kickjump.co.uk` and run the following command to tunnel localhost through the server.

```bash
ssh -R dev1.kickjump.co.uk:80:localhost:3000 plan@localhost.run
```

## License

BSD 3-Clause, see the [LICENSE](./LICENSE) file.
