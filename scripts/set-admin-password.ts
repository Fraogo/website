import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

/**
 * Set / reset the admin password directly in the database.
 *
 *   npx tsx scripts/set-admin-password.ts "YourNewPassword"
 *
 * The hash is stored in the Setting table (key = admin_password_hash), which the
 * login flow reads BEFORE the env fallback. Because local and Vercel share the
 * same Supabase database, this fixes login on every environment at once.
 */
const prisma = new PrismaClient()

async function main() {
  const password = process.argv[2]
  if (!password) {
    console.log('\nUsage: npx tsx scripts/set-admin-password.ts "<your-new-password>"\n')
    process.exit(1)
  }
  if (password.length < 8) {
    console.log('\n⚠️  Use at least 8 characters.\n')
    process.exit(1)
  }

  const hash = await bcrypt.hash(password, 10)
  await prisma.setting.upsert({
    where:  { key: 'admin_password_hash' },
    update: { value: hash },
    create: { key: 'admin_password_hash', value: hash },
  })

  console.log('\n✅ Admin password saved to the database.')
  console.log('   Sign in at /admin/login with the email in ADMIN_LOGIN_EMAIL and this password.')
  console.log('   It works locally now; on Vercel once the latest code is deployed.\n')
}

main()
  .catch((e) => { console.error('Failed:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
