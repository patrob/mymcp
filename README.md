# My MCP - MCP Server Management SaaS

A modern SaaS application for managing Model Context Protocol (MCP) servers, built with Next.js 14+, Clerk, Stripe, and Supabase.

## Features

- **Authentication**: Clerk with GitHub/Google SSO
- **Billing**: Stripe subscriptions with multiple tiers
- **Database**: Supabase PostgreSQL
- **UI**: Modern design with shadcn/ui components
- **MCP Server Management**: Deploy and manage custom MCP servers

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Billing**: Stripe
- **Styling**: TailwindCSS + shadcn/ui
- **Language**: TypeScript
- **Deployment**: Vercel

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd my-mcp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your environment variables:
   - Clerk keys
   - Supabase URL and keys
   - Stripe keys

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth layout group
│   ├── (dashboard)/       # Dashboard layout group
│   ├── pricing/
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   ├── auth/
│   ├── dashboard/
│   └── forms/
├── lib/                   # Utilities
└── types/                 # TypeScript types
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm test` - Run tests

## Deployment

This app is optimized for deployment on Vercel. Simply connect your repository to Vercel and set up the environment variables.

## License

MIT License