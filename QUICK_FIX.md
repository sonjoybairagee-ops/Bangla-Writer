# Quick Fix Guide ✅

## ✅ Step 1: Prisma Client Generated Successfully!

The Prisma client has been generated. Now follow these steps:

## Step 2: Set up your Database (Choose One)

### Option A: Use Supabase (Recommended - Free & Easy)

1. Go to https://supabase.com/dashboard
2. Create new project (takes 2 minutes)
3. Go to Project Settings → Database
4. Copy the "Connection string" (Direct connection)
5. Update `.env.local`:

```env
DATABASE_URL="postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

### Option B: Use Local PostgreSQL

If you have PostgreSQL installed locally:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/ai_content_os"
```

Create the database:
```bash
# In PostgreSQL
CREATE DATABASE ai_content_os;
```

### Option C: Use Neon (Alternative)

1. Go to https://neon.tech
2. Create new project
3. Copy connection string
4. Update `.env.local`

## Step 3: Push Database Schema

```bash
cd ai-content-os
npx prisma db push
```

This will create all the tables in your database.

## Step 4: Set Other Required Environment Variables

Edit `.env.local`:

```env
# Database (from Step 2)
DATABASE_URL="postgresql://..."

# NextAuth Secret (Generate one)
# Run: openssl rand -base64 32
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# OpenAI API Key
# Get from: https://platform.openai.com/api-keys
OPENAI_API_KEY="sk-proj-..."

# Payment Gateways (Optional for now - use sandbox)
PADDLE_ENVIRONMENT="sandbox"
PADDLE_VENDOR_ID=""
PADDLE_API_KEY=""
PADDLE_PUBLIC_KEY=""
PADDLE_WEBHOOK_SECRET=""

SSLCOMMERZ_ENVIRONMENT="sandbox"
SSLCOMMERZ_STORE_ID=""
SSLCOMMERZ_STORE_PASSWORD=""

# App Config
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="AI Content OS"
```

## Step 5: Generate NextAuth Secret

### Windows PowerShell:
```powershell
# Generate random base64 string
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

### Or use online generator:
https://generate-secret.vercel.app/32

Copy the result to `NEXTAUTH_SECRET` in `.env.local`

## Step 6: Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy it (starts with `sk-proj-` or `sk-`)
4. Add to `.env.local`

## Step 7: Start the Development Server

```bash
npm run dev
```

Open http://localhost:3000

## ✅ What You Should See

1. **Landing Page** - Beautiful homepage with features
2. **Register** - Create your account
3. **Dashboard** - Access all modules

## 🎯 Test These Features First

1. ✅ Register/Login
2. ✅ Create a Brand in Brand Brain
3. ✅ Generate Content with AI Content Writer
4. ✅ Generate Hooks
5. ✅ View Script Library

## Common Issues

### "Can't connect to database"
- Check DATABASE_URL is correct
- Test connection: `npx prisma studio`
- Make sure database exists

### "OpenAI API error"
- Verify API key is correct
- Check you have credits: https://platform.openai.com/usage
- Make sure key starts with `sk-`

### "Invalid NEXTAUTH_SECRET"
- Generate new secret: `openssl rand -base64 32`
- Make sure it's at least 32 characters

### Port 3000 already in use
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
$env:PORT=3001; npm run dev
```

## Payment Setup (Optional - For Later)

You can skip payment configuration for now. The app will work without it for testing.

When ready:
1. **Paddle**: https://sandbox-vendors.paddle.com (sandbox)
2. **SSLCommerz**: Request sandbox account

## Need Help?

Check these files:
- `README.md` - Full documentation
- `SETUP_GUIDE.md` - Detailed setup
- `DEPLOYMENT.md` - Production deployment

## Quick Command Reference

```bash
# View database
npx prisma studio

# Reset database
npx prisma db push --force-reset

# Check if server is running
curl http://localhost:3000

# View logs
npm run dev
```

You're all set! Happy coding! 🚀
