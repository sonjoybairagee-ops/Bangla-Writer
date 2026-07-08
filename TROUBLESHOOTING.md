# Troubleshooting Guide 🔧

## Hydration Error Fix

যদি browser এ "Hydration Error" দেখেন, তাহলে:

### Fix করা হয়েছে:
✅ `next.config.ts` updated করা হয়েছে React strict mode disable করার জন্য

### এখন করুন:

1. **Terminal এ Ctrl+C চাপুন** (development server বন্ধ করতে)

2. **Server আবার start করুন:**
```bash
npm run dev
```

3. **Browser refresh করুন:** `Ctrl+Shift+R` (hard refresh)

4. **যদি still error আসে, cache clear করুন:**
```bash
# Terminal এ:
rm -rf .next
npm run dev
```

Windows এ:
```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

---

## অন্যান্য Common Issues:

### Port Already in Use
```bash
# Process kill করুন
netstat -ano | findstr :3000
taskkill /PID <process_id> /F

# অথবা different port use করুন
$env:PORT=3001; npm run dev
```

### Database Connection Error
- `.env.local` এ `DATABASE_URL` check করুন
- Neon dashboard এ database running আছে কিনা check করুন
- `npx prisma studio` run করে connection test করুন

### OpenAI API Error
- API key valid আছে কিনা check করুন
- OpenAI dashboard এ credits আছে কিনা check করুন
- Key সঠিকভাবে `.env.local` এ set করা আছে কিনা check করুন

### "Module not found" Error
```bash
# Dependencies reinstall করুন
rm -rf node_modules package-lock.json
npm install
npx prisma generate
npm run dev
```

### Prisma Client Error
```bash
# Prisma client regenerate করুন
npx prisma generate
npm run dev
```

---

## Quick Fixes Checklist:

- [ ] `.env.local` এ সব required variables আছে
- [ ] Database connection working
- [ ] `npx prisma generate` run করা হয়েছে
- [ ] `npm run dev` চলছে
- [ ] Browser cache clear করা হয়েছে
- [ ] Latest code pull করা হয়েছে

---

## এখনও কাজ না করলে:

1. **Full cleanup:**
```bash
# সব delete করুন
rm -rf .next node_modules

# Fresh install
npm install
npx prisma generate
npm run dev
```

2. **Check logs:**
- Terminal এ কি error দেখাচ্ছে?
- Browser console এ কি error আছে? (F12 চাপুন)

3. **Version check:**
```bash
node --version  # Should be 18+
npm --version
```

---

## Need More Help?

- Check `SETUP_GUIDE.md` for complete setup
- Check `README.md` for documentation
- Create GitHub issue with error details

সমস্যা সমাধান না হলে screenshot সহ বলবেন! 🚀
