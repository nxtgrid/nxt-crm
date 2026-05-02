# Contributing to NXT CRM

Thank you for your interest in contributing to NXT CRM. This document explains how to get your development environment set up and the conventions we follow.

## Prerequisites

- [Node.js](https://nodejs.org/) via [NVM](https://github.com/nvm-sh/nvm) — run `nvm use` to activate the correct version
- [nxt-ui-components](https://github.com/nxtgrid/nxt-ui-components) cloned as a sibling of this project (`../nxt-ui-components`)

## Setting Up

```sh
git clone https://github.com/nxtgrid/nxt-crm.git
git clone https://github.com/nxtgrid/nxt-ui-components.git ../nxt-ui-components
cd nxt-crm
nvm use
npm install
cp .env.example .env   # then fill in your values
npm run dev
```

## Development Workflow

1. **Fork** the repository and create your branch from `main`.
2. **Name your branch** using the following convention:
   - `feat/short-description` — new feature
   - `fix/short-description` — bug fix
   - `chore/short-description` — tooling, dependencies, refactoring
   - `docs/short-description` — documentation only
3. **Make your changes** and ensure the linter passes (`npm run lint`).
4. **Open a pull request** against `main` with a clear description of what changed and why.

## Code Style

This project uses [ESLint](https://eslint.org/) with the `nxt-shared` config. All staged files are linted automatically on every commit via [Husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/okonet/lint-staged).

- Run `npm run lint` to check for issues.
- Run `npm run lint:fix` to auto-fix where possible.
- The linter is configured with `--max-warnings=0` — no warnings are allowed in a commit.

## Commit Messages

Use clear, imperative present-tense messages:

```
feat: add real-time battery status to grid overview
fix: correct MQTT reconnect loop on network loss
chore: upgrade Vite to v6
docs: expand .env.example with new MQTT variables
```

## Reporting Issues

Please open an issue and include:
- A clear description of the problem or suggestion
- Steps to reproduce (for bugs)
- Expected vs. actual behaviour
- Your Node.js version and operating system

## Questions

For questions about the project, reach out to [studio.innua@gmail.com](mailto:studio.innua@gmail.com).
