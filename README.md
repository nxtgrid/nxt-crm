# NXT CRM

NXT CRM is a **progressive web app (PWA)** for mini-grid developers and operators, as part of the NXT software suite. It provides a real-time dashboard for monitoring and managing mini-grid sites, hardware, and energy communities.

## Features

- Real-time grid monitoring via MQTT
- Site and hardware management
- Energy community and customer overview
- Grafana-powered analytics dashboards
- Mapbox-based geo visualisation
- Flutterwave payment integration
- White-label branding support per customer subdomain
- Offline-capable PWA

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Vue 3](https://vuejs.org/) |
| Build tool | [Vite 6](https://vitejs.dev/) |
| State management | [Pinia](https://pinia.vuejs.org/) |
| Routing | [Vue Router](https://router.vuejs.org/) |
| Styling | [Sass](https://sass-lang.com/) |
| HTTP | [ky](https://github.com/sindresorhus/ky) |
| Backend | [Supabase](https://supabase.com/) |
| Shared UI | [nxt-ui-components](https://github.com/nxtgrid/nxt-ui-components) (`nxt-shared`) |

## Source & license

- **Repository:** [https://github.com/nxtgrid/nxt-crm](https://github.com/nxtgrid/nxt-crm)
- **License:** This project is released under the [Mozilla Public License 2.0](https://www.mozilla.org/MPL/2.0/) (MPL-2.0). The full license text is in [LICENSE](./LICENSE) in the repository.

## Prerequisites

- [Node.js](https://nodejs.org/) — use the version in `.nvmrc` (managed via [NVM](https://github.com/nvm-sh/nvm))
- A running instance of the NXT backend (or a local Supabase setup)

## Getting Started

### 1. Clone sibling repositories

NXT CRM shares UI components and libraries with other NXT front-end apps via [nxt-ui-components](https://github.com/nxtgrid/nxt-ui-components). Clone it as a **sibling** of this project:

```sh
git clone https://github.com/nxtgrid/nxt-ui-components.git ../nxt-ui-components
```

### 2. Install dependencies

```sh
nvm use
npm install
```

> The `jsconfig.json` path alias `@nxt/*` already points to `../nxt-ui-components/shared`, so nxt-ui-components is available automatically in local development without any additional build step.

### 3. Configure environment

Copy `.env.example` to `.env` and fill in your values:

```sh
cp .env.example .env
```

See `.env.example` for a description of each variable.

#### Developing against a local Supabase instance

Use `.env.local` to override the relevant settings when running Supabase locally:

```sh
VITE_API_URL="http://localhost:80"
VITE_SUPABASE_REFERENCE_ID="local"
VITE_SUPABASE_ANON_KEY="<key from `supabase start`>"
```

### 4. Start the development server

```sh
npm run dev
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the Vite dev server with hot-reload |
| `npm run build` | Compile and minify for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Lint all JS and Vue files |
| `npm run lint:fix` | Lint and auto-fix |

## White-label Branding

NXT CRM supports per-customer branding via the `public/branding/` folder. Each subdirectory represents a customer slug matched against the deployment's vanity subdomain. See `public/branding/apply-branding.js` and the included `example` entry for how to add your own.

## Code Quality

All commits are linted via [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/okonet/lint-staged). If you encounter a "command not found" error on commit, see the [Husky troubleshooting guide](https://typicode.github.io/husky/troubleshooting.html#command-not-found).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Authors & Contributors

**Bobby Bol** ([studio.innua@gmail.com](mailto:studio.innua@gmail.com)) — author & maintainer

See [AUTHORS.md](./AUTHORS.md) for the full list of authors and [CONTRIBUTORS.md](./CONTRIBUTORS.md) for all contributors.

## Third-party licenses

Dependencies include [nxt-ui-components](https://github.com/nxtgrid/nxt-ui-components) (`nxt-shared`) and its npm tree; those packages have their own terms. See the nxt-ui-components README, including any section on third-party licenses, at [https://github.com/nxtgrid/nxt-ui-components](https://github.com/nxtgrid/nxt-ui-components).
