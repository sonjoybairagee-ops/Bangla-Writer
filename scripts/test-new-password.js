/**
 * Test New Password
 * Run: node scripts/test-new-password.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testPassword() {
  try {
    const email = 'sonjoybairagee@gmail.com';
    const password = 'sBairagee@5924';

    console.log('🔍 Testing login...\n');

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
      }
    });

    if (!user || !user.password) {
      console.log('❌ User not found or no password set');
      process.exit(1);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      console.log('✅ PASSWORD CORRECT!\n');
      console.log('='.repeat(50));
      console.log('Login Credentials:');
      console.log('='.repeat(50));
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
      console.log(`Role: ${user.role}`);
      console.log('');
      console.log('🎉 You can now login!');
    } else {
      console.log('❌ PASSWORD INCORRECT!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testPassword();
