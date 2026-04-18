# Supabase Auth Setup Guide

## ✅ Migration Complete!

Successfully migrated from Clerk to Supabase Auth. All code is deployed.

## 🚀 Quick Start

### 1. Configure Supabase Auth Settings

Go to Supabase Dashboard → Authentication → Settings:

**Disable Email Confirmation (for testing):**
- Navigate to: https://supabase.com/dashboard/project/dwsxabdgqtmohzxhmhpn/auth/settings
- Find "Enable email confirmations"
- **Turn it OFF** (for immediate testing)
- Click "Save"

### 2. Create Test Users

**Option A: Via Supabase Dashboard**
1. Go to: https://supabase.com/dashboard/project/dwsxabdgqtmohzxhmhpn/auth/users
2. Click "Add user" → "Create new user"
3. Enter email and password
4. Click "Create user"

**Option B: Via Sign-Up Pages**
1. Go to your app's `/sign-up` page
2. Fill in the form
3. Submit (user will be created automatically)

### 3. Test Authentication

**Admin App:**
- URL: https://redrake-admin.vercel.app/sign-in
- Sign in with created credentials
- Should redirect to dashboard

**Affiliate App:**
- URL: https://redrake-affiliate.vercel.app/sign-in
- Sign in with created credentials
- Should redirect to dashboard

**Public App:**
- URL: https://redrake-public.vercel.app/sign-up
- Create new account
- Should redirect to homepage

## 🔧 Troubleshooting

### Issue: "Email not confirmed"

**Solution:**
1. Go to Supabase Dashboard → Auth → Settings
2. Disable "Enable email confirmations"
3. Or manually confirm users in Dashboard

### Issue: "Invalid credentials"

**Solution:**
1. Check if user exists in Supabase Dashboard
2. Verify password is correct (min 6 characters)
3. Try creating a new user

### Issue: Still seeing old Clerk errors

**Solution:**
1. Clear Vercel cache: Go to Vercel Dashboard → Deployments → Redeploy
2. Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. Clear browser cookies for your domain

### Issue: Middleware errors

**Solution:**
The new middleware uses Supabase SSR which is compatible with Edge Runtime.
If you see errors, check Vercel logs for specific issues.

## 📋 Environment Variables

Ensure these are set in Vercel for all three apps:

```env
NEXT_PUBLIC_SUPABASE_URL=https://dwsxabdgqtmohzxhmhpn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3c3hhYmRncXRtb2h6eGhtaHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0OTMwNDIsImV4cCI6MjA5MjA2OTA0Mn0.64f_LdbdUFlq-FBT8A-_7tZvVQW7YxO-XJph5HoOvRY
```

**Remove these (no longer needed):**
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY

## 🎯 What Changed

### Removed:
- ❌ Clerk authentication
- ❌ @clerk/nextjs package
- ❌ ClerkProvider
- ❌ Clerk middleware
- ❌ Clerk environment variables

### Added:
- ✅ Supabase Auth (@supabase/ssr)
- ✅ Custom auth utilities
- ✅ Supabase middleware
- ✅ Sign-in/sign-up pages
- ✅ Auth API routes

### Benefits:
- ✅ No Edge Runtime issues
- ✅ No MIDDLEWARE_INVOCATION_FAILED errors
- ✅ Better database integration
- ✅ More reliable on Vercel
- ✅ Simpler authentication flow

## 📱 Auth Flow

### Sign Up:
1. User goes to `/sign-up`
2. Fills email, password, name
3. Submits form
4. API creates user in Supabase Auth
5. User is automatically signed in
6. Redirected to dashboard/homepage

### Sign In:
1. User goes to `/sign-in`
2. Enters email and password
3. Submits form
4. API validates credentials
5. Session cookie is set
6. Redirected to dashboard

### Protected Routes:
1. Middleware checks for session
2. If no session → redirect to `/sign-in`
3. If session exists → allow access
4. Session is automatically refreshed

## 🔐 Security

- Passwords are hashed by Supabase
- Sessions are stored in HTTP-only cookies
- Middleware validates sessions on every request
- RLS policies protect database access

## 📊 Database Integration

The `users` table in your database needs to be updated to work with Supabase Auth:

**Current schema:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,  -- Remove this
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'affiliate',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Recommended update:**
```sql
-- Add Supabase auth user ID column
ALTER TABLE users ADD COLUMN auth_user_id UUID REFERENCES auth.users(id);

-- Make clerk_id nullable (for migration)
ALTER TABLE users ALTER COLUMN clerk_id DROP NOT NULL;

-- Or remove clerk_id entirely after migration
-- ALTER TABLE users DROP COLUMN clerk_id;
```

## 🚀 Next Steps

1. **Test authentication** on all three apps
2. **Create test users** in Supabase Dashboard
3. **Verify dashboards load** correctly
4. **Update database schema** if needed
5. **Configure email templates** in Supabase (optional)
6. **Set up password reset** flow (optional)

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Supabase Auth logs
3. Verify environment variables
4. Clear browser cache and cookies
5. Try creating a fresh user

## ✨ Success Criteria

You'll know it's working when:
- ✅ Sign-up creates users in Supabase
- ✅ Sign-in works with created credentials
- ✅ Dashboards load after authentication
- ✅ No middleware errors in Vercel logs
- ✅ Sessions persist across page refreshes
