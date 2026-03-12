# techweb-project

## Workspaces

- `packages/backend`: Koa backend and backend internal packages.
- `packages/frontend`: plain Svelte frontend and frontend internal packages.

## Frontend auth

The frontend auth implementation is in `packages/frontend` and mirrors backend package organization:

- `packages/frontend/packages/core`
- `packages/frontend/packages/auth-core`
- `packages/frontend/packages/auth-http`
- `packages/frontend/packages/auth-svelte`

### Run locally

1. Install dependencies from repo root:

```bash
npm install
```

2. Start backend:

```bash
npm run start --workspace techweb-backend
```

3. In another terminal, start frontend:

```bash
npm run dev --workspace @techweb-project/frontend
```

### API configuration

- Copy `packages/frontend/.env.example` to `packages/frontend/.env`.
- Set `VITE_API_BASE_URL`.
- Default value is `/api`, which uses Vite dev proxy to forward requests to `http://localhost:3000`.