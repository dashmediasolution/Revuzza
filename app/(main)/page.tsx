// app/page.tsx

import { HeroSearch } from '@/components/home_components/hero-search';
import { CategoriesCarousel } from '@/components/home_components/category-carousel'; // <-- Import the new carousel
import { TopRatedCarousel } from '@/components/home_components/top-rated-carousel';
import { InfoBanner } from '@/components/home_components/info-banner';
import { RecentReviews } from '@/components/home_components/recent-reviews';
import { BusinessCTA } from '@/components/home_components/business-cta';
import { getTopRatedCompanies, getRecentReviews } from '@/lib/data';

export default async function HomePage() {

  const topCompanies = await getTopRatedCompanies();
  // Fetch 10 reviews for the bottom carousel
  const recentReviews = await getRecentReviews(10);
  // Use the first 5 for the Hero section
  const heroReviews = recentReviews.slice(0, 5);

  return (
    <div className="w-full">
      <HeroSearch reviews={heroReviews} />
      <CategoriesCarousel />
      <InfoBanner/>
      <TopRatedCarousel companies={topCompanies} />
      <BusinessCTA/>
      <RecentReviews reviews={recentReviews}/>
    </div>
  );
}
