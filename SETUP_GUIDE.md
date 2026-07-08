# Quick Setup Guide 🚀

Follow these steps to get AI Content OS running locally in under 10 minutes.

## Step 1: Install Dependencies (2 min)

```bash
cd ai-content-os
npm install
```

## Step 2: Setup Environment Variables (3 min)

Copy the environment file:
```bash
cp .env.example .env.local
```

### Minimum Required Variables

Open `.env.local` and add:

```env
# 1. Database (Get from Supabase/Neon)
DATABASE_URL="postgresql://user:password@host:5432/database"

# 2. NextAuth Secret (Generate one)
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# 3. OpenAI API Key
OPENAI_API_KEY="sk-your-key-here"

# 4. Payment Gateways (Can use sandbox/test mode)
PADDLE_ENVIRONMENT="sandbox"
SSLCOMMERZ_ENVIRONMENT="sandbox"

# 5. App Config
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### How to Get Keys

**Database (Choose one):**

**Option A: Supabase** (Recommended - Free tier available)
1. Go to https://supabase.com
2. Create new project
3. Copy connection string from Project Settings → Database
4. Use direct connection (not pooler)

**Option B: Neon** (Alternative)
1. Go to https://neon.tech
2. Create new project
3. Copy connection string

**OpenAI:**
1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy it (starts with sk-)

**Generate NextAuth Secret:**
```bash
openssl rand -base64 32
```

## Step 3: Setup Database (2 min)

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Open Prisma Studio to verify (optional)
npx prisma studio
```

## Step 4: Start Development Server (1 min)

```bash
npm run dev
```

Open http://localhost:3000

## Step 5: Create Your First Account (1 min)

1. Click "Get Started" or go to `/register`
2. Enter your name, email, and password
3. You're in! 🎉

## What to Try First

1. **Dashboard** - See your usage overview
2. **Brand Brain** - Create your first brand profile
3. **Content Writer** - Generate content with AIDA framework
4. **Hook Generator** - Create 10 viral hooks
5. **Content Planner** - Generate a 7-day content plan

## Common Issues

### "Can't connect to database"
- Check DATABASE_URL format
- Ensure database server is running
- Try connection in Prisma Studio: `npx prisma studio`

### "OpenAI API error"
- Verify API key is correct
- Check you have credits in OpenAI account
- Test key at https://platform.openai.com/playground

### "Next Auth error"
- Ensure NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your dev server

### Port already in use
```bash
# Use different port
PORT=3001 npm run dev
```

## Payment Testing (Optional)

### Paddle Sandbox
1. Sign up at https://sandbox-vendors.paddle.com
2. Get test credentials
3. Use test card: 4242 4242 4242 4242

### SSLCommerz Sandbox
1. Request sandbox account from SSLCommerz
2. Get test credentials
3. Use provided test cards

## Next Steps

- ✅ Read [README.md](./README.md) for full features
- ✅ Check [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup
- ✅ Explore the dashboard and try all features
- ✅ Configure payment gateways for real transactions
- ✅ Deploy to Vercel

## Need Help?

- **Documentation**: Check README.md and DEPLOYMENT.md
- **Issues**: Create a GitHub issue
- **Email**: support@aicontentos.com

## Development Tips

### Database Management
```bash
# View data
npx prisma studio

# Reset database
npx prisma db push --force-reset

# Create migration
npx prisma migrate dev --name your_migration_name
```

### Useful Commands
```bash
# Check TypeScript errors
npm run build

# Run linter
npm run lint

# Format code
npx prettier --write .
```

### VS Code Extensions (Recommended)
- Prisma (Prisma.prisma)
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- GitLens

## Project Structure Quick Reference

```
app/
├── (auth)/                 # Login, Register pages
├── (dashboard)/            # All dashboard pages
│   └── dashboard/
│       ├── page.tsx        # Main dashboard
│       ├── brand-brain/    # Brand management
│       ├── content-writer/ # AI content generator
│       ├── hooks/          # Hook generator
│       ├── ovc-director/   # Video director
│       ├── content-planner/# Content planning
│       ├── library/        # Script library
│       └── billing/        # Subscription
├── api/                    # All API routes
│   ├── auth/              # Authentication
│   ├── brands/            # Brand CRUD
│   ├── generate/          # AI generation
│   ├── payment/           # Payment webhooks
│   └── scripts/           # Script CRUD
└── page.tsx               # Landing page

lib/
├── ai/                    # AI utilities & prompts
├── payments/              # Payment integrations
├── parsers/               # Document parsers
└── constants/             # App constants

prisma/
└── schema.prisma          # Database schema
```

Happy building! 🚀
