import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from "date-fns";
import { BlockRating } from './block-rating';
import { TranslatableText } from "@/components/shared/translatable-text";
import { CheckCircle2, CalendarDays } from "lucide-react";

type ReviewCardProps = {
  userName: string;
  userInitials: string;
  userAvatarUrl?: string | null;
  rating: number;
  reviewText: string;
  companyLogoUrl: string | null;
  companyName: string;
  companyDomain: string;
  companySlug: string;
  dateOfExperience: Date;
  createdAt: Date;
  className?: string;
  textClassName?: string;
};

export function         ReviewCard({
  userName,
  userInitials,
  userAvatarUrl,
  rating,
  reviewText,
  companyLogoUrl,
  companyName,
  companyDomain,
  companySlug,
  dateOfExperience,
  createdAt,
  className,
  textClassName,
}: ReviewCardProps) {
  
  const createdDate = createdAt ? new Date(createdAt) : new Date();
  const displayDate = format(createdDate, "MMM d, yyyy");

  const experienceDate = dateOfExperience ? new Date(dateOfExperience) : new Date();
  const displayExpDate = format(experienceDate, "MMM d, yyyy");

  return (
    <Link 
      href={`/company/${companySlug}`} 
      className={cn("block h-full w-full max-w-[380px] mx-auto", className)}
    >
      <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm hover:shadow-1xl border 
      border-gray-100 hover:border-[#0892A5]/40 transition-all duration-300 group relative overflow-hidden 
      hover:-translate-y-1">

        {/* --- Decorative accent line --- */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0892A5] via-[#06B6D4] to-[#0892A5] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* --- Subtle background pattern --- */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute top-4 right-4 w-20 h-20 bg-[#0892A5]/5 rounded-full blur-2xl" />
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-[#06B6D4]/5 rounded-full blur-xl" />
        </div>

        {/* --- HEADER SECTION --- */}
        <div className="px-6 pt-6 pb-4">
            <div className="flex justify-between items-start gap-4">
                
                {/* Left: Name & Verification */}
                <div className="flex flex-col min-w-0">
                    <h3 className="font-semibold text-gray-900 text-base leading-tight truncate">
                        <TranslatableText text={userName} />
                    </h3>
                    
                    {/* Verified Badge */}
                    <div className="flex items-center gap-1.5 mt-2">
                         <CheckCircle2 className="w-4 h-4 text-[#0892A5]" />
                         <span className="text-xs font-medium text-[#0892A5] uppercase tracking-wide">
                            <TranslatableText text="Verified" />
                         </span>
                    </div>
                </div>

                {/* Right: Rating & Date */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                    <BlockRating value={rating} size="sm" />
                    <span className="text-xs text-gray-400 font-medium">
                        <TranslatableText text={displayDate} />
                    </span>
                </div>
            </div>
        </div>

        {/* --- BODY SECTION --- */}
        <div className="px-6 pb-4 flex-1 flex flex-col">
            
            {/* Review Text */}
            <div className={cn("text-gray-600 text-sm leading-relaxed min-h-[70px]", textClassName || "line-clamp-3")}>
                <TranslatableText text={reviewText} />
            </div>

            {/* Date of Experience */}
            <div className="mt-auto pt-4 flex items-center gap-2 opacity-75">
                 <CalendarDays className="w-4 h-4 text-gray-400" />
                 <span className="text-xs text-gray-500 font-medium">
                    <TranslatableText text="Experience date" />: <span className="text-gray-700"><TranslatableText text={displayExpDate} /></span>
                 </span>
            </div>
        </div>

        {/* --- FOOTER SECTION --- */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-t border-gray-100 px-6 py-4 flex items-center justify-between group-hover:from-[#0892A5]/5 group-hover:to-[#0892A5]/10 transition-colors duration-300">
             
             {/* Company Info */}
             <div className="flex items-center gap-3 overflow-hidden">
                <div className="h-12 w-14 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100">
                   {companyLogoUrl ? (
                      <div className="relative w-full h-full p-1.5">
                         <Image src={companyLogoUrl} alt={companyName} fill className="object-contain" />
                      </div>
                   ) : (
                      <span className="text-sm font-bold text-gray-400">{companyName?.[0]}</span>
                   )}
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-gray-900 text-sm truncate">
                        <TranslatableText text={companyName} />
                    </span>
                    <span className="text-xs text-gray-500 truncate">
                        {companyDomain}
                    </span>
                </div>
             </div>

             {/* Posted By Avatar */}
             <div className="flex items-center gap-2 pl-4 border-l border-gray-200 shrink-0">
                 <Avatar className="h-9 w-9 ring-2 ring-gray-100">
                    <AvatarImage src={userAvatarUrl || ''} />
                    <AvatarFallback className="text-xs bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 font-bold">
                        {userInitials}
                    </AvatarFallback>
                 </Avatar>
             </div>

        </div>

      </div>
    </Link>
  );
}