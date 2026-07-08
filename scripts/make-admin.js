/**
 * Script to make a user admin
 * Usage: node scripts/make-admin.js your@email.com
 */

const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide an email address');
  console.log('Usage: node scripts/make-admin.js your@email.com');
  process.exit(1);
}

const SECRET = 'bangla-creator-admin-2026';
const API_URL = 'http://localhost:3000/api/admin/make-admin';

fetch(API_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email,
    secret: SECRET,
  }),
})
  .then((res) => res.json())
  .then((data) => {
    if (data.success) {
      console.log('✅', data.message);
      console.log('🔄 Please logout and login again to see Admin Panel');
    } else {
      console.error('❌ Error:', data.error);
    }
  })
  .catch((err) => {
    console.error('❌ Failed to make admin:', err.message);
    console.log('\n💡 Make sure the dev server is running (npm run dev)');
  });
