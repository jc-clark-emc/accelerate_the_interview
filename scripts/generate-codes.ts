// Script to generate activation codes
// Run with: npx ts-node scripts/generate-codes.ts

import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

type Tier = 'STARTER' | 'PRO' | 'PREMIUM';

function generateCode(tier: Tier): string {
  const prefix = 'IA';
  const tierCode = tier.charAt(0); // S, P, or P
  const random1 = crypto.randomBytes(2).toString('hex').toUpperCase();
  const random2 = crypto.randomBytes(3).toString('hex').toUpperCase();
  const random3 = crypto.randomBytes(3).toString('hex').toUpperCase();
  const random4 = crypto.randomBytes(3).toString('hex').toUpperCase();
  const random5 = crypto.randomBytes(2).toString('hex').toUpperCase();
  
  return `${prefix}-${tierCode}${random1}-${random2}-${random3}-${random4}-${random5}`;
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: npx ts-node scripts/generate-codes.ts <tier> <count>');
    console.log('Tiers: STARTER, PRO, PREMIUM');
    console.log('Example: npx ts-node scripts/generate-codes.ts STARTER 10');
    process.exit(1);
  }

  const tier = args[0].toUpperCase() as Tier;
  const count = parseInt(args[1], 10);

  if (!['STARTER', 'PRO', 'PREMIUM'].includes(tier)) {
    console.error('Invalid tier. Use STARTER, PRO, or PREMIUM');
    process.exit(1);
  }

  if (isNaN(count) || count < 1) {
    console.error('Count must be a positive number');
    process.exit(1);
  }

  console.log(`\nGenerating ${count} ${tier} activation codes...\n`);

  const codes: string[] = [];

  for (let i = 0; i < count; i++) {
    const code = generateCode(tier);
    
    await prisma.activationCode.create({
      data: {
        code,
        tier,
        isUsed: false,
      },
    });

    codes.push(code);
    console.log(`✓ ${code}`);
  }

  console.log(`\n✅ Successfully created ${count} ${tier} codes!\n`);
  console.log('Copy these codes to use in your Stan Store PDFs:\n');
  console.log(codes.join('\n'));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
