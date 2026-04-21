import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ReviewReplyCard } from "@/components/business_dashboard/review-reply-card";
import { redirect } from "next/navigation";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { ReviewsFilter } from "@/components/business_dashboard/reviews-filter";
import { MessageSquare, Users, Smile, Frown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// ✅ Import the new component
import { ReviewBreakdownCard } from "@/components/business_dashboard/review-breakdown-card";

export const metadata = { title: "Manage Reviews - Business Center" };
export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
    rating?: string;
    sort?: string;
  }>;
}

export default async function BusinessReviewsPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.companyId) return redirect("/business/login");

  // 1. Parse Params
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const status = params.status || "all";
  const rating = params.rating || "all";
  const sort = params.sort || "newest";
  const PAGE_SIZE = 9;

  // 2. FETCH ALL REVIEWS
  const allReviewsRaw = await prisma.review.findMany({
    where: { companyId: session.user.companyId },
    select: {
      id: true,
      ownerReply: true,
      starRating: true,
      createdAt: true,
      userId: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // --- LOGIC: Rating Distribution ---
  const ratingCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalStars = 0;

  allReviewsRaw.forEach(r => {
    // @ts-ignore
    if (ratingCounts[r.starRating] !== undefined) ratingCounts[r.starRating]++;
    totalStars += r.starRating;
  });

  const totalRawReviews = allReviewsRaw.length || 0;
  const averageRating = totalRawReviews > 0 ? totalStars / totalRawReviews : 0;

  // --- LOGIC: Top 3 Reviewers ---
  const userStats = new Map();
  allReviewsRaw.forEach((review) => {
    if (!review.userId) return;
    if (!userStats.has(review.userId)) {
      userStats.set(review.userId, {
        user: review.user,
        totalReviews: 0,
        totalStars: 0,
        latestDate: new Date(0),
      });
    }
    const stats = userStats.get(review.userId);
    stats.totalReviews += 1;
    stats.totalStars += review.starRating;
    const reviewDate = new Date(review.createdAt);
    if (reviewDate > stats.latestDate) stats.latestDate = reviewDate;
  });

  const topReviewers = Array.from(userStats.values())
    .sort((a, b) => {
      if (b.totalReviews !== a.totalReviews) return b.totalReviews - a.totalReviews;
      return (b.totalStars / b.totalReviews) - (a.totalStars / a.totalReviews);
    })
    .slice(0, 3);


  // 3. APPLY FILTERS TO MAIN LIST
  let filteredReviews = allReviewsRaw;

  if (status === "unreplied") {
    filteredReviews = filteredReviews.filter(r => !r.ownerReply || r.ownerReply.trim() === "");
  } else if (status === "replied") {
    filteredReviews = filteredReviews.filter(r => r.ownerReply && r.ownerReply.trim() !== "");
  }

  if (rating !== "all") {
    const targetRating = parseInt(rating);
    filteredReviews = filteredReviews.filter(r => r.starRating === targetRating);
  }

  if (sort === 'oldest') {
    filteredReviews.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else if (sort === 'highest') {
    filteredReviews.sort((a, b) => b.starRating - a.starRating);
  } else if (sort === 'lowest') {
    filteredReviews.sort((a, b) => a.starRating - b.starRating);
  }

  // 4. PAGINATION
  const totalReviews = filteredReviews.length;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const visibleReviewIds = filteredReviews.slice(startIndex, endIndex).map(r => r.id);

  // 5. FETCH FULL DATA FOR CARDS
  const reviews = await prisma.review.findMany({
    where: { id: { in: visibleReviewIds } },
    include: {
      user: { select: { name: true, image: true } },
    },
    orderBy: sort === 'oldest' ? { createdAt: 'asc' } : { createdAt: 'desc' }
  });

  const sortedReviews = visibleReviewIds.map(id => reviews.find(r => r.id === id)).filter(Boolean);

  const company = await prisma.company.findUnique({
    where: { id: session.user.companyId },
    select: { name: true }
  });

  return (
    
    <div className="min-h-screen p-6 lg:p-8 pb-20 ">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#111827]">Customer Reviews</h1>
            <p className="text-gray-500 mt-1">Manage and reply to feedback from your customers.</p>
          </div>
          <div className="shrink-0"><ReviewsFilter /></div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex flex-col xl:flex-row gap-8 items-start">

          {/* LEFT: REVIEWS GRID */}
          <div className="flex-1 w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#000032]">All Reviews</h2>
              <span className="text-sm font-bold text-gray-500 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">{sortedReviews.length} visible</span>
            </div>

            {sortedReviews.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-blue-50 text-[#0ABED6] rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-[#000032]">No reviews found</h3>
                <p className="text-gray-500 mt-2">Try clearing your filters to see more results.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {sortedReviews.map((review) => (
                    <div
                      key={review!.id}
                      className="h-full md:[&:nth-child(odd)]:border-r md:border-gray-100 md:pr-6"
                    >
                      <ReviewReplyCard
                        review={review as any}
                        companyName={company?.name || "Us"}
                      />
                    </div>
                  ))}
                </div>
                <PaginationControls totalItems={totalReviews} pageSize={PAGE_SIZE} currentPage={currentPage} />
              </>
            )}
          </div>

          {/* RIGHT: SIDEBAR */}
          <div className="w-full xl:w-[380px] bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-10 shrink-0">

            {/* WIDGET 1: Top 3 Reviewers */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-[#000032] text-lg">Top 3 Reviewers</h3>
                <Users className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {topReviewers.map((data) => {
                  const avgRating = data.totalStars / data.totalReviews;
                  const isSatisfied = avgRating >= 4.0;
                  return (
                    <div key={data.user.id} className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <AvatarImage src={data.user.image || ''} />
                          <AvatarFallback className="bg-[#0ABED6] text-white font-bold text-xs">{data.user.name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Primary Reviewer</p>
                          <h4 className="font-bold text-[#000032] text-sm">{data.user.name || "Anonymous"}</h4>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 border-t border-gray-200 pt-3">
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Total</p>
                          <p className="text-sm font-black text-[#000032]">{data.totalReviews}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Recent</p>
                          <p className="text-sm font-black text-[#000032]">{data.latestDate.toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Satisfied</p>
                          <div className={`inline-flex items-center gap-1 text-xs font-black ${isSatisfied ? 'text-emerald-600' : 'text-orange-500'}`}>
                            {isSatisfied ? <Smile className="w-3.5 h-3.5" /> : <Frown className="w-3.5 h-3.5" />}
                            {isSatisfied ? "Yes" : "Avg"}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {topReviewers.length === 0 && <p className="text-sm font-medium text-gray-500 text-center py-4">No data yet.</p>}
              </div>
            </div>

            <div className="h-px bg-gray-100 w-full" />

            {/* ✅ WIDGET 2: Review Breakdown */}
            <div className="-m-6 border-none shadow-none">
              <ReviewBreakdownCard
                ratingCounts={ratingCounts}
                totalReviews={totalRawReviews}
                averageRating={averageRating}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}