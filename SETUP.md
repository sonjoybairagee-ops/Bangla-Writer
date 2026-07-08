# Bangla Creator - Setup Guide

Complete step-by-step guide to set up and run the application locally.

## Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **OpenAI API Key** - [Get it here](https://platform.openai.com/api-keys)
- **Database** - Already configured (Neon PostgreSQL)

## Quick Start (5 minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/sonjoybairagee-ops/Bangla-Writer.git
cd Bangla-Writer
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages (Next.js, React, Prisma, etc.)

### 3. Configure Environment Variables

The `.env` file is already configured with:
- ✅ Database connection (Neon PostgreSQL)
- ✅ NextAuth secret (authentication)
- ✅ App configuration

**You only need to add your OpenAI API Key:**

1. Open `.env` file
2. Find the line: `OPENAI_API_KEY="your-openai-api-key-here"`
3. Replace `your-openai-api-key-here` with your actual OpenAI API key

**How to get OpenAI API Key:**
- Visit: https://platform.openai.com/api-keys
- Sign up or log in
- Click "Create new secret key"
- Copy the key (starts with `sk-proj-...`)
- Paste it in `.env` file

**Complete `.env` should look like:**
```bash
DATABASE_URL="postgresql://neondb_owner:..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="Kxj9mP3nQ8rW5tYv2bN4cM7zL0sA6hD1fG8eR3jT5iU9oP2wX4qV6kB7yC0mL8nH"
OPENAI_API_KEY="sk-proj-abc123xyz..."  # Your actual key here
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Bangla Creator"
```

### 4. Set Up Database

```bash
npx prisma generate
npx prisma db push
```

This creates the database tables using the existing Neon PostgreSQL connection.

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

### 6. Create Admin Account

**Method 1: Using the make-admin script**
```bash
node scripts/make-admin.js your-email@gmail.com
```

**Method 2: Using the temporary API (in browser)**
After registering, visit:
```
http://localhost:3000/api/admin/make-admin?email=your-email@gmail.com
```

Replace `your-email@gmail.com` with the email you registered with.

## First Time Setup Checklist

- [ ] Clone repository
- [ ] Install dependencies (`npm install`)
- [ ] Add OpenAI API key to `.env`
- [ ] Run database migrations (`npx prisma generate && npx prisma db push`)
- [ ] Start dev server (`npm run dev`)
- [ ] Register a new account
- [ ] Make your account admin
- [ ] Test the application

## Features Overview

### For All Users:
1. **Content Writer** - AI-powered content generation (blogs, social media)
2. **Hook Generator** - Create viral hooks
3. **Brand Brain** - Manage brand voice and identity
4. **Content Planner** - Plan content calendar
5. **Creative Studio** - Generate creative ideas
6. **Library** - Save and organize content
7. **Analytics** - Track performance

### For Admins Only:
1. **User Management** - View and manage all users
2. **Analytics Dashboard** - Platform-wide statistics
3. **Plan Assignment** - Assign subscription plans to users
4. **Payment Management** - View payment history
5. **System Settings** - Configure platform settings

## Common Issues & Solutions

### Issue 1: "Failed to extract brand information from website"
**Cause**: OpenAI API key is missing or invalid
**Solution**: 
1. Add your OpenAI API key to `.env`
2. Make sure it starts with `sk-proj-` or `sk-`
3. Restart the dev server

### Issue 2: "Database connection error"
**Cause**: Database URL is incorrect
**Solution**: The database is already configured. If you still get errors:
1. Check if `DATABASE_URL` in `.env` is intact
2. Run `npx prisma generate`
3. Run `npx prisma db push`

### Issue 3: "Port 3000 is already in use"
**Solution**: 
```bash
# Stop other Node processes or use a different port
npm run dev -- -p 3001
```

### Issue 4: Can't access admin panel
**Cause**: Your account is not set as admin
**Solution**: Run the make-admin script:
```bash
node scripts/make-admin.js your-email@gmail.com
```

### Issue 5: "Module not found" errors
**Solution**: 
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

## Environment Variables Explained

| Variable | Purpose | Required | Example |
|----------|---------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ Yes | Already configured |
| `NEXTAUTH_URL` | App URL for authentication | ✅ Yes | http://localhost:3000 |
| `NEXTAUTH_SECRET` | Session encryption key | ✅ Yes | Already configured |
| `OPENAI_API_KEY` | OpenAI API access | ✅ Yes | sk-proj-abc123... |
| `NEXT_PUBLIC_APP_URL` | Public app URL | ✅ Yes | http://localhost:3000 |
| `NEXT_PUBLIC_APP_NAME` | App display name | ✅ Yes | Bangla Creator |

## Development Workflow

### Making Code Changes

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Edit files in `/app`, `/components`, `/lib`, etc.
   - The dev server auto-reloads on file changes

3. **Test your changes**
   - Check the app in browser
   - Test all affected features

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

5. **Push to GitHub**
   ```bash
   git push origin feature/your-feature-name
   ```

### Database Schema Changes

If you modify the Prisma schema:

