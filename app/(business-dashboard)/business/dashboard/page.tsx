import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, Eye, ArrowRight, ShieldCheck, AlertTriangle, MoreVertical, CheckCircle2, ChevronDown, Sparkles
} from "lucide-react"; 
import Link from "next/link";
import { redirect } from "next/navigation";
import { VerifyDomainForm } from "@/components/business_auth/verify-domain-form"; 
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { differenceInCalendarDays, addDays } from "date-fns"; 

// ✅ Import BlockRating
import { BlockRating } from "@/components/shared/block-rating";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const dynamic = 'force-dynamic';
export const metadata = { title: "Dashboard - Business Center" };

function formatDate(date: Date | string) {
   return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// --- COMPONENTS ---
function StatItem({ label, value, subValue, badge, badgeColor, icon: Icon, showDivider = true, ratingValue }: any) {
  return (
    <div className={`flex-1 px-6 ${showDivider ? 'border-r border-gray-100 md:border-r' : ''}`}>
        <div className="flex justify-between items-start mb-2">
            {ratingValue !== undefined ? (
               <div className="-mt-1">
                 <BlockRating value={ratingValue} size="sm" />
               </div>
            ) : (
               <Icon className="w-5 h-5 text-gray-400" />
            )}

            {badge && (
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${badgeColor}`}>
                    {badge}
                </span>
            )}
        </div>
        <div>
            <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                {subValue && <span className="text-sm text-gray-400 font-medium">/ {subValue}</span>}
            </div>
            <p className="text-sm text-gray-500 mt-1 font-medium">{label}</p>
        </div>
    </div>
  );
}

function ProfileHealthItem({ label, subLabel, isCompleted }: any) {
    return (
        <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${isCompleted ? 'bg-emerald-50' : 'bg-gray-50'}`}>
                    <div className={`w-5 h-5 ${isCompleted ? 'text-emerald-500' : 'text-gray-400'}`}>
                        {isCompleted ? <ShieldCheck className="w-5 h-5" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
                    </div>
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-900">{label}</p>
                    <p className="text-xs text-gray-400">{subLabel}</p>
                </div>
            </div>
            {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
            ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
            )}
        </div>
    );
}

// --- MAIN PAGE ---

export default async function BusinessDashboardPage() {
  const session = await auth();
  if (!session?.user?.companyId) return redirect("/business/login");

  const company = await prisma.company.findUnique({
    where: { id: session.user.companyId },
    include: {
      _count: { select: { reviews: true } },
      reviews: {
         take: 5, 
         orderBy: { createdAt: 'desc' },
         include: { user: true }
      }
    }
  });

  if (!company) return <div className="p-8">Company profile not found.</div>;

  if (company.isFrozen) {
     return (
       <div className="h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center border border-red-100">
             <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
             <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Frozen</h1>
             <Button asChild className="w-full bg-[#000032] mt-4"><Link href="mailto:support@platform.com">Contact Support</Link></Button>
          </div>
       </div>
     );
  }

  // --- BADGE LOGIC ---
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const newReviewsCount = await prisma.review.count({
    where: { companyId: company.id, createdAt: { gte: startOfMonth } }
  });

  const pastReviewsStats = await prisma.review.aggregate({
    where: { companyId: company.id, createdAt: { lt: startOfMonth } },
    _avg: { starRating: true },
    _count: { starRating: true }
  });

  const currentRating = company.rating || 0;
  const pastRating = pastReviewsStats._avg.starRating || 0;
  const ratingDiff = (currentRating - pastRating).toFixed(1);
  const isPositive = (currentRating - pastRating) >= 0;
  
  const ratingBadgeText = pastReviewsStats._count.starRating > 0 ? `${isPositive ? '+' : ''}${ratingDiff}` : "+0.0";
  const ratingBadgeColor = isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600";

  // --- HEALTH LOGIC ---
  const isDomainVerified = !!company.domainVerified;
  const startDate = company.claimedAt || company.createdAt || new Date(); 
  const deadlineDate = addDays(new Date(startDate), 30);
  const daysRemaining = differenceInCalendarDays(deadlineDate, new Date());
  const isOverdue = daysRemaining < 0;
  const displayDays = isOverdue ? 0 : daysRemaining;

  const hasLogo = !!company.logoImage;
  const hasDescription = !!company.briefIntroduction;
  const hasWebsite = !!company.websiteUrl;
  const completionCriteria = [hasLogo, hasDescription, hasWebsite];
  const completedCount = completionCriteria.filter(Boolean).length;
  const completionScore = Math.round((completedCount / completionCriteria.length) * 100);

  // User Plan
  const currentPlan = company.plan || "FREE";

  return (
    <div className="min-h-screen p-6 lg:p-8 pb-20">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold text-[#111827]">Dashboard</h1>
                <p className="text-gray-500 mt-1">
                    Welcome back! Here's what's happening with <span className="text-emerald-500 font-medium">{company.name}</span> today.
                </p>
            </div>
            
            <div className="flex items-center gap-4 flex-wrap">
                 {/* ✅ GHOST PLAN BADGE */}
                 <div className="flex items-center gap-1.5 px-2 text-amber-500">
                     <Sparkles className="h-4 w-4 fill-amber-500/20" />
                     <span className="text-sm font-bold uppercase tracking-widest">{currentPlan}</span>
                 </div>

                 {/* ✅ EQUAL VERTICAL SEPARATOR 1 */}
                 <div className="h-6 w-px bg-gray-300" />

                 {/* ✅ GHOST PUBLIC VIEW BUTTON */}
                 <Link href={`/company/${company.slug}`} target="_blank">
                    <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 gap-2 rounded-full px-4">
                        <Eye className="w-4 h-4 text-gray-400" /> View Public Page
                    </Button>
                 </Link>
                 
                 {/* ✅ EQUAL VERTICAL SEPARATOR 2 */}
                 <div className="h-6 w-px bg-gray-300" />

                 {/* ✅ COMPANY LOGO (Restored Size) */}
                 <div className="flex items-center">
                     <Avatar className="h-12 w-[140px] bg-transparent rounded-none">
                        <AvatarImage src={company.logoImage || ''} className="object-contain" />
                        <AvatarFallback className="bg-gray-100 text-gray-600 font-bold rounded-md w-12 flex items-center justify-center">
                            {company.name?.[0]?.toUpperCase() || 'C'}
                        </AvatarFallback>
                     </Avatar>
                 </div>
            </div>
        </div>

        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            
            {/* LEFT COLUMN */}
            <div className="xl:col-span-2 space-y-8">
                
                {/* OVERVIEW CARD */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-gray-900">Overview</h2>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 md:gap-0">
                        <StatItem 
                            label="Trust Score Rating" 
                            value={(company.rating || 0).toFixed(1)} 
                            subValue="5.0"
                            badge={ratingBadgeText}
                            badgeColor={ratingBadgeColor}
                            ratingValue={company.rating || 0}
                        />

                        <StatItem 
                            label="Total Reviews" 
                            value={company._count.reviews} 
                            badge={`+${newReviewsCount} New`}
                            badgeColor="bg-emerald-50 text-emerald-600"
                            icon={MessageSquare}
                        />

                        <StatItem 
                            label="Profile Views" 
                            value={company.views || 0} 
                            icon={Eye}
                            showDivider={false} 
                        />
                    </div>
                </div>

                {/* REVIEWS TABLE */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-fit">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Recent Reviews</h2>
                        <Link href="/business/dashboard/reviews" className="text-sm font-bold text-emerald-500 hover:text-emerald-600 flex items-center gap-1">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full table-fixed min-w-[600px]">
                            <thead>
                                <tr className="border-b border-gray-100 text-left">
                                    <th className="py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-[40%]">Name</th>
                                    <th className="py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-[20%]">Ratings</th>
                                    <th className="py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-[15%]">Date</th>
                                    <th className="py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-[15%]">Title</th>
                                    <th className="py-4 w-[10%]"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {company.reviews.length > 0 ? company.reviews.map((review) => (
                                    <tr key={review.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="py-5 pr-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border border-gray-100 shrink-0">
                                                    <AvatarImage src={review.user.image || ''} />
                                                    <AvatarFallback className="bg-gray-100 text-gray-500 font-bold text-sm">
                                                        {review.user.name?.[0] || 'A'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="truncate">
                                                    <p className="font-bold text-gray-900 text-sm truncate">{review.user.name || "Anonymous"}</p>
                                                    <p className="text-[11px] text-gray-400 font-medium">Verified Reviewer</p>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        <td className="py-5">
                                            <BlockRating value={review.starRating} size="sm" />
                                        </td>
                                        
                                        <td className="py-5 text-sm font-bold text-gray-900">
                                            {formatDate(review.createdAt)}
                                        </td>
                                        <td className="py-5 text-sm font-bold text-gray-900 truncate pr-2">
                                            {review.reviewTitle || "Review"}
                                        </td>
                                        
                                        {/* ACTIONS MENU */}
                                        <td className="py-5 pl-2">
                                            <div className="flex justify-end">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button 
                                                            size="icon" 
                                                            variant="ghost" 
                                                            className="h-8 w-8 text-gray-400 hover:text-[#0ABED6] hover:bg-cyan-50 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-32 bg-white border border-gray-100 rounded-xl shadow-lg">
                                                        <DropdownMenuItem asChild className="focus:bg-gray-50 cursor-pointer rounded-lg m-1">
                                                            <Link href="/business/dashboard/reviews" className="w-full font-medium text-gray-700">
                                                                View
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild className="focus:bg-gray-50 cursor-pointer rounded-lg m-1">
                                                            <Link href="/business/dashboard/reviews" className="w-full font-medium text-[#0ABED6]">
                                                                Reply
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-gray-400 text-sm">
                                            No reviews yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-50 text-center">
                        <p className="text-sm text-gray-400">
                            Showing latest 5 reviews. <Link href="/business/dashboard/reviews" className="text-[#0ABED6] font-medium hover:underline transition-all">Visit Review Page</Link> for more.
                        </p>
                    </div>

                </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-fit space-y-8">
                
                {/* 1. Profile Health */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900 text-lg">Profile Health</h3>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                            {completionScore}%
                        </span>
                    </div>
                    <div className="space-y-1">
                        <ProfileHealthItem label="Upload Logo" subLabel="Brand Identity" isCompleted={hasLogo} />
                        <ProfileHealthItem label="Add Description" subLabel="Business Details" isCompleted={hasDescription} />
                        <ProfileHealthItem label="Link Website" subLabel="Online Presence" isCompleted={hasWebsite} />
                    </div>
                </div>

                {/* 2. Domain Verification */}
                {isDomainVerified ? (
                    <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 flex items-center gap-4">
                         <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
                            <ShieldCheck className="w-5 h-5" />
                         </div>
                         <div>
                            <h3 className="font-bold text-emerald-900 text-sm">Domain Verified</h3>
                            <p className="text-xs text-emerald-700/80 mt-0.5">{company.domainVerifyEmail}</p>
                         </div>
                    </div>
                ) : (
                    <div className={`rounded-2xl p-6 border ${isOverdue ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
                        <div className="flex items-center gap-3 mb-2">
                            <AlertTriangle className={`w-5 h-5 ${isOverdue ? 'text-red-500' : 'text-amber-500'}`} />
                            <h3 className={`font-bold text-sm ${isOverdue ? 'text-red-900' : 'text-amber-900'}`}>Verify Domain</h3>
                        </div>
                        <p className={`text-xs mb-4 ${isOverdue ? 'text-red-700' : 'text-amber-700'}`}>
                           {isOverdue ? "Action required immediately." : `Required in ${displayDays} days.`}
                        </p>
                        <VerifyDomainForm />
                    </div>
                )}

                {/* 3. Marketing Campaign */}
                <div className="bg-[#111827] rounded-2xl p-8 text-white text-center">
                    <h3 className="font-bold text-lg mb-2">Get More Reviews</h3>
                    <p className="text-gray-400 text-xs mb-6 leading-relaxed px-2">
                        Use our automated tools to invite your customer via emails. Launch a campaign today.
                    </p>
                    <Link href="/business/dashboard/marketing">
                        <Button className="w-full bg-white text-[#111827] hover:bg-gray-100 font-bold h-11 rounded-xl focus-visible:ring-0">
                            Launch Campaign
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}