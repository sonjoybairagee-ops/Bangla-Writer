/**
 * Delete Inactive User (No plan)
 * Run: node scripts/delete-inactive-user.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteInactiveUser() {
  try {
    console.log('🔍 Finding inactive user...\n');

    // Find user with no subscription (inactive)
    const users = await prisma.user.findMany({
      include: {
        subscriptions: true,
        usage: true,
        brands: true,
        scripts: true,
        payments: true,
        flaggedSignups: true,
      }
    });

    console.log(`Found ${users.length} users:\n`);

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Subscriptions: ${user.subscriptions.length}`);
      console.log(`   Status: ${user.subscriptions.length > 0 ? 'Active ✅' : 'Inactive ❌'}`);
      console.log('');
    });

    // Find inactive user (no subscription or subscription = 0)
    const inactiveUser = users.find(u => u.subscriptions.length === 0);

    if (!inactiveUser) {
      console.log('✅ No inactive users found. All users have subscriptions.');
      return;
    }

    console.log('❌ Found inactive user to delete:');
    console.log(`   Email: ${inactiveUser.email}`);
    console.log(`   Name: ${inactiveUser.name}`);
    console.log(`   ID: ${inactiveUser.id}`);
    console.log('');

    console.log('🗑️  Deleting user and all related data...');

    // Delete related data first (to avoid foreign key constraints)
    await prisma.flaggedSignup.deleteMany({ where: { userId: inactiveUser.id } });
    await prisma.script.deleteMany({ where: { userId: inactiveUser.id } });
    await prisma.brand.deleteMany({ where: { userId: inactiveUser.id } });
    await prisma.payment.deleteMany({ where: { userId: inactiveUser.id } });
    await prisma.usage.deleteMany({ where: { userId: inactiveUser.id } });

    // Delete the user
    await prisma.user.delete({
      where: { id: inactiveUser.id }
    });

    console.log('✅ Inactive user deleted!\n');

    // Show remaining active user
    const activeUser = users.find(u => u.subscriptions.length > 0);
    
    console.log('='.repeat(50));
    console.log('Your Active Account:');
    console.log('='.repeat(50));
    console.log(`Email: ${activeUser.email}`);
    console.log(`Name: ${activeUser.name}`);
    console.log(`Password: sBairagee@5924`);
    console.log(`Role: ${activeUser.role}`);
    console.log(`Plan: ${activeUser.subscriptions[0]?.planId}`);
    console.log(`Status: Active ✅`);
    console.log('');
    console.log('✨ You can now login with this account only!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

deleteInactiveUser();
