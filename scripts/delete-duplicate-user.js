/**
 * Delete Duplicate User
 * Run: node scripts/delete-duplicate-user.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteDuplicateUser() {
  try {
    console.log('🔍 Finding duplicate users...\n');

    // Find all users with similar email
    const users = await prisma.user.findMany({
      where: {
        email: {
          contains: 'sonjoy',
        },
      },
      include: {
        subscriptions: true,
        usage: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    console.log(`Found ${users.length} users:\n`);

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Status: ${user.subscriptions.length > 0 ? 'Active' : 'Inactive'}`);
      console.log(`   Plan: ${user.subscriptions[0]?.planId || 'No plan'}`);
      console.log(`   Created: ${user.createdAt.toLocaleString()}`);
      console.log('');
    });

    // Find the inactive one (no subscription)
    const inactiveUser = users.find(u => u.subscriptions.length === 0);
    const activeUser = users.find(u => u.subscriptions.length > 0);

    if (!inactiveUser) {
      console.log('✅ No duplicate user found. All users have subscriptions.');
      return;
    }

    console.log('❌ Duplicate user found:');
    console.log(`   Email: ${inactiveUser.email}`);
    console.log(`   ID: ${inactiveUser.id}`);
    console.log('');

    console.log('⚠️  Deleting duplicate user...');
    
    // Delete related records first
    await prisma.usage.deleteMany({
      where: { userId: inactiveUser.id },
    });

    // Delete the user
    await prisma.user.delete({
      where: { id: inactiveUser.id },
    });

    console.log('✅ Duplicate user deleted!\n');

    console.log('='.repeat(50));
    console.log('Your active account:');
    console.log('='.repeat(50));
    console.log(`Email: ${activeUser.email}`);
    console.log(`Password: dBsingsappa5924`);
    console.log(`Plan: ${activeUser.subscriptions[0]?.planId}`);
    console.log(`Status: Active`);
    console.log('');
    console.log('✅ You can now login with this account!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

deleteDuplicateUser();
