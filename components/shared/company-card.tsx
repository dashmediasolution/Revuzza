"use client";

import * as React from "react";
import { ShieldCheck, ArrowRight, Globe, Users, BarChart3 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { BADGE_CONFIG } from "@/lib/badges";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BlockRating } from "./block-rating";
import { TranslatableText } from "@/components/shared/translatable-text";

interface CompanyCardProps {
  name: string;
  slug: string;
  logoImage?: string | null;
  websiteUrl?: string | null;
  rating: number;
  reviewCount: number;
  claimed: boolean; 
  badges: string[]; 
  className?: string;
}

export function CompanyCard({
  slug,
  name,
  logoImage,
  websiteUrl,
  rating,
  reviewCount,
  claimed, 
  badges,
  className,
}: CompanyCardProps) {

  const displayLimit = 3;

  return (
    <Link 
      href={`/company/${slug}`}
      className={cn("block h-full w-full max-w-[380px] mx-auto", className)}
    >
      <div className="flex flex-col h-full bg-white rounded-none border border-gray-200 hover:border-[#0892A5]/50 transition-all duration-300 cursor-pointer overflow-hidden group">

        {/* --- 1. HEADER SECTION --- */}
        <div className="p-5 pb-2">
            <div className="flex items-start gap-3">
                {/* Logo Box */}
                <div className="h-16 w-16 rounded-none bg-white flex items-center justify-center shrink-0">
                    {logoImage ? (
                        <div className="relative w-full h-full p-1">
                            <Image src={logoImage} alt={name} fill className="object-contain" />
                        </div>
                    ) : (
                        <span className="text-sm font-bold text-gray-400 uppercase">{name[0]}</span>
                    )}
                </div>

                {/* Info Stack */}
                <div className="flex flex-col pt-0.5">
                    <h3 className="font-bold text-gray-900 text-md leading-tight group-hover:text-[#0892A5] transition-colors">
                        <TranslatableText text={name} />
                    </h3>
                    
                    {claimed && (
                        <div className="flex items-center gap-1 mt-1">
                            <ShieldCheck className="w-3 h-3 text-[#0892A5]" />
                            <span className="text-[9px] font-bold text-[#0892A5] uppercase tracking-widest leading-none">
                                <TranslatableText text="Verified Business" />
                            </span>
                        </div>
                    )}

                    <div className="flex items-center gap-1 mt-1 text-gray-400">
                        <Globe className="w-2.5 h-2.5" />
                        <span className="text-[10px] truncate max-w-[120px]">
                            {websiteUrl || `${slug}.com`}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* --- 2. STATS DASHBOARD (Replacing middle text) --- */}
        <div className="px-5 py-4 flex-1">
            <div className="bg-gray-50/50 border border-gray-100 rounded-none p-4 grid grid-cols-2 gap-0 relative">
                {/* Vertical Divider */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-px bg-gray-200" />

                {/* Score Column */}
                <div className="flex flex-col items-center">
                    <div className="flex items-baseline gap-0.5">
                        <span className="text-xl font-black text-gray-900 tracking-tighter">{rating.toFixed(1)}</span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase">/ 5</span>
                    </div>
                    <div className="mt-1">
                        <BlockRating value={rating} size="sm" />
                    </div>
                </div>

                {/* Volume Column */}
                <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center gap-1.5">
                        <Users className="w-5 h-5 text-gray-400" />
                        <span className="text-2xl font-bold text-gray-900 tracking-tight">{reviewCount.toLocaleString()}</span>
                    </div>
                    <span className="text-[12px] font-black text-gray-400 uppercase mt-1 tracking-widest">
                        <TranslatableText text="Reviews" />
                    </span>
                </div>
            </div>
        </div>

        {/* --- 3. FOOTER: Technical Badges --- */}
        <div className="bg-gray-50 border-t border-gray-100 px-5 py-4 min-h-[72px] flex items-center justify-between">
            <div className="flex flex-wrap gap-2 flex-1">
               {badges && badges.length > 0 ? (
                  badges.slice(0, displayLimit).map((badgeId) => {
                    const config = BADGE_CONFIG[badgeId];
                    if (!config) return null;
                    const Icon = config.icon;
                    
                    return (
                      <TooltipProvider key={badgeId} delayDuration={300}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className={cn(
                                "flex items-center gap-1.5 px-2 py-1 rounded-none text-[9px] font-bold uppercase tracking-wider border bg-white transition-all",
                                config.border,
                                config.color
                              )}>
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
                  })
               ) : (
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest italic">
                     <TranslatableText text="Base Listing" />
                  </span>
               )}
            </div>

            <div className="pl-3 border-l border-gray-200 shrink-0">
                <div className="h-7 w-7 rounded-none border border-gray-100 bg-white flex items-center justify-center text-gray-400 group-hover:text-[#0892A5] group-hover:border-[#0892A5]/30 transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                </div>
            </div>
        </div>

      </div>
    </Link>
  );
}