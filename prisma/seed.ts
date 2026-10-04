import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Database Seeding for Rafsan Agro...');

  // Seed Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'mdrasedmorol@gmail.com' },
    update: {
      password: 'Rashed123@',
    },
    create: {
      id: 'admin-usr-01',
      name: 'Rashed Morol',
      email: 'mdrasedmorol@gmail.com',
      password: 'Rashed123@',
      role: 'SUPER_ADMIN',
    },
  });
  console.log('✅ Admin User created/updated (Mdrasedmorol@gmail.com).');

  // Seed Default Categories
  const catRice = await prisma.category.upsert({
    where: { slug: 'seeds' },
    update: {},
    create: {
      id: 'cat-seeds',
      nameEn: 'Seeds & Grain',
      nameBn: 'বীজ ও দানা',
      slug: 'seeds',
      description: 'High-quality hybrid seeds for agricultural farming',
      icon: '🌱',
    },
  });

  const catFertilizer = await prisma.category.upsert({
    where: { slug: 'fertilizers' },
    update: {},
    create: {
      id: 'cat-fertilizers',
      nameEn: 'Fertilizers & Soil',
      nameBn: 'সার ও মাটি',
      slug: 'fertilizers',
      description: 'Organic & mineral fertilizers for soil nutrition',
      icon: '🧪',
    },
  });

  console.log('✅ Categories created.');

  // Seed Finance Transactions
  const seedTransactions = [
    {
      id: 'txn-seed-1',
      type: 'INCOME' as const,
      category: 'SALE',
      amount: 45000,
      description: 'Bulk Seed Order Payment - Order #RA-88301',
      reference: 'RA-88301',
      date: new Date('2026-09-01'),
    },
    {
      id: 'txn-seed-2',
      type: 'EXPENSE' as const,
      category: 'PURCHASE',
      amount: 18500,
      description: 'Fertilizer Wholesale Shipment Invoice #SUP-492',
      reference: 'INV-SUP-492',
      date: new Date('2026-09-05'),
    },
    {
      id: 'txn-seed-3',
      type: 'INCOME' as const,
      category: 'SALE',
      amount: 32000,
      description: 'Storefront Direct Sales Revenue',
      reference: 'RA-88302',
      date: new Date('2026-09-10'),
    },
    {
      id: 'txn-seed-4',
      type: 'EXPENSE' as const,
      category: 'RENT',
      amount: 12000,
      description: 'Monthly Storefront Lease & Warehouse Space',
      reference: 'LEASE-SEP2026',
      date: new Date('2026-09-12'),
    },
    {
      id: 'txn-seed-5',
      type: 'EXPENSE' as const,
      category: 'SALARY',
      amount: 15000,
      description: 'Staff Payroll Disbursement',
      reference: 'PAYROLL-09',
      date: new Date('2026-09-15'),
    },
  ];

  for (const txn of seedTransactions) {
    await prisma.transaction.upsert({
      where: { id: txn.id },
      update: {},
      create: txn,
    });
  }

  console.log('✅ Financial Transactions database table seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
