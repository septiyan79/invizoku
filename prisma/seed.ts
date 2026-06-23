import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Admin user
  const adminPassword = await bcrypt.hash('Admin@Invizoku123!', 12)
  await prisma.user.upsert({
    where: { email: 'admin@invizoku.com' },
    update: {},
    create: {
      email: 'admin@invizoku.com',
      name: 'Admin Invizoku',
      phone_wa: '08123456789',
      password: adminPassword,
      role: 'admin',
      email_verified: true,
    },
  })

  // Starter themes
  const themes = [
    {
      name: 'Wedding Elegant',
      category: 'wedding',
      type: 'standard' as const,
      component_key: 'WeddingElegant',
      is_active: true,
    },
    {
      name: 'Wedding Minimalist',
      category: 'wedding',
      type: 'standard' as const,
      component_key: 'WeddingMinimalist',
      is_active: true,
    },
    {
      name: 'Wedding Rustic',
      category: 'wedding',
      type: 'standard' as const,
      component_key: 'WeddingRustic',
      is_active: false,
    },
    {
      name: 'Birthday Fun',
      category: 'birthday',
      type: 'standard' as const,
      component_key: 'BirthdayFun',
      is_active: true,
    },
    {
      name: 'Aqiqah Sakura',
      category: 'aqiqah',
      type: 'standard' as const,
      component_key: 'AqiqahSakura',
      is_active: false,
    },
    {
      name: 'Wedding Anime',
      category: 'wedding',
      type: 'exclusive' as const,
      component_key: 'WeddingAnime',
      is_active: false,
    },
  ]

  for (const theme of themes) {
    await prisma.theme.upsert({
      where: { component_key: theme.component_key },
      update: {},
      create: theme,
    })
  }

  console.log('Seed selesai.')
  console.log('Admin: admin@invizoku.com / Admin@Invizoku123!')
  console.log('WAJIB ganti password admin setelah login pertama!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
