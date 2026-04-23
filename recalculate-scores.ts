// scripts/recalculate-scores.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Starting full score recalculation...");

  const companies = await prisma.company.findMany({
    include: { reviews: { select: { starRating: true } } }
  });

  const C = 3.5; // Global Average
  const m = 7;   // Confidence Weight

  for (const company of companies) {
    const N = company.reviews.length;
    let newRating = 0;

    if (N > 0) {
      const sumR = company.reviews.reduce((acc: number, r: any) => acc + r.starRating, 0);
      newRating = ((C * m) + sumR) / (m + N);
    }

    await prisma.company.update({
      where: { id: company.id },
      data: { 
        rating: newRating,
        reviewCount: N
      }
    });
    
    console.log(`✅ Updated ${company.name}: ${N} reviews -> Score: ${newRating.toFixed(2)}`);
  }

  console.log("🚀 All companies updated!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());