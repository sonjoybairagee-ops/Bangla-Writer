# Admin Panel Setup Guide

## How to Make a User Admin

### Method 1: Using the Script (Recommended)

1. Make sure your dev server is running:
```bash
npm run dev
```

2. In a new terminal, run:
```bash
node scripts/make-admin.js your@email.com
```

3. Logout and login again to see the Admin Panel link

### Method 2: Using API Directly

Send a POST request to `/api/admin/make-admin`:

```bash
curl -X POST http://localhost:3000/api/admin/make-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your@email.com",
    "secret": "bangla-creator-admin-2026"
  }'
```

### Method 3: Direct Database Update

Using Prisma Studio:
```bash
npx prisma studio
```

Or using SQL:
```sql
UPDATE "User" SET role = 'admin' WHERE email = 'your@email.com';
```

## Security Notes

⚠️ **IMPORTANT**: After setting up your first admin user:

1. Delete the API route: `app/api/admin/make-admin/route.ts`
2. Delete the script: `scripts/make-admin.js`
3. Delete this file: `ADMIN_SETUP.md`

Or at minimum, change the `ADMIN_SETUP_SECRET` in your `.env` file to something secure.

## Admin Panel Features

Once you're an admin, you'll see:

- **Admin Panel** button in dashboard header
- **Admin badge** next to your name
- Access to `/admin` routes:
  - `/admin` - Admin Dashboard
  - `/admin/users` - User Management (assign plans, make admin)
  - `/admin/payments` - Payment Tracking
  - `/admin/analytics` - Revenue & User Analytics
  - `/admin/settings` - Platform Settings

## Role-Based Access Control

The admin panel is protected by:

1. **Layout Middleware** (`app/(admin)/layout.tsx`):
   - Checks if user is authenticated
   - Verifies user has `role: 'admin'`
   - Redirects non-admin users to dashboard

2. **Session Role** (`lib/auth.ts`):
   - User role is added to JWT token
   - Available in session as `session.user.role`

3. **Admin Utilities** (`lib/admin.ts`):
   - `isAdmin()` - Check if current user is admin
   - `requireAdmin()` - Throw error if not admin

## Removing Admin Access

To remove admin access from a user:

```sql
UPDATE "User" SET role = 'user' WHERE email = 'user@email.com';
```

Or create a similar script for removing admin role.
