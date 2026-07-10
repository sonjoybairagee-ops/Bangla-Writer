/**
 * Update Admin Password
 * Run: node scripts/update-admin-password.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function updatePassword() {
  try {
    const email = 'sonjoybairagee@gmail.com';
    const newPassword = 'sBairagee@5924';

    console.log('🔐 Updating admin password...\n');
    console.log(`Email: ${email}`);
    console.log(`New Password: ${newPassword}`);
    console.log('');

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, role: true }
    });

    if (!user) {
      console.log('❌ User not found!');
      process.exit(1);
    }

    console.log('✅ User found:');
    console.log(`   Name: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log('');

    // Hash new password
    console.log('🔒 Hashing password...');
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    console.log('✅ Password hashed');
    console.log('');

    // Update password
    console.log('💾 Updating database...');
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });

    console.log('✅ Password updated successfully!');
    console.log('');
    console.log('='.repeat(50));
    console.log('New Login Credentials:');
    console.log('='.repeat(50));
    console.log(`Email: ${email}`);
    console.log(`Password: ${newPassword}`);
    console.log('');
    console.log('🌐 Login at:');
    console.log('   Local: http://localhost:3000/login');
    console.log('   Production: https://bangla-creator.vercel.app/login');
    console.log('');
    console.log('✨ You can now login with your new password!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updatePassword();
