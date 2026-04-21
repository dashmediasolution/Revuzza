import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AddBusinessUpdateModal } from "@/components/business_dashboard/add-business-update-modal";
import { EditBusinessUpdateModal } from "@/components/business_dashboard/edit-business-update-modal";
import { DeleteUpdateButton } from "@/components/business_dashboard/delete-update-modal";
import { FeaturePaywall } from "@/components/business_dashboard/feature-paywall";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, startOfMonth, endOfMonth } from "date-fns"; 
import { ExternalLink, Newspaper, Globe, Sparkles, Rss, Calendar } from "lucide-react";
import { getCompanyFeatures } from "@/lib/plan-config";
import { Button } from "@/components/ui/button";
import { UpdatesSearch } from "@/components/business_dashboard/update-search";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function BusinessUpdatesPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  // 1. FIND COMPANY
  const claim = await prisma.businessClaim.findFirst({
    where: { userId: session.user.id },
    include: { company: true }
  });

  if (!claim || !claim.company) return <div className="p-6">No Company Found</div>;

  const { id: companyId, name: companyName, logoImage: companyLogo } = claim.company;
  const plan = claim.company.plan || "FREE"; 

  // 2. PARSE SEARCH PARAMS
  const params = await searchParams;
  const query = params.q || "";

  // 3. GET FEATURES & LIMITS
  const features = getCompanyFeatures(claim.company);
  const monthlyLimit = features.updateLimit;

  // 4. CALCULATE USAGE
  const now = new Date();
  const currentMonthName = format(now, "MMMM");
  
  const usageCount = await prisma.businessUpdate.count({
    where: {
      companyId: companyId,
      createdAt: { gte: startOfMonth(now), lte: endOfMonth(now) }
    }
  });
  const isLimitReached = monthlyLimit !== Infinity && usageCount >= monthlyLimit;

  // 5. FETCH DATA
  const updates = await prisma.businessUpdate.findMany({
    where: { 
        companyId: companyId,
        title: { contains: query, mode: "insensitive" }
    },
    orderBy: { createdAt: "desc" }, 
  });

  const latestForPills = await prisma.businessUpdate.findMany({
    where: { companyId: companyId },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { title: true }
  });
  const latestTitles = latestForPills.map(u => u.title);

  const featuredUpdate = query ? null : updates[0]; 
  const otherUpdates = query ? updates : updates.slice(1);

  if (monthlyLimit === 0) {
    return (
      <div className="space-y-6 p-6">
        <div className="border-b border-gray-200 pb-4"><h1 className="text-3xl font-bold">Business Articles</h1></div>
        <FeaturePaywall title="Publish Company News" description="Boost SEO with articles." features={[]} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-8 pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-8">
        <div>
           <h1 className="text-3xl font-bold text-[#000032]">Business Articles</h1>
           <p className="text-gray-500 mt-1">
             {currentMonthName} Usage: <span className={isLimitReached ? "text-red-600 font-bold" : "font-medium"}>{usageCount} / {monthlyLimit === Infinity ? "∞" : monthlyLimit}</span>
           </p>
        </div>
        <div className="shrink-0 flex flex-wrap items-center gap-3">
           
           {/* ✅ GHOST PLAN BADGE */}
           <div className="flex items-center gap-1.5 px-2 text-amber-500">
               <Sparkles className="h-4 w-4 fill-amber-500/20" />
               <span className="text-sm font-bold uppercase tracking-widest">{plan}</span>
           </div>

           {/* ✅ VERTICAL SEPARATOR */}
           <div className="h-6 w-px bg-gray-300 mx-1" />
           
           <AddBusinessUpdateModal companyId={companyId} isLimitReached={isLimitReached} />
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-start">
         
         {/* LEFT COLUMN */}
         <div className="flex-1 w-full space-y-8">
            
            {/* SEARCH COMPONENT */}
            <UpdatesSearch latestTitles={latestTitles} />

            {/* FEATURED CARD */}
            {featuredUpdate && (
               <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col-reverse md:flex-row gap-8 items-center md:items-start relative overflow-hidden group">
                  <div className="flex-1 space-y-4 relative z-10 w-full">
                     <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Most Recent</span>
                        <span className="text-xs text-gray-400 font-medium">{format(new Date(featuredUpdate.createdAt), "MMM d, yyyy")}</span>
                     </div>
                     <h2 className="text-2xl font-bold text-[#000032] leading-tight">{featuredUpdate.title}</h2>
                     <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{featuredUpdate.content}</p>
                     <div className="flex items-center gap-3 pt-4">
                        {featuredUpdate.linkUrl && (
                           <a href={featuredUpdate.linkUrl} target="_blank" rel="noreferrer">
                              <Button variant="outline" size="sm" className="rounded-full border-[#0ABED6] text-[#0ABED6] hover:bg-cyan-50 h-9 px-5 gap-2 font-bold text-xs">
                                 Visit <ExternalLink className="h-3 w-3" />
                              </Button>
                           </a>
                        )}
                        <div className="flex items-center gap-1 border-l border-gray-200 pl-3">
                           <div className="scale-90 flex gap-1">
                              <EditBusinessUpdateModal companyId={companyId} update={featuredUpdate} />
                              <DeleteUpdateButton updateId={featuredUpdate.id} companyId={companyId} />
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="w-full md:w-[350px] aspect-[16/10] rounded-2xl overflow-hidden shrink-0 bg-gray-100 border border-gray-100 relative shadow-sm">
                     <Avatar className="w-full h-full rounded-none">
                        <AvatarImage src={featuredUpdate.imageUrl} className="object-cover" />
                        <AvatarFallback className="flex items-center justify-center bg-gray-50 text-gray-300"><Newspaper className="h-10 w-10" /></AvatarFallback>
                     </Avatar>
                  </div>
               </div>
            )}

            {/* ALL ARTICLES */}
            <div>
               <h3 className="text-xl font-bold text-[#000032] mb-6">
                 {query ? `Search Results for "${query}"` : "All articles"}
               </h3>
               <div className="space-y-4">
                  {otherUpdates.length > 0 ? (
                     otherUpdates.map((update) => (
                        <div key={update.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col-reverse md:flex-row gap-6 items-center">
                           
                           {/* Content */}
                           <div className="flex-1 w-full space-y-3">
                              <h4 className="text-lg font-bold text-[#000032] line-clamp-1">{update.title}</h4>
                              <p className="text-sm text-gray-500 line-clamp-2">{update.content}</p>
                              
                              <div className="flex items-center gap-4 pt-2">
                                 <span className="text-xs text-gray-400">{format(new Date(update.createdAt), "MMM d, yyyy")}</span>
                                 
                                 <div className="flex items-center gap-3">
                                    {update.linkUrl && (
                                       <a href={update.linkUrl} target="_blank" rel="noreferrer">
                                           <Button variant="outline" size="sm" className="h-7 px-3 text-[10px] font-bold rounded-full border-blue-200 text-blue-600 hover:bg-blue-50">
                                              Visit Link <ExternalLink className="ml-1 h-3 w-3" />
                                           </Button>
                                       </a>
                                    )}

                                    <div className="flex gap-1">
                                       <EditBusinessUpdateModal companyId={companyId} update={update} />
                                       <DeleteUpdateButton updateId={update.id} companyId={companyId} />
                                    </div>
                                 </div>
                              </div>
                           </div>

                           {/* Image */}
                           <div className="w-full md:w-[200px] aspect-video rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                              <Avatar className="w-full h-full rounded-none">
                                 <AvatarImage src={update.imageUrl} className="object-cover" />
                                 <AvatarFallback className="flex items-center justify-center bg-gray-50 text-gray-300"><Newspaper className="h-6 w-6" /></AvatarFallback>
                              </Avatar>
                           </div>
                        </div>
                     ))
                  ) : (
                     !featuredUpdate && (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                           <Newspaper className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                           <p className="text-gray-500 font-medium">No articles found.</p>
                           <p className="text-sm text-gray-400">{query ? "Try a different search." : "Start writing to engage customers."}</p>
                        </div>
                     )
                  )}
               </div>
            </div>
         </div>

         {/* RIGHT SIDEBAR */}
         <div className="w-full xl:w-[360px] bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8 shrink-0">
            
            {/* WIDGET 1: Top Writers */}
            <div>
               <h3 className="font-bold text-[#000032] text-lg mb-4">Top Writers</h3>
               <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                  <Avatar className="h-10 w-23">
                     <AvatarImage src={companyLogo || ''} />
                     <AvatarFallback className="bg-[#0ABED6] text-white font-bold">{companyName?.[0] || 'C'}</AvatarFallback>
                  </Avatar>
                  <div>
                     <p className="font-bold text-[#000032] text-sm">{companyName}</p>
                     <p className="text-xs text-gray-500 font-medium">Company Author</p>
                  </div>
               </div>
               <div className="mt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                     <span className="text-gray-500">{currentMonthName} Usage</span>
                     <span className="font-bold text-[#000032]">{usageCount} / {monthlyLimit === Infinity ? "∞" : monthlyLimit}</span>
                  </div>
               </div>
            </div>

            <div className="h-px bg-gray-100 w-full" />

            {/* WIDGET 2: Posting Summary */}
            <div>
               <h3 className="font-bold text-[#000032] text-lg mb-4">Posting Summary</h3>
               <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg text-blue-600 shadow-sm"><Newspaper className="h-5 w-5" /></div>
                        <span className="text-sm font-bold text-gray-700">Total Listed</span>
                     </div>
                     <span className="text-xl font-bold text-[#000032]">{updates.length}</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg text-purple-600 shadow-sm"><Calendar className="h-5 w-5" /></div>
                        <span className="text-sm font-bold text-gray-700">Last Update</span>
                     </div>
                     <span className="text-xs font-bold text-[#000032]">{updates.length > 0 ? format(new Date(updates[0].createdAt), "MMM d") : "-"}</span>
                  </div>
               </div>
            </div>

            <div className="h-px bg-gray-100 w-full" />

            {/* WIDGET 3: Actions */}
            <div>
               <h3 className="font-bold text-[#000032] text-lg mb-2">Articles Actions</h3>
               <div className="w-full">
                  <AddBusinessUpdateModal companyId={companyId} isLimitReached={isLimitReached} />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}