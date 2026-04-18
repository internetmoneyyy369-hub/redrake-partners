# Supabase Auth Migration Plan

## Why Supabase Auth?
- Already using Supabase for database
- No Edge Runtime issues
- More reliable on Vercel
- Built-in email/password auth
- Better integration with existing database

## Migration Steps

### 1. Remove Clerk Dependencies
- Remove @clerk/nextjs from all package.json files
- Remove ClerkProvider from layouts
- Remove all middleware files
- Remove Clerk environment variables

### 2. Add Supabase Auth
- Use @supabase/ssr for Next.js App Router
- Create auth utilities
- Add middleware for session management
- Create sign-in/sign-up pages

### 3. Update Database
- Users table already exists with clerk_id
- Add email/password columns
- Update RLS policies to use Supabase auth

### 4. Create Auth Pages
- Sign-in page with email/password
- Sign-up page with email/password
- Password reset flow

## Implementation
Starting now...
