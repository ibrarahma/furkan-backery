/**
 * Secure Bakery Admin Credential Setup Script
 * 
 * Usage:
 *   npx tsx scripts/setup-admin.ts <email> <password>
 * 
 * Example:
 *   npx tsx scripts/setup-admin.ts owner@sweetcrumbs.com StrongPassword123!
 */

import { saveFileCredentials } from '../server/auth';

const args = process.argv.slice(2);
const email = args[0] || process.env.ADMIN_EMAIL;
const password = args[1] || process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error('\n❌ Error: Missing credentials.');
  console.log('Usage: npx tsx scripts/setup-admin.ts <email> <password>');
  console.log('Or set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file.\n');
  process.exit(1);
}

if (password.length < 8) {
  console.error('\n❌ Error: Password must be at least 8 characters long for security.\n');
  process.exit(1);
}

const success = saveFileCredentials(email, password);

if (success) {
  console.log('\n✅ Success! Bakery administrator account created securely.');
  console.log(`   Admin Email: ${email}`);
  console.log('   Password: [SECURELY HASHED with crypto.scryptSync & unique cryptographic salt]');
  console.log('   You can now sign in at /admin with these credentials.\n');
  process.exit(0);
} else {
  console.error('\n❌ Error saving administrator credentials to server storage.\n');
  process.exit(1);
}
