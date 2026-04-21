import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from "date-fns";
import { BlockRating } from '@/components/shared/block-rating'; // Adjusted import path based on context
import { TranslatableText } from "@/components/shared/translatable-text";
import { CheckCircle2, CalendarDays } from "lucide-react";

type HeroReviewCardProps = {
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
};

export function HeroReviewCard({
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
}: HeroReviewCardProps) {
  
  const createdDate = createdAt ? new Date(createdAt) : new Date();
  const displayDate = format(createdDate, "MMM d, yyyy");
  
  const experienceDate = dateOfExperience ? new Date(dateOfExperience) : new Date();
  const displayExpDate = format(experienceDate, "MMM d, yyyy");

  return (
    <Link 
      href={`/company/${companySlug}`}
      className={cn(
        "block h-full w-[300px]", // Kept fixed width for Hero context
        className
      )}
    >
      <div className="flex flex-col h-full bg-white rounded-none border border-gray-200 hover:border-[#0892A5]/50 hover:shadow-md transition-all duration-300 cursor-pointer">

        {/* --- HEADER SECTION --- */}
        <div className="px-5 pt-5 pb-3 border-b border-gray-50">
            <div className="flex justify-between items-start">
                
                {/* Left: Name & Verification */}
                <div className="flex flex-col">
                    <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-1">
                        <TranslatableText text={userName} />
                    </h3>
                    
                    {/* Verified Badge */}
                    <div className="flex items-center gap-1 mt-1">
                         <CheckCircle2 className="w-3 h-3 text-[#0892A5]" />
                         <span className="text-[10px] font-bold text-[#0892A5] uppercase tracking-wide">
                            <TranslatableText text="Verified" />
                         </span>
                    </div>
                </div>

                {/* Right: Rating & Date */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                    <BlockRating value={rating} size="sm" />
                    <span className="text-[10px] text-gray-400 font-medium">
                        <TranslatableText text={displayDate} />
                    </span>
                </div>
            </div>
        </div>

        {/* --- BODY SECTION --- */}
        <div className="px-5 py-4 flex-1 flex flex-col">
            
            {/* Review Text (Uniform Min-Height) */}
            <div className="text-gray-600 text-xs leading-relaxed min-h-[5rem] line-clamp-3">
                <TranslatableText text={reviewText} />
            </div>

            {/* Date of Experience */}
            <div className="mt-auto pt-4 flex items-center gap-1.5 opacity-80">
                 <CalendarDays className="w-3 h-3 text-gray-400" />
                 <span className="text-[10px] text-gray-500 font-medium">
                    <TranslatableText text="Experience date" />: <span className="text-gray-700"><TranslatableText text={displayExpDate} /></span>
                 </span>
            </div>
        </div>

        {/* --- FOOTER SECTION --- */}
        <div className="bg-gray-50 border-t border-gray-200 px-5 py-3 flex items-center justify-between">
             
             {/* Company Info */}
             <div className="flex items-center gap-3 overflow-hidden">
                <div className="h-10 w-12 rounded-none bg-white flex items-center justify-center shrink-0">
                   {companyLogoUrl ? (
                      <div className="relative w-full h-full p-0.5">
                         <Image src={companyLogoUrl} alt={companyName} fill className="object-contain" />
                      </div>
                   ) : (
                      <span className="text-xs font-bold text-gray-400">{companyName?.[0]}</span>
                   )}
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="font-bold text-gray-900 text-xs truncate">
                        <TranslatableText text={companyName} />
                    </span>
                    <span className="text-[9px] text-gray-500 truncate">
                        {companyDomain}
                    </span>
                </div>
             </div>

             {/* Posted By Avatar (Moved from top to footer) */}
             <div className="flex items-center gap-2 pl-4 border-l border-gray-200 shrink-0">
                 <Avatar className="h-8 w-8">
                    <AvatarImage src={userAvatarUrl || ''} />
                    <AvatarFallback className="text-[9px] bg-white text-gray-600 font-bold">
                        {userInitials}
                    </AvatarFallback>
                 </Avatar>
             </div>

        </div>

      </div>
    </Link>
  );
}