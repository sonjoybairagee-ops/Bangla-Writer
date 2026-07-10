/**
 * Emergency Password Reset Script
 * Run: node scripts/reset-my-password.js
 * 
 * This will reset password for: sonjoybairagee@gmail.com
 * New password: dBsingsappa5924
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetPassword() {
  try {
    const email = 'sonjoybairagee@gmail.com';
    const newPassword = 'dBsingsappa5924';

    console.log('🔐 Resetting password...\n');
    console.log(`Email: ${email}`);
    console.log(`New Password: ${newPassword}`);
    console.log('');

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      console.log('❌ Error: User not found!');
      console.log(`   Email: ${email}`);
      console.log('\n📝 Please register first at:');
      console.log('   https://bangla-creator.vercel.app/register');
      process.exit(1);
    }

    console.log('✅ User found:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log('');

    // Hash new password
    console.log('🔒 Hashing new password...');
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    console.log('✅ Password hashed');
    console.log('');

    // Update password
    console.log('💾 Updating database...');
    await prisma.user.update({
      where: { email },
      data: { 
        password: hashedPassword,
        // Also ensure email is verified
        emailVerified: new Date()
      }
    });

    console.log('✅ Password updated successfully!');
    console.log('');
    console.log('='.repeat(50));
    console.log('SUCCESS! You can now login with:');
    console.log('='.repeat(50));
    console.log(`Email: ${email}`);
    console.log(`Password: ${newPassword}`);
    console.log('');
    console.log('🌐 Login at:');
    console.log('   Production: https://bangla-creator.vercel.app/login');
    console.log('   Local: http://localhost:3000/login');
    console.log('');
    console.log('💡 Tip: Copy-paste the password to avoid typos!');

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

resetPassword();
