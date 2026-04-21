"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ShieldCheck, Quote } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BADGE_CONFIG } from "@/lib/badges";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; 
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BlockRating } from "./block-rating";
import { TranslatableText } from "@/components/shared/translatable-text";

interface Testimonial {
  name: string;
  rating: number;
  quote: string;
  createdAt: Date;
  dateOfExperience: Date;
  userAvatarUrl?: string | null; 
  userInitials?: string;        
}

interface CompanyTestimonialCardProps {
  id: string;
  name: string;
  slug: string;
  logoImage?: string | null;
  websiteUrl?: string | null;
  rating: number;
  reviewCount: number;
  claimed: boolean; 
  badges: string[]; 
  testimonials: Testimonial[];
  className?: string;
}

export function CompanyTestimonialCard({
  slug,
  name,
  logoImage,
  rating,
  reviewCount,
  claimed, 
  badges,
  testimonials,
  className,
}: CompanyTestimonialCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => { setIsMounted(true); }, []);

  const hasTestimonials = testimonials && testimonials.length > 0;
  const currentTestimonial = hasTestimonials ? testimonials[currentIndex] : null;

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault(); 
    if(hasTestimonials) setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault(); 
    if(hasTestimonials) setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const formatDate = (date: Date) => {
    if (!isMounted) return ""; 
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const displayLimit = 3;

  return (
    <Link 
      href={`/company/${slug}`}
      className={cn("block w-full h-full", className)}
    >
      <div className="flex flex-col h-full bg-white rounded-none border border-gray-200 hover:border-[#0892A5]/50 transition-all duration-300 cursor-pointer overflow-hidden group">

        {/* --- 1. HEADER: Company Info --- */}
        <div className="px-5 pt-5 pb-4">
          <div className="flex justify-between items-start gap-3">
             <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-none bg-white flex items-center justify-center shrink-0">
                    {logoImage ? (
                        <div className="relative w-full h-full p-1">
                            <Image src={logoImage} alt={name} fill className="object-contain" />
                        </div>
                    ) : (
                        <span className="text-xs font-bold text-gray-400">{name[0]}</span>
                    )}
                </div>
                
                <div className="flex flex-col">
                    <h3 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-[#0892A5] transition-colors">
                        <TranslatableText text={name} />
                    </h3>
                    
                    {claimed && (
                        <div className="flex items-center gap-1 mt-1">
                            <ShieldCheck className="w-3 h-3 text-[#0892A5]" />
                            <span className="text-[10px] font-bold text-[#0892A5] uppercase tracking-wide">
                                <TranslatableText text="Verified Company" />
                            </span>
                        </div>
                    )}
                </div>
             </div>

             <div className="flex flex-col items-end gap-0.5">
                <BlockRating value={rating} size="sm" />
                <span className="text-[10px] text-gray-400 font-medium">
                   {reviewCount} <TranslatableText text="reviews" />
                </span>
             </div>
          </div>
        </div>

        {/* --- 2. BODY: Testimonial Section --- */}
        <div className="px-5 py-2 flex-1 flex flex-col">
           {hasTestimonials ? (
             <div className="flex flex-col h-full">
               
               {/* Accent Border Testimonial Container */}
               <div className="bg-gradient-to-br from-gray-50/50 to-white border border-gray-100 border-l-4 border-l-[#0ABED6] rounded-sm p-5 relative min-h-[130px] flex items-center">
                 <Quote className="absolute top-3 right-4 w-8 h-8 text-[#0ABED6]/60 rotate-180" />
                 
                 <AnimatePresence mode="wait">
                   <motion.div
                     key={currentIndex}
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     transition={{ duration: 0.2 }}
                     className="relative z-10 w-full"
                   >
                     <p className="text-gray-600 text-xs leading-relaxed line-clamp-4 italic pr-6">
                        "<TranslatableText text={currentTestimonial?.quote} />"
                     </p>
                   </motion.div>
                 </AnimatePresence>
               </div>

               {/* Author Info (with Avatar) & Nav Buttons */}
               <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={currentTestimonial?.userAvatarUrl || ''} alt={currentTestimonial?.name} />
                        <AvatarFallback className="text-[10px] bg-gray-100 text-gray-500 font-bold uppercase">
                            {currentTestimonial?.userInitials || currentTestimonial?.name?.[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col">
                          <span className="text-xs font-bold text-gray-900 leading-tight">
                             <TranslatableText text={currentTestimonial?.name} />
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium mt-0.5">
                             {currentTestimonial?.createdAt ? formatDate(currentTestimonial.createdAt) : ''}
                          </span>
                      </div>
                  </div>

                  {testimonials.length > 1 && (
                      <div className="flex gap-1.5">
                          <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 rounded-none border border-gray-100 bg-white hover:bg-gray-50 text-gray-400 transition-colors" 
                              onClick={(e) => { e.preventDefault(); handlePrev(e); }}
                          >
                              <ChevronLeft className="h-3 w-3" />
                          </Button>
                          <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 rounded-none border border-gray-100 bg-white hover:bg-gray-50 text-gray-400 transition-colors" 
                              onClick={(e) => { e.preventDefault(); handleNext(e); }}
                          >
                              <ChevronRight className="h-3 w-3" />
                          </Button>
                      </div>
                  )}
               </div>
             </div>
           ) : (
             <div className="flex-1 min-h-[180px] flex items-center justify-center text-gray-400 text-xs italic bg-gray-50/30 rounded-none border border-dashed border-gray-200">
                <TranslatableText text="No featured reviews yet." />
             </div>
           )}
        </div>

        {/* --- 3. FOOTER: Badges --- */}
        {/* --- 3. FOOTER: Badges --- */}
<div className="bg-gray-50 border-t border-gray-100 px-5 py-4 min-h-[72px] flex items-center">
    <div className="flex flex-wrap gap-2 w-full">
       {badges && badges.length > 0 ? (
          <>
            {badges.slice(0, displayLimit).map((badgeId) => {
              const config = BADGE_CONFIG[badgeId];
              if (!config) return null;
              const Icon = config.icon;
              
              return (
                <TooltipProvider key={badgeId} delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className={cn(
                          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-[9px] font-bold uppercase tracking-wider border cursor-help select-none bg-white transition-all duration-200 hover:shadow-sm",
                          config.border,
                          config.color
                        )}
                      >
                        <Icon className="h-3 w-3 opacity-70" />
                        <span className="line-clamp-1">
                            <TranslatableText text={config.label} />
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-900 text-white border-gray-800 text-xs px-3 py-2 rounded-none">
                      <TranslatableText text={config.description} />
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </>
       ) : (
          <span className="text-[10px] text-gray-400 font-medium italic">
             <TranslatableText text="Standard Business Listing" />
          </span>
       )}
    </div>
</div>

      </div>
    </Link>
  );
}