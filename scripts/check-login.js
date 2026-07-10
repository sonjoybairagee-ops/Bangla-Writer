/**
 * Check Login - Test if credentials work
 * Run: node scripts/check-login.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkLogin() {
  try {
    const email = 'sonjoybairagee@gmail.com';
    const passwordToTest = 'dBsingsappa5924';

    console.log('🔍 Checking login credentials...\n');

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      console.log('❌ USER NOT FOUND');
      console.log(`   Email: ${email}`);
      console.log('\n📝 Action: Register at /register');
      process.exit(1);
    }

    console.log('✅ User exists in database');
    console.log('─'.repeat(50));
    console.log(`ID: ${user.id}`);
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Email Verified: ${user.emailVerified ? '✅ Yes' : '❌ No'}`);
    console.log(`Has Password: ${user.password ? '✅ Yes' : '❌ No'}`);
    console.log(`Created: ${user.createdAt.toLocaleString()}`);
    console.log(`Updated: ${user.updatedAt.toLocaleString()}`);

    if (!user.password) {
      console.log('\n❌ NO PASSWORD SET');
      console.log('   This account might have been created with Google OAuth');
      console.log('   or password was not set properly');
      console.log('\n📝 Action: Run reset-my-password.js');
      process.exit(1);
    }

    // Test password
    console.log('\n🔐 Testing password...');
    console.log(`   Password to test: ${passwordToTest}`);
    
    const isMatch = await bcrypt.compare(passwordToTest, user.password);

    if (isMatch) {
      console.log('\n✅ PASSWORD MATCHES!');
      console.log('─'.repeat(50));
      console.log('Your credentials are correct:');
      console.log(`   Email: ${email}`);
      console.log(`   Password: ${passwordToTest}`);
      console.log('\n🎉 You should be able to login!');
      console.log('\nIf login still fails on production:');
      console.log('   1. Clear browser cache');
      console.log('   2. Try incognito mode');
      console.log('   3. Check Vercel environment variables');
      console.log('   4. Run: scripts\\fix-login-now.bat');
    } else {
      console.log('\n❌ PASSWORD DOES NOT MATCH');
      console.log('─'.repeat(50));
      console.log('Your password in database is different!');
      console.log('\n📝 Options:');
      console.log('   1. Try different password');
      console.log('   2. Run: node scripts/reset-my-password.js');
      console.log('   3. Use "Forgot Password" on login page');
      console.log('\n💡 Did you change password recently?');
      console.log('   Maybe the old password is still in database');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    if (error.code === 'P1001') {
      console.log('\n⚠️  Database connection failed!');
      console.log('   Check your DATABASE_URL in .env file');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkLogin();
