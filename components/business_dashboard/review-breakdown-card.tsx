"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Star, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewBreakdownCardProps {
  ratingCounts: Record<number, number>;
  totalReviews: number;
  averageRating: number;
}

export function ReviewBreakdownCard({ 
  ratingCounts, 
  totalReviews, 
  averageRating 
}: ReviewBreakdownCardProps) {
    
  const searchParams = useSearchParams();
  const activeRating = searchParams.get("rating");

  return (
    <div className="bg-white p-6 max-w-sm mx-auto">
       
       {/* 1. Header: Golden Star + Average Rating */}
       <div className="flex items-center gap-3 mb-2">
          <Star className="h-8 w-8 p-1 rounded-sm fill-white text-white bg-[#0892A5]" />
          <span className="text-3xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
       </div>

       {/* 2. Heading: "All reviews" + Clear Filter */}
       <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-gray-900 text-lg">All reviews</h3>
          {/* Show Clear Filter if rating param exists */}
          {activeRating && (
            <Link
              href={`/business/dashboard/reviews`} // Reset link
              scroll={false}
              className="text-xs font-medium text-[#0ABED6] hover:text-[#0ABED6]/80 hover:underline flex items-center gap-1 transition-colors"
            >
              <X className="h-3 w-3" /> Clear filter
            </Link>
          )}
       </div>

       {/* 3. Sub-line: Total Count */}
       <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <span>{totalReviews.toLocaleString()} total</span>
       </div>

       {/* 4. Star Rating Bars (Interactive) */}
       <div className="space-y-3">
         {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingCounts[star] || 0;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            const isActive = activeRating === star.toString();

            // Construct URL params for filtering
            const newParams = new URLSearchParams(searchParams.toString());
            
            // Toggle logic: If active, remove rating. If inactive, set rating.
            if (isActive) {
                newParams.delete("rating");
            } else {
                newParams.set("rating", star.toString());
            }

            // Always reset page to 1 when filtering
            newParams.delete("page");

            return (
               <Link 
                  key={star} 
                  href={`/business/dashboard/reviews?${newParams.toString()}`} 
                  scroll={false}
               >
                  <div className={cn(
                      "flex items-center gap-3 p-1.5 -mx-2 rounded-lg transition-all group cursor-pointer",
                      isActive ? "bg-slate-100" : "hover:bg-gray-50"
                  )}>
                      {/* Label */}
                      <span className={cn(
                          "w-12 shrink-0 text-sm",
                          isActive ? "font-bold text-gray-900" : "font-medium text-gray-700"
                      )}>
                          {star}-star
                      </span>

                      {/* Progress Bar */}
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                         <div
                            className={cn(
                                "h-full rounded-full transition-all duration-500 ease-out", 
                                isActive ? "bg-[#0ABED6]" : "bg-[#0892A5]"
                            )}
                            style={{ width: `${percentage}%` }}
                         />
                      </div>

                      {/* Percentage */}
                      <div className={cn(
                          "w-10 text-right text-xs tabular-nums group-hover:text-gray-900",
                          isActive ? "font-bold text-gray-900" : "font-medium text-gray-500"
                      )}>
                         {count > 0 ? `${Math.round(percentage)}%` : "0%"}
                      </div>
                  </div>
               </Link>
            )
         })}
       </div>
    </div>
  );
}