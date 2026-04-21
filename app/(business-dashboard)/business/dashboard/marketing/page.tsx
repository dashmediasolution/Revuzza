import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CreateCampaignForm } from "@/components/business_dashboard/create-campaign-form";
// ✅ Correctly importing your action component
import CampaignActions from "@/components/business_dashboard/campaign-actions";
import { EmailUsageTracker } from "@/components/business_dashboard/email-usage-tracker";
import { Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import { getCompanyFeatures } from "@/lib/plan-config";
import { format, startOfMonth, endOfMonth } from "date-fns";

// Helper to format dates
function formatDate(date: Date) {
   return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export const metadata = { title: "Email Marketing" };

export default async function MarketingPage() {
   const session = await auth();
   if (!session?.user?.companyId) return redirect("/business/login");

   const company = await prisma.company.findUnique({
      where: { id: session.user.companyId },
      select: {
         plan: true,
         customEmailLimit: true
      }
   });

   const campaigns = await prisma.campaign.findMany({
      where: { companyId: session.user.companyId },
      orderBy: { createdAt: 'desc' }
   });

   const features = getCompanyFeatures(company);

   const userPlan = company?.plan || "FREE";
   const limit = features.emailLimit;
   const batchSize = features.emailBatchSize;

   // ✅ DYNAMIC MONTHLY CALCULATION
   const now = new Date();

   // Filter campaigns to only ones SENT during the current calendar month
   const sentThisMonth = campaigns.filter(c =>
      c.status === "SENT" &&
      new Date(c.createdAt) >= startOfMonth(now) &&
      new Date(c.createdAt) <= endOfMonth(now)
   );

   // Add up all recipients from those campaigns
   const usage = sentThisMonth.reduce((total, campaign) => {
      return total + (campaign.recipients?.length || 0);
   }, 0);

   const isLimitReached = limit !== Infinity && usage >= limit;

   // ✅ Get Current Month Name
   const currentMonthName = format(new Date(), "MMMM");

   return (
      <div className="min-h-screen p-6 lg:p-8 pb-20">
         <div className="max-w-[1440px] mx-auto space-y-10">

            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
               <div>
                  <h1 className="text-3xl font-bold text-[#111827] flex items-center gap-3">
                     Email Marketing
                  </h1>
                  <p className="text-gray-500 mt-1">
                     Design professional emails and invite customers to review your business.
                  </p>
               </div>

               <div className="flex items-center gap-3 flex-wrap">
                  {/* ✅ GHOST PLAN BADGE */}
                  <div className="flex items-center gap-1.5 px-2 text-amber-500">
                     <Sparkles className="h-4 w-4 fill-amber-500/20" />
                     <span className="text-sm font-bold uppercase tracking-widest">{userPlan}</span>
                  </div>
               </div>
            </div>

            {/* --- EMAIL USAGE TRACKER --- */}
            <div className="w-full">
               <EmailUsageTracker
                  plan={userPlan}
                  usage={usage}
                  limit={limit}
               />
            </div>

            {/* --- CREATE CAMPAIGN FORM --- */}
            <div className="w-full mt-8">
               <CreateCampaignForm
                  userEmail={session.user.email || ""}
                  isLimitReached={isLimitReached}
                  batchSizeLimit={batchSize}
               />
            </div>

            {/* --- CAMPAIGN HISTORY TABLE --- */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mt-12">
               <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#000032]">Campaign History</h2>
               </div>

               <div className="overflow-x-auto">
                  <table className="w-full table-fixed min-w-[800px]">
                     <thead>
                        <tr className="border-b border-gray-100 text-left">
                           <th className="py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-[25%]">Campaign Name</th>
                           <th className="py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-[35%]">Subject</th>
                           <th className="py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-[15%]">Status</th>
                           <th className="py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-[10%] text-center">Recipients</th>
                           <th className="py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-[10%]">Sent Date</th>
                           <th className="py-4 w-[5%]"></th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                        {campaigns.length === 0 ? (
                           <tr>
                              <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                                 No campaigns found. Create your first one above!
                              </td>
                           </tr>
                        ) : (
                           campaigns.map((c) => (
                              <tr key={c.id} className="group hover:bg-gray-50/50 transition-colors">
                                 <td className="py-5 pr-4 text-sm font-bold text-[#000032] truncate">
                                    {c.name}
                                 </td>

                                 <td className="py-5 pr-4 text-sm text-gray-500 truncate">
                                    {c.subject}
                                 </td>

                                 <td className="py-5 pr-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${c.status === "SENT"
                                          ? "bg-emerald-50 text-emerald-600"
                                          : "bg-amber-50 text-amber-600"
                                       }`}>
                                       {c.status}
                                    </span>
                                 </td>

                                 <td className="py-5 pr-4 text-sm font-medium text-gray-500 text-center">
                                    {c.recipients.length}
                                 </td>

                                 <td className="py-5 text-sm font-medium text-gray-400">
                                    {formatDate(c.createdAt)}
                                 </td>

                                 {/* ✅ DIRECTLY RENDER YOUR COMPONENT HERE */}
                                 <td className="py-5 pl-2 text-right relative">
                                    <div className="flex justify-end">
                                       <CampaignActions campaign={c as any} />
                                    </div>
                                 </td>
                              </tr>
                           ))
                        )}
                     </tbody>
                  </table>
               </div>
            </div>

         </div>
      </div>
   );
}