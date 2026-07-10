/**
 * Create Admin User - Fresh account in new database
 * Run: node scripts/create-admin-user.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('👤 Creating admin user in new database...\n');

    const userData = {
      name: 'Sonjoy Bairagee',
      email: 'sonjoybairagee@gmail.com',
      password: 'dBsingsappa5924',
      role: 'admin',
    };

    console.log('User data:');
    console.log(`  Name: ${userData.name}`);
    console.log(`  Email: ${userData.email}`);
    console.log(`  Password: ${userData.password}`);
    console.log(`  Role: ${userData.role}`);
    console.log('');

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existing) {
      console.log('⚠️  User already exists!');
      console.log('   Use reset-my-password.js to change password');
      process.exit(0);
    }

    // Hash password
    console.log('🔒 Hashing password...');
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    console.log('✅ Password hashed');

    // Generate unique referral code
    const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    console.log(`🎫 Referral code: ${referralCode}`);
    console.log('');

    // Create user
    console.log('💾 Creating user in database...');
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        emailVerified: new Date(),
        role: userData.role,
        referralCode: referralCode,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        referralCode: true,
        emailVerified: true,
        createdAt: true,
      }
    });

    console.log('✅ User created!');
    console.log('');

    // Create initial usage record
    console.log('📊 Creating usage record...');
    const now = new Date();
    await prisma.usage.create({
      data: {
        userId: user.id,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      },
    });
    console.log('✅ Usage record created');
    console.log('');

    // Create free trial subscription (7 days)
    console.log('📦 Creating free trial subscription...');
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7);

    await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: 'free',
        status: 'active',
        currentPeriodStart: now,
        currentPeriodEnd: trialEndDate,
        paymentGateway: 'free-trial', // Free trial doesn't have payment gateway
      },
    });
    console.log('✅ Subscription created (7-day free trial)');
    console.log('');

    console.log('='.repeat(50));
    console.log('🎉 SUCCESS! Admin user created!');
    console.log('='.repeat(50));
    console.log('');
    console.log('User Details:');
    console.log(`  ID: ${user.id}`);
    console.log(`  Name: ${user.name}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Role: ${user.role}`);
    console.log(`  Referral Code: ${user.referralCode}`);
    console.log(`  Email Verified: ${user.emailVerified ? 'Yes' : 'No'}`);
    console.log(`  Created: ${user.createdAt.toLocaleString()}`);
    console.log('');
    console.log('Login Credentials:');
    console.log(`  Email: ${userData.email}`);
    console.log(`  Password: ${userData.password}`);
    console.log('');
    console.log('🌐 You can now login at:');
    console.log('   Local: http://localhost:3000/login');
    console.log('   Production: https://bangla-creator.vercel.app/login');
    console.log('');
    console.log('⚠️  IMPORTANT: Update Vercel environment variables!');
    console.log('   DATABASE_URL = [new database URL]');
    console.log('   Then redeploy on Vercel');

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'P2002') {
      console.log('\n⚠️  User with this email already exists!');
      console.log('   Try logging in or use reset-my-password.js');
    } else if (error.code === 'P1001') {
      console.log('\n⚠️  Database connection failed!');
      console.log('   Check your DATABASE_URL in .env file');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
