/**
 * Diagnostic Script - Check what's wrong
 * Run: node scripts/diagnose.js
 */

const https = require('https');

console.log('🔍 DIAGNOSTIC REPORT\n');
console.log('='.repeat(50));

// Check 1: Environment Variables (Local)
console.log('\n[1] Checking Local Environment Variables...');
const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'NEXT_PUBLIC_APP_URL',
];

requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  if (value) {
    console.log(`   ✅ ${envVar}: ${value.substring(0, 30)}...`);
  } else {
    console.log(`   ❌ ${envVar}: MISSING`);
  }
});

// Check 2: Production URL
console.log('\n[2] Checking Production URL...');
https.get('https://bangla-creator.vercel.app', (res) => {
  console.log(`   Status: ${res.statusCode}`);
  if (res.statusCode === 200) {
    console.log('   ✅ Homepage is accessible');
  } else {
    console.log('   ❌ Homepage returned error:', res.statusCode);
  }
}).on('error', (err) => {
  console.log('   ❌ Cannot reach production URL:', err.message);
});

// Check 3: Login page
console.log('\n[3] Checking Login Page...');
https.get('https://bangla-creator.vercel.app/login', (res) => {
  console.log(`   Status: ${res.statusCode}`);
  if (res.statusCode === 200) {
    console.log('   ✅ Login page is accessible');
  } else {
    console.log('   ❌ Login page returned error:', res.statusCode);
  }
}).on('error', (err) => {
  console.log('   ❌ Cannot reach login page:', err.message);
});

// Check 4: NextAuth API
console.log('\n[4] Checking NextAuth API...');
https.get('https://bangla-creator.vercel.app/api/auth/providers', (res) => {
  console.log(`   Status: ${res.statusCode}`);
  if (res.statusCode === 200) {
    console.log('   ✅ NextAuth API is working');
    
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const providers = JSON.parse(data);
        console.log('   Providers:', Object.keys(providers));
      } catch (e) {
        console.log('   Response:', data.substring(0, 100));
      }
    });
  } else {
    console.log('   ❌ NextAuth API error:', res.statusCode);
    console.log('   This means NEXTAUTH_URL or NEXTAUTH_SECRET is missing on Vercel!');
  }
}).on('error', (err) => {
  console.log('   ❌ Cannot reach NextAuth API:', err.message);
});

// Check 5: Database Connection (Local)
console.log('\n[5] Checking Database Connection...');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.$connect()
  .then(() => {
    console.log('   ✅ Database connection successful');
    return prisma.user.count();
  })
  .then(count => {
    console.log(`   ✅ Found ${count} users in database`);
    return prisma.user.findUnique({
      where: { email: 'sonjoybairagee@gmail.com' },
      select: { id: true, name: true, email: true, emailVerified: true }
    });
  })
  .then(user => {
    if (user) {
      console.log('   ✅ Your user exists:');
      console.log('      ID:', user.id);
      console.log('      Name:', user.name);
      console.log('      Email:', user.email);
      console.log('      Verified:', user.emailVerified ? 'Yes' : 'No');
    } else {
      console.log('   ❌ User not found: sonjoybairagee@gmail.com');
      console.log('   You need to register first!');
    }
  })
  .catch(err => {
    console.log('   ❌ Database error:', err.message);
  })
  .finally(() => {
    prisma.$disconnect();
  });

// Summary
setTimeout(() => {
  console.log('\n' + '='.repeat(50));
  console.log('DIAGNOSIS COMPLETE\n');
  console.log('📋 Action Items:');
  console.log('   1. If NextAuth API fails (404) → Set NEXTAUTH_URL on Vercel');
  console.log('   2. If database fails → Check DATABASE_URL');
  console.log('   3. If user not found → Register at /register');
  console.log('   4. If all pass but login fails → Clear browser cache');
  console.log('\n📄 See MANUAL_VERCEL_FIX.md for detailed steps');
}, 3000);
