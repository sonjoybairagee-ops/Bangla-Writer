# Fix Vercel Login Issue

## Problem
Login করতে পারছেন না কারণ Vercel এ `NEXTAUTH_URL` সঠিকভাবে set করা নেই।

## Solution

### Option 1: Vercel Dashboard (Easiest)

1. যান: https://vercel.com/your-username/ai-content-os/settings/environment-variables
2. এই variables add/update করুন:
   ```
   NEXTAUTH_URL = https://banglacreatortai.vercel.app
   NEXTAUTH_SECRET = Kxj9mP3nQ8rW5tYv2bN4cM7zL0sA6hD1fG8eR3jT5iU9oP2wX4qV6kB7yC0mL8nH
   ```
3. **Important**: Environment select করুন: Production, Preview, Development (সবগুলোতে)
4. Save করার পর **Redeploy** button click করুন

### Option 2: Vercel CLI (Command Line)

```bash
# Install Vercel CLI (যদি already install না থাকে)
npm i -g vercel

# Login to Vercel
vercel login

# Set environment variables
vercel env add NEXTAUTH_URL production
# Enter: https://banglacreatortai.vercel.app

vercel env add NEXTAUTH_SECRET production
# Enter: Kxj9mP3nQ8rW5tYv2bN4cM7zL0sA6hD1fG8eR3jT5iU9oP2wX4qV6kB7yC0mL8nH

# Redeploy
vercel --prod
```

### Option 3: Git Push (Automatic)

If you already have `.env` configured locally, just push to GitHub and Vercel will auto-deploy:

```bash
git add .
git commit -m "Fix: Update NEXTAUTH_URL for production"
git push origin main
```

## Check All Required Environment Variables on Vercel

Make sure these are set:

```bash
DATABASE_URL=postgresql://neondb_owner:npg_eu3K0ZgpPOmT@ep-proud-credit-aoqoho0b-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

NEXTAUTH_URL=https://banglacreatortai.vercel.app
NEXTAUTH_SECRET=Kxj9mP3nQ8rW5tYv2bN4cM7zL0sA6hD1fG8eR3jT5iU9oP2wX4qV6kB7yC0mL8nH

OPENAI_API_KEY=sk-proj-YOUR_OPENAI_API_KEY

GROQ_API_KEY=gsk_YOUR_GROQ_API_KEY

NEXT_PUBLIC_APP_URL=https://banglacreatortai.vercel.app
NEXT_PUBLIC_APP_NAME=Bangla Creator

RESEND_API_KEY=re_FjDTcDmx_DZAH3uXi7CK6rfFcf1dhyBdF
EMAIL_FROM=noreply@banglawriter.com

CRON_SECRET=your_real_CRON_SECRET
```

## After Setting Environment Variables

1. **Redeploy**: Vercel dashboard এ গিয়ে "Redeploy" button click করুন
2. **Wait**: 1-2 minutes deployment complete হতে দিন
3. **Test Login**: https://banglacreatortai.vercel.app/login এ গিয়ে login করুন
4. **Credentials**: 
   - Email: `sonjoybairagee@gmail.com`
   - Password: `dBsingsappa5924`

## Common Issues

### Still seeing CORS errors?
- Clear browser cache এবং cookies clear করুন
- Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

### Still showing old error message?
- Vercel deployment complete হয়নি - 2-3 minutes wait করুন
- Check deployment status: https://vercel.com/your-username/ai-content-os/deployments

### "Invalid credentials" error?
- Database এ user আছে কিনা check করুন
- Password সঠিক দিয়েছেন কিনা verify করুন

## Quick Test (Local)

Local এ test করতে চাইলে:

```bash
# Start dev server
npm run dev

# Open browser
http://localhost:3000/login
```

Local এ work করলে Vercel এও work করবে (environment variables সঠিক থাকলে)।