```bash
# After editing schema.prisma
npx prisma generate        # Regenerate Prisma Client
npx prisma db push         # Push changes to database
npx prisma studio          # View database in browser
```

## Project Structure

```
ai-content-os/
├── app/                  # Next.js App Router
│   ├── (admin)/         # Admin panel pages
│   ├── (auth)/          # Auth pages (login, register)
│   ├── (dashboard)/     # User dashboard pages
│   ├── (landing)/       # Public landing pages
│   └── api/             # API routes
├── components/          # React components
│   ├── ui/             # UI components (buttons, cards, etc.)
│   └── dashboard/      # Dashboard-specific components
├── lib/                # Utilities and helpers
│   ├── ai/            # AI/OpenAI integration
│   ├── auth.ts        # NextAuth configuration
│   └── db.ts          # Prisma client
├── prisma/            # Database schema and migrations
├── public/            # Static files
├── scripts/           # Utility scripts (make-admin, etc.)
├── .env               # Environment variables (DO NOT COMMIT)
└── package.json       # Dependencies
```

## Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Check code quality |
| `npx prisma studio` | Open database GUI |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma db push` | Push schema to database |
| `node scripts/make-admin.js EMAIL` | Make user admin |

## Testing the Application

### Test User Features:
1. **Register**: http://localhost:3000/register
2. **Login**: http://localhost:3000/login
3. **Dashboard**: http://localhost:3000/dashboard
4. **Try Hook Generator**: Create some hooks
5. **Try Brand Brain**: Add a brand profile
6. **Check Library**: Save content to library

### Test Admin Features:
1. Make your account admin (see step 6 above)
2. Visit: http://localhost:3000/admin
3. Check user management
4. Check analytics
5. Assign plans to users

## Production Deployment

### Deploy to Vercel (Recommended)

1. **Push code to GitHub** (already done)

2. **Import to Vercel**
   - Go to https://vercel.com
   - Click "Import Project"
   - Select your GitHub repository

3. **Add Environment Variables in Vercel**
   - `DATABASE_URL` (copy from local `.env`)
   - `NEXTAUTH_URL` (your Vercel URL, e.g., https://bangla-writer.vercel.app)
   - `NEXTAUTH_SECRET` (copy from local `.env`)
   - `OPENAI_API_KEY` (your OpenAI key)
   - `NEXT_PUBLIC_APP_URL` (your Vercel URL)
   - `NEXT_PUBLIC_APP_NAME` (Bangla Creator)

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app is live!

5. **Set Up Database** (first time only)
   - In Vercel Dashboard → Settings → Environment Variables
   - Make sure `DATABASE_URL` is set
   - Run database migrations (automatically done on first deploy)

### Post-Deployment

1. **Create Admin Account**
   - Register at your live URL
   - Use the make-admin API: `https://your-app.vercel.app/api/admin/make-admin?email=your-email@gmail.com`

2. **Monitor Logs**
   - Vercel Dashboard → Deployments → View Logs
   - Check for any errors

3. **Test All Features**
   - Registration/Login
   - Content generation
   - Admin panel access

## Getting Help

### Resources
- **AI Setup Guide**: See `AI_SETUP.md`
- **Admin Setup**: See `ADMIN_SETUP.md`
- **Agents Documentation**: See `AGENTS.md`
- **GitHub Issues**: https://github.com/sonjoybairagee-ops/Bangla-Writer/issues

### Common Questions

**Q: Do I need to pay for OpenAI?**
A: Yes, OpenAI charges based on usage. You need to add a payment method. Most features cost $0.01-0.05 per request.

**Q: Can I use it without OpenAI?**
A: Some features work without AI (manual brand entry, library), but content generation requires OpenAI.

**Q: How much does it cost to run?**
A: 
- Database: Free (Neon PostgreSQL free tier)
- Hosting: Free (Vercel hobby plan)
- OpenAI: Pay-as-you-go (estimate $10-30/month for moderate use)

**Q: Is the code production-ready?**
A: The code is functional but consider adding:
- Rate limiting for API routes
- Better error handling
- Payment integration (SSLCommerz/Paddle)
- Email verification (currently disabled)
- More comprehensive tests

## Security Checklist

- [ ] Never commit `.env` file (already in `.gitignore`)
- [ ] Use strong `NEXTAUTH_SECRET` (already configured)
- [ ] Keep OpenAI API key secret
- [ ] Enable rate limiting in production
- [ ] Set up CORS properly for API routes
- [ ] Use environment variables for all secrets
- [ ] Regularly update dependencies (`npm audit`)

## Support

If you encounter issues:

1. Check this guide first
2. Review error messages carefully
3. Check console logs (browser DevTools)
4. Check server logs (terminal)
5. Review relevant documentation files
6. Create a GitHub issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Error messages/screenshots
   - Environment details

---

**Ready to start?** Follow the Quick Start section above! 🚀

**Current Status**: 
- ✅ Database configured
- ✅ Authentication working
- ✅ Basic features implemented
- ⏳ OpenAI API key needed (you need to add this)
- ⏳ Admin panel accessible after setup
