# Bangla Creator 🚀

A complete content operating system for Bangla creators. Create, plan, and manage all your content with advanced AI that learns your brand.

## ✨ Features

- **🧠 Brand Brain**: AI learns your brand voice, tone, and style
- **✍️ AI Content Writer**: Generate content with 7+ proven frameworks (AIDA, PAS, BAB, etc.)
- **⚡ Hook Generator**: Create scroll-stopping hooks using psychological triggers
- **🎬 OVC Director**: Complete video shoot breakdowns with professional details
- **📅 Content Planner**: 30-day content strategies generated in minutes
- **📚 Script Library**: Save, organize, and manage all generated content
- **💳 Dual Payment System**: Paddle (International) + SSLCommerz (Bangladesh)
- **🔐 Authentication**: Email/Password + Google OAuth

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js
- **AI**: OpenAI GPT-4
- **Payments**: Paddle + SSLCommerz
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- OpenAI API key
- Paddle account (for international payments)
- SSLCommerz account (for Bangladesh payments)

### Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd ai-content-os
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ai_content_os"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"

# OpenAI
OPENAI_API_KEY="sk-..."

# Paddle
PADDLE_VENDOR_ID="your_vendor_id"
PADDLE_API_KEY="your_api_key"
PADDLE_PUBLIC_KEY="your_public_key"
PADDLE_WEBHOOK_SECRET="your_webhook_secret"

# SSLCommerz
SSLCOMMERZ_STORE_ID="your_store_id"
SSLCOMMERZ_STORE_PASSWORD="your_password"
```

4. **Setup database**
```bash
npx prisma generate
npx prisma db push
```

5. **Seed pricing plans (optional)**
```bash
npx prisma db seed
```

6. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Add environment variables
   - Deploy

3. **Setup Database**
   - Use [Supabase](https://supabase.com) or [Neon](https://neon.tech) for PostgreSQL
   - Update `DATABASE_URL` in Vercel environment variables

4. **Configure Webhooks**
   - Paddle webhook: `https://your-domain.com/api/payment/paddle/webhook`
   - SSLCommerz success: `https://your-domain.com/api/payment/sslcommerz/success`
   - SSLCommerz fail: `https://your-domain.com/api/payment/sslcommerz/fail`
   - SSLCommerz cancel: `https://your-domain.com/api/payment/sslcommerz/cancel`

### Environment Variables for Production

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="<strong-secret>"
OPENAI_API_KEY="sk-..."
PADDLE_ENVIRONMENT="production"
SSLCOMMERZ_ENVIRONMENT="live"
```

## 📖 API Documentation

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out

### Brands

- `GET /api/brands` - Get all brands
- `POST /api/brands` - Create brand
- `GET /api/brands/[id]` - Get brand
- `PATCH /api/brands/[id]` - Update brand
- `DELETE /api/brands/[id]` - Delete brand
- `POST /api/brands/extract` - Extract brand info from document

### Content Generation

- `POST /api/generate/content` - Generate content with frameworks
- `POST /api/generate/hooks` - Generate hooks
- `POST /api/generate/ovc` - Generate OVC breakdown
- `POST /api/generate/plan` - Generate content plan

### Scripts

- `GET /api/scripts` - Get all scripts
- `POST /api/scripts` - Create script
- `GET /api/scripts/[id]` - Get script
- `PATCH /api/scripts/[id]` - Update script
- `DELETE /api/scripts/[id]` - Delete script

### Payments

- `POST /api/checkout` - Create checkout session
- `POST /api/payment/paddle/webhook` - Paddle webhook
- `POST /api/payment/sslcommerz/success` - Payment success
- `POST /api/payment/sslcommerz/fail` - Payment failed
- `POST /api/payment/sslcommerz/cancel` - Payment cancelled

### Usage

- `GET /api/usage` - Get current usage and limits

## 🏗️ Project Structure

```
ai-content-os/
├── app/
│   ├── (auth)/              # Authentication pages
│   ├── (dashboard)/         # Dashboard pages
│   ├── api/                 # API routes
│   └── page.tsx             # Landing page
├── components/
│   ├── dashboard/           # Dashboard components
│   └── ui/                  # UI components
├── lib/
│   ├── ai/                  # AI utilities
│   │   └── prompts/         # AI prompts
│   ├── constants/           # Constants
│   ├── parsers/             # Document parsers
│   └── payments/            # Payment integrations
├── prisma/
│   └── schema.prisma        # Database schema
└── public/                  # Static files
```

## 🎯 Features Roadmap

- [ ] Framework Brain (upload custom frameworks)
- [ ] Team collaboration
- [ ] API access
- [ ] White-label option
- [ ] Content calendar view
- [ ] Analytics dashboard
- [ ] Repurpose AI (convert content between platforms)
- [ ] Competitor analyzer
- [ ] Viral score predictor
- [ ] Chrome extension

## 🔒 Security

- All passwords hashed with bcrypt
- JWT-based authentication
- Webhook signature verification
- Input validation with Zod
- SQL injection protection via Prisma
- CSRF protection via NextAuth

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines.

## 💬 Support

For support, email support@aicontentos.com or join our Discord community.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- AI powered by [OpenAI](https://openai.com/)
"# Bangla-Writer" 
