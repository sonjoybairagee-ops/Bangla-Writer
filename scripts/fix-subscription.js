/**
 * Fix missing subscription
 * Run: node scripts/fix-subscription.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixSubscription() {
  try {
    const email = 'sonjoybairagee@gmail.com';

    console.log('🔍 Checking user...\n');

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        subscriptions: true,
        usage: true,
      }
    });

    if (!user) {
      console.log('❌ User not found!');
      process.exit(1);
    }

    console.log('✅ User found:', user.email);
    console.log(`   Subscriptions: ${user.subscriptions.length}`);
    console.log(`   Usage records: ${user.usage.length}`);
    console.log('');

    // Create subscription if missing
    if (user.subscriptions.length === 0) {
      console.log('📦 Creating free trial subscription...');
      const now = new Date();
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 7);

      await prisma.subscription.create({
        data: {
          userId: user.id,
          planId: 'free',
          status: 'active',
          currentPeriodStart: now,
          currentPeriodEnd: trialEndDate,
          paymentGateway: 'free-trial',
          amount: 0, // Free trial = 0 BDT
          currency: 'BDT',
        },
      });

      console.log('✅ Subscription created!');
    } else {
      console.log('✅ Subscription already exists');
    }

    // Create usage record if missing
    if (user.usage.length === 0) {
      console.log('📊 Creating usage record...');
      const now = new Date();
      await prisma.usage.create({
        data: {
          userId: user.id,
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        },
      });
      console.log('✅ Usage record created!');
    } else {
      console.log('✅ Usage record already exists');
    }

    console.log('\n✅ All done! Account is ready to use.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

fixSubscription();
