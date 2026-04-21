import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { CompanyAnalyticsView } from "@/components/admin_components/admin-analytics/company-analytics-view";
import { getSearchAnalytics } from "@/lib/get-advance-analytics"; 
import { getCompanyFeatures } from "@/lib/plan-config";

export const dynamic = 'force-dynamic';
export const metadata = { title: "Analytics - Business Center" };

export default async function BusinessAnalyticsPage() {
  const session = await auth();
  if (!session?.user?.companyId) return redirect("/business/login");

  const companyId = session.user.companyId;

  // 1. Fetch Company & Features
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: {
      id: true,
      name: true,
      logoImage: true,
      websiteUrl: true,
      slug: true,
      rating: true,
      plan: true,
      enableAnalytics: true, 
      features: true, 
      isSponsored: true,
    }
  });

  if (!company) return <div>Company not found</div>;

  // 2. CALCULATE EFFECTIVE TIER
  const featureConfig = getCompanyFeatures(company as any);
  const analyticsTier = featureConfig.analyticsTier; 
  const userPlan = company.plan || "FREE";

  // 3. Fetch Reviews
  const reviews = await prisma.review.findMany({
    where: { companyId: companyId },
    orderBy: { createdAt: 'desc' },
    select: { 
        id: true,
        starRating: true, 
        createdAt: true, 
        keywords: true,
        comment: true,
        user: { select: { name: true, image: true } }
    }
  });

  // 4. Fetch Stats
  const searchStats = await getSearchAnalytics(companyId);

  // 5. Render
  return (
    <div className="min-h-screen p-6 lg:p-8 pb-20">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
           <div>
              <h1 className="text-3xl font-bold text-[#111827] flex items-center gap-3">
                  Analytics Report
              </h1>
              <p className="text-gray-500 mt-1">
                Performance metrics and sentiment analysis for {company.name}.
              </p>
           </div>
           
           <div className="flex items-center gap-4">
              {/* ✅ GHOST PLAN BADGE */}
              <div className="flex items-center gap-1.5 px-2 text-amber-500">
                  <Sparkles className="h-4 w-4 fill-amber-500/20" />
                  <span className="text-sm font-bold uppercase tracking-widest">{userPlan}</span>
              </div>
           </div>
        </div>

        <CompanyAnalyticsView 
           company={company}
           reviews={reviews as any}
           analyticsTier={analyticsTier}
           searchStats={searchStats}
           userRole={session.user.role}
        />
        
      </div>
    </div>
  );
}