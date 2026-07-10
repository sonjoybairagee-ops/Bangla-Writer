/**
 * Quick script to verify user exists in database
 * Run: node scripts/verify-user.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyUser() {
  try {
    console.log('🔍 Checking user in database...\n');

    const email = 'sonjoybairagee@gmail.com';
    
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        createdAt: true,
        password: true,
        role: true,
        subscriptions: {
          select: {
            planId: true,
            status: true,
            currentPeriodEnd: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!user) {
      console.log('❌ User NOT found!');
      console.log(`   Email: ${email}`);
      console.log('\n📝 Action required:');
      console.log('   1. Register a new account');
      console.log('   2. Or check if email is correct');
      process.exit(1);
    }

    console.log('✅ User found!');
    console.log('─'.repeat(50));
    console.log(`📧 Email: ${user.email}`);
    console.log(`👤 Name: ${user.name}`);
    console.log(`🆔 ID: ${user.id}`);
    console.log(`👑 Role: ${user.role || 'user'}`);
    console.log(`✉️  Email Verified: ${user.emailVerified ? '✅ Yes' : '❌ No'}`);
    console.log(`🔐 Has Password: ${user.password ? '✅ Yes' : '❌ No'}`);
    console.log(`📅 Created: ${user.createdAt.toLocaleString()}`);
    
    if (user.subscriptions.length > 0) {
      const sub = user.subscriptions[0];
      console.log(`\n📦 Subscription:`);
      console.log(`   Plan: ${sub.planId}`);
      console.log(`   Status: ${sub.status}`);
      console.log(`   Expires: ${sub.currentPeriodEnd.toLocaleString()}`);
    }

    console.log('\n✅ This user should be able to login!');
    console.log('─'.repeat(50));
    console.log('\n🌐 Try logging in at:');
    console.log('   Local: http://localhost:3000/login');
    console.log('   Production: https://bangla-creator.vercel.app/login');
    console.log('\n📝 Credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: [your password]`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'P1001') {
      console.log('\n⚠️  Database connection failed!');
      console.log('   Check your DATABASE_URL in .env file');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyUser();
