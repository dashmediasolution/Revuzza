'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Link from 'next/link';
import { CompanyTestimonialCard } from '@/components/shared/company-testimonial-card';
// ✅ Import the Translator Component
import { TranslatableText } from "@/components/shared/translatable-text";
import { CompanyCard } from '../shared/company-card';

interface TopRatedCarouselProps {
  companies: any[]; 
}

export function TopRatedCarousel({ companies }: TopRatedCarouselProps) {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto max-w-7xl px-4">
        <Carousel
          opts={{
            align: 'start',
            loop: false,
          }}
          className="w-full"
        >
          <div className="flex justify-between items-center mb-10">
            <div>
               <h2 className="text-2xl font-bold text-foreground tracking-tight">
                 <TranslatableText text="Top Rated Companies" />
               </h2>
            </div>
            
            <div className="flex items-center gap-2">
              <CarouselPrevious className="static translate-y-0 h-10 w-10 border-border hover:bg-gray-100 hover:text-accent-foreground" />
              <CarouselNext className="static translate-y-0 h-10 w-10 border-border hover:bg-gray-100 hover:text-accent-foreground" />
              <Link 
                href="/categories" 
                className="ml-4 text-sm font-medium text-primary hover:underline flex items-center"
              >
                <TranslatableText text="See all" />
              </Link>
            </div>
          </div>

          <CarouselContent className="-ml-4 pb-4">
            {companies.map((company) => (
              <CarouselItem key={company.id} className="pl-4 basis-1/1 md:basis-1/2 lg:basis-1/3 xl:basis-1/3">
                {/* All company data, including nested testimonials with user data, passed here 
                <CompanyTestimonialCard {...company} />*/}
                <CompanyCard {...company} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}