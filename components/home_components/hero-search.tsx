import { prisma } from "@/lib/prisma";
import { SearchBar } from '@/components/shared/search-bar'; 
import { TranslatableText } from "@/components/shared/translatable-text";
import { TestimonialsColumn } from "@/components/ui/testimonials-column";

interface HeroSearchProps {
  reviews: any[]; 
}

export async function HeroSearch({ reviews }: HeroSearchProps) {
  
  // 1. FETCH DATABASE LOCATIONS (Unchanged)
  const locationsData = await prisma.company.findMany({
    select: { city: true, state: true },
    distinct: ['city', 'state'], 
    where: {
      OR: [
        { city: { not: null } },
        { state: { not: null } }
      ]
    }
  });

  const availableLocations = Array.from(new Set(
    locationsData
      .map(l => {
        const parts = [l.city, l.state].filter(Boolean); 
        return parts.length > 0 ? parts.join(", ") : null;
      })
      .filter((l): l is string => !!l)
  )).sort();

  // 2. Prepare Reviews for Columns
  // ✅ UPDATE: Take the latest 5 reviews (assuming 'reviews' prop is already sorted by date)
  const safeReviews = reviews.length > 0 ? reviews.slice(0, 5) : [];
  
  // Split reviews into two columns
  // With 5 reviews: Col 1 gets 3 cards, Col 2 gets 2 cards.
  const midPoint = Math.ceil(safeReviews.length / 2);
  const column1 = safeReviews.slice(0, midPoint);
  const column2 = safeReviews.slice(midPoint);

  // Fallback: If very few reviews exist (e.g., only 1), duplicate them to ensure both columns have content
  const displayCol1 = column1.length > 0 ? column1 : safeReviews;
  const displayCol2 = column2.length > 0 ? column2 : safeReviews;

  return (
    <>
      <section className="relative bg-gray-100 py-20 sm:py-10 overflow-hidden">
        
        {/* Abstract shapes */}
        <div className="absolute top-40 left-50 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-accent/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-80 h-80 bg-accent/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-48 h-24 bg-accent/40 rounded-full blur-3xl pointer-events-none" style={{ transform: 'rotate(-20deg)' }} />
        <div className="absolute hidden sm:block top-25 right-40 w-40 h-32 bg-accent/40 rounded-full blur-3xl pointer-events-none" style={{ transform: 'rotate(10deg)' }} />

        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* --- Left Column (Text & Search) --- */}
            <div className="text-center lg:text-left z-10">
              <div className="mb-4">
                <TranslatableText 
                  text="Choose your next company with confidence." 
                  className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-tight block"
                />
              </div>

              <div className="mb-10">
                <TranslatableText 
                  text="Your platform for finding and sharing genuine customer experiences." 
                  className="text-lg md:text-xl text-muted-foreground block"
                />
              </div>

              <div className="relative">
                <SearchBar 
                   className='max-w-2xl lg:max-w-4xl' 
                   locations={availableLocations} 
                />
              </div>
            </div>

            {/* --- Right Column: Animated Columns (Now with 5 Reviews) --- */}
            <div className="relative h-162.5 hidden lg:flex gap-6 items-start overflow-hidden mask-[linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
                
                {/* Column 1 (3 Reviews) - Slower Speed */}
                <TestimonialsColumn 
                    reviews={displayCol1} 
                    duration={45} // Slightly slower to account for more content
                    className="flex-1"
                />

                {/* Column 2 (2 Reviews) - Faster Speed or Offset */}
                <TestimonialsColumn 
                    reviews={displayCol2} 
                    duration={35} 
                    className="flex-1 pt-12" 
                />
                
            </div>

          </div>
        </div>
      </section>

      {/* Bottom Bar */}
      <section className="mx-0 bg-accent py-4 sm:py-8 px-4 text-center">
        <p className="text-white">
          <TranslatableText text="Bought something recently?" />{' '}
          <a href="/write-review" className="text-primary hover:underline">
             <TranslatableText text="Write a review" /> &rarr;
          </a>
        </p>
      </section>
    </>
  );
}