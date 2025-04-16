# MEMsched

A Svelte 5 application with SvelteKit built for Cloudflare Pages deployment.

## Prerequisites

- Node.js v22.12.0 or later
- pnpm v10.3.0 or later

## Getting Started

Clone the repository and install dependencies:

```bash
# Install dependencies
pnpm install
```

## Environment Setup

The project uses several environment files for different contexts:

1. Copy the example environment file to set up your local environment:

```bash
# Copy the example file
cp .env.local.example .env.local

# Edit the file with your credentials
```

2. Required environment variables:

```
# OAuth providers
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Stripe integration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

3. Environment files breakdown:

   - `.env.local` - Local overrides (not committed to git)
   - `.env.development` - Development environment variables
   - `.env.production` - Production environment variables
   - `.env.testing` - Testing environment variables
   - `.dev.vars` - Cloudflare environment variables for local development

4. Setting up `.dev.vars` for production preview:

The `.dev.vars` file is required for running `pnpm preview` which uses Wrangler to simulate the Cloudflare Pages environment locally. Create a `.dev.vars` file in the project root with the following variables:

```
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

Note: The `.dev.vars` file is used by Wrangler to simulate the environment variables that would be set in the Cloudflare Pages dashboard for production.

## Development

Start a development server:

```bash
# Start the dev server
pnpm dev

# The dev server will open automatically in your browser
```

## Building and Preview

Build the application for production:

```bash
# Create a production build
pnpm build

# Preview the production build locally
pnpm preview
```

## Database Operations

The project uses Drizzle ORM with Cloudflare D1:

```bash
# Generate migrations
pnpm db:generate --name <migration_name>

# Push schema changes
pnpm db:push

# Apply migrations locally
pnpm d1:migrate

# Apply migrations to production
pnpm prod:d1:migrate

# Open Drizzle Studio
pnpm db:studio
```

## Deployment

The application is deployed to Cloudflare Pages:

```bash
# Deploy to Cloudflare Pages
pnpm deploy
```

## Testing

Run tests:

```bash
# Run unit tests
pnpm test:unit

# Run end-to-end tests
pnpm test:e2e

# Run all tests
pnpm test
```

## Technologies

- Svelte 5 with runes
- SvelteKit 2
- TypeScript
- Tailwind CSS
- Shadcn UI components
- Drizzle ORM
- Cloudflare D1 database
- Cloudflare KV for caching
