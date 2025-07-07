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

4. **Seed the database and Clerk with test users (recommended)**
   ```bash
   npm run seed
   ```
   This automatically creates test users in both Clerk and your database:
   - `patrob+mymcp+free@gmail.com` (Free tier) - Password: `TestPassword123!`
   - `patrob+mymcp+dev@gmail.com` (Dev tier) - Password: `TestPassword123!`
   - `patrob+mymcp+pro@gmail.com` (Pro tier) - Password: `TestPassword123!`
   - `patrob+mymcp+team@gmail.com` (Team tier) - Password: `TestPassword123!`
   
   To completely reset and recreate all test data:
   ```bash
   npm run seed:reset
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

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
- `npm run seed` - Seed database with test users
- `npm run seed:reset` - Clear and re-seed database

## Development Workflow

### Testing Locally

The seeded test users allow you to test the full application without setting up webhooks:

1. **Free Tier User** (`patrob+mymcp+free@gmail.com`)
   - User ID: `user_free_test`
   - Can only use built-in MCP servers
   - No custom servers allowed

2. **Dev Tier User** (`patrob+mymcp+dev@gmail.com`)
   - User ID: `user_dev_test`
   - 1 custom MCP server included
   - Has sample GitHub integration server

3. **Pro Tier User** (`patrob+mymcp+pro@gmail.com`)
   - User ID: `user_pro_test`
   - Up to 3 custom MCP servers
   - Sample servers with different statuses (active, inactive, error)

4. **Team Tier User** (`patrob+mymcp+team@gmail.com`)
   - User ID: `user_team_test`
   - Unlimited custom MCP servers
   - Multiple sample servers demonstrating full features

### Testing with Automated Setup

The seeding script creates a complete test environment:

1. **Automated Clerk Integration** - Creates users directly in Clerk (no manual setup needed)
2. **Perfect Synchronization** - Database records use actual Clerk user IDs
3. **Duplication Prevention** - Safe to run multiple times without creating duplicates
4. **Sample Data** - Each tier includes realistic MCP servers with different statuses

**To test the signup flow:**
1. Run `npm run seed` to create test users
2. Visit `/sign-in` and use any test email with password `TestPassword123!`
3. Dashboard will immediately show tier-appropriate data

**To test new user signup:**
1. Use a different email address to test the real signup → webhook → dashboard flow
2. The Clerk webhook will automatically create the database record

## Deployment

This app is optimized for deployment on Vercel. Simply connect your repository to Vercel and set up the environment variables.

## License

MIT License