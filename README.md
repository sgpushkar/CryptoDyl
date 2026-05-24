# CryptoDyl

CryptoDyl is a React + TanStack Start app with a crypto-themed editorial layout, article browsing, category pages, admin UI, and a branded splash screen.

## Tech Stack

- Vite
- React 19
- TanStack Start / TanStack Router
- TypeScript
- Tailwind CSS v4
- Framer Motion

## Prerequisites

- Node.js 22+
- npm

## Development

Install dependencies:

```bash
npm install
```

Start the local dev server:

```bash
npm run dev
```

## Build

Create a production build:

```bash
npm run build
```

## Linting

Run ESLint:

```bash
npm run lint
```

Format the codebase:

```bash
npm run format
```

## Vercel Deployment

This repo is configured for Vercel with a server-backed route rewrite.

- Build command: `npm run vercel-build`
- Rewrites: non-asset routes are forwarded to `/api/[...path]`

Important files:

- [vercel.json](./vercel.json)
- [api/[...path].ts](./api/[...path].ts)
- [src/server.ts](./src/server.ts)

After deploying, Vercel should serve the app from the catch-all Edge Function instead of returning a static 404.

## Project Structure

- `src/cryptodyl` - main app UI
- `src/routes` - TanStack route definitions
- `src/lib` - shared utilities, assets, and splash screen component
- `api` - Vercel function entrypoint

## Notes

- The home route and wildcard route both render the app through `Suspense` with a custom splash screen fallback.
- Client-side state such as admin/login info and posts is stored in `localStorage`.
- The app is currently set up to run on Vercel rather than Cloudflare.
