# Manual Redeploy Instructions

Environment variables already set hain Vercel pe, but redeploy karna padega taaki changes apply ho jayein.

## ✅ Environment Variables Already Set

Teeno projects me ye environment variables already set hain:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 🔄 Manual Redeploy Steps

### Option 1: Vercel Dashboard Se (Recommended)

1. **Jao:** https://vercel.com/dashboard
2. **Admin App:**
   - Click on "redrake-admin"
   - Click "Deployments" tab
   - Latest deployment pe 3 dots (...) click karo
   - Click "Redeploy"
   - Confirm karo

3. **Affiliate App:**
   - Click on "redrake-affiliate"
   - Click "Deployments" tab
   - Latest deployment pe 3 dots (...) click karo
   - Click "Redeploy"
   - Confirm karo

4. **Public App:**
   - Click on "redrake-public"
   - Click "Deployments" tab
   - Latest deployment pe 3 dots (...) click karo
   - Click "Redeploy"
   - Confirm karo

### Option 2: Git Push Se (Automatic)

Koi bhi chhota sa change karo aur push karo:

```bash
cd stakehub
git commit --allow-empty -m "trigger redeploy"
git push origin master
```

## ⏱️ Wait Time

- Har deployment 2-3 minutes leta hai
- Teeno apps parallel me deploy honge
- Total time: ~3-4 minutes

## 🎯 After Redeploy

### Test Admin Login:
1. Jao: https://redrake-admin.vercel.app/sign-in
2. Email: sjdfreakdeals@gmail.com
3. Password: Admin@123
4. Login karo

### Test Affiliate Signup:
1. Jao: https://redrake-affiliate.vercel.app/sign-up
2. Apna email/password dalo
3. Signup karo

### Test Public Signup:
1. Jao: https://redrake-public.vercel.app/sign-up
2. Apna email/password dalo
3. Signup karo

## 🐛 Agar Phir Bhi Error Aaye

### Check Vercel Logs:
1. Jao: https://vercel.com/dashboard
2. Project pe click karo
3. Latest deployment pe click karo
4. "Logs" tab kholo
5. Error message dekho

### Check Browser Console:
1. Browser me F12 press karo
2. Console tab kholo
3. Signup/Login try karo
4. Error message dekho

### Common Issues:

**"Server error. Please try again."**
- Environment variables missing honge
- Vercel logs check karo
- Console me exact error dikhega

**"Invalid credentials"**
- Password galat hai
- User exist nahi karta
- Supabase Dashboard me user check karo

**"Email not confirmed"**
- Email confirmation enabled hai
- Supabase Dashboard me disable karo
- Ya manually user confirm karo

## 📞 Help

Agar koi issue ho toh:
1. Vercel logs ka screenshot bhejo
2. Browser console ka screenshot bhejo
3. Exact error message batao
