import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Database Seeding...');

  const demoEmail = 'admin@example.com';
  const plainPassword = 'Password123!';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {},
    create: {
      email: demoEmail,
      name: 'Production Admin',
      passwordHash: hashedPassword,
    },
  });

  console.log('✅ Seed complete! Demo account created/verified:');
  console.log(`   📧 Email:    ${user.email}`);
  console.log(`   🔑 Password: ${plainPassword}`);
  console.log(`   🆔 User ID:  ${user.id}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
