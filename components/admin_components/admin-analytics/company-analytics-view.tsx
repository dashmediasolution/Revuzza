"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp, MessageSquare, AlertTriangle, ThumbsUp, ThumbsDown,
  Lightbulb, Sparkles, BookOpen, Lock,
  Zap, Eye, MousePointerClick, DollarSign, Search, Info, MapPin,
  Scale, Phone, FileText, Users, ArrowUpCircle,
  ChevronLeft, ChevronRight, Loader2, Filter 
} from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { generateCompanyInsight } from "@/lib/search-action";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip as UiTooltip
} from "@/components/ui/tooltip";
import { ReviewCard } from "@/components/shared/review-card";
import { ComparisonTab } from "@/components/admin_components/admin-analytics/comparison-tab";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { getSearchAnalytics } from "@/lib/get-advance-analytics";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; 

// --- HELPER COMPONENTS ---
const InfoTooltip = ({ text, iconClass = "text-gray-400 hover:text-[#0ABED6]" }: { text: string, iconClass?: string }) => (
  <TooltipProvider delayDuration={300}>
    <UiTooltip>
      <TooltipTrigger asChild>
        <Info className={`h-4 w-4 cursor-help transition-colors ${iconClass}`} />
      </TooltipTrigger>
      <TooltipContent className="max-w-[250px] bg-gray-900 text-white border-gray-800 text-xs leading-relaxed shadow-xl" side="top">
        {text}
      </TooltipContent>
    </UiTooltip>
  </TooltipProvider>
);

const HighlightedText = ({ text, keywords, type }: { text: string, keywords: string[], type: 'positive' | 'negative' | 'neutral' }) => {
  if (!keywords || keywords.length === 0 || !text) return <>{text}</>;
  const snippetsToHighlight = keywords.map(k => { const parts = k.split(':'); if (parts.length >= 3) { return parts.slice(2).join(':').trim(); } return parts[0].trim(); }).filter(k => k.length > 0);
  if (snippetsToHighlight.length === 0) return <>{text}</>;
  const escapedSnippets = snippetsToHighlight.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escapedSnippets.join('|')})`, 'gi');
  const parts = text.split(regex);
  const highlightClass = type === 'positive' ? "bg-emerald-100 text-emerald-800 px-1 rounded font-bold" : type === 'negative' ? "bg-red-100 text-red-800 px-1 rounded font-bold" : "bg-amber-100 text-amber-900 px-1 rounded font-bold";
  return <span>{parts.map((part, i) => snippetsToHighlight.some(k => k.toLowerCase() === part.toLowerCase()) ? <span key={i} className={highlightClass}>{part}</span> : <span key={i}>{part}</span>)}</span>;
};

const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (<div className="bg-white p-4 border border-gray-100 shadow-xl rounded-2xl text-sm min-w-[220px] z-50"><div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3"><p className="font-bold text-[#000032] capitalize">{data.topic}</p><span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full uppercase tracking-wider">Avg: {data.avgRating.toFixed(1)} ★</span></div><div className="space-y-3"><div className="flex justify-between items-center text-red-700"><span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider"><div className="w-2 h-2 rounded-full bg-red-500" /> Negative</span><span className="font-bold text-sm">{data.negPct}% <span className="text-red-400/70 font-medium">({data.negCount})</span></span></div><div className="flex justify-between items-center text-amber-700"><span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider"><div className="w-2 h-2 rounded-full bg-amber-500" /> Neutral</span><span className="font-bold text-sm">{data.neuPct}% <span className="text-amber-400/70 font-medium">({data.neuCount})</span></span></div><div className="flex justify-between items-center text-emerald-700"><span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Positive</span><span className="font-bold text-sm">{data.posPct}% <span className="text-emerald-400/70 font-medium">({data.posCount})</span></span></div></div><div className="mt-4 pt-3 border-t border-gray-100 flex justify-between text-gray-500 text-xs font-bold"><span>TOTAL MENTIONS</span><span className="text-[#000032]">{data.total}</span></div></div>);
  }
  return null;
};

function LockedFeatureOverlay({ title, description }: { title: string, description: string }) {
  return (
    <div className="relative p-12 border border-dashed border-gray-200 rounded-3xl bg-gray-50 flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="p-4 bg-white rounded-full shadow-sm mb-4">
            <Lock className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-[#000032] mb-2">{title}</h3>
        <p className="text-gray-500 max-w-md mb-6">{description}</p>
        <Link href="/business/billing">
            <Button className="rounded-full bg-[#0ABED6] hover:bg-[#09A8BD] text-white font-bold px-6 h-11">
                <ArrowUpCircle className="h-4 w-4 mr-2" /> Upgrade Plan
            </Button>
        </Link>
    </div>
  );
}

function DashboardMetricCard({ title, value, helperText, icon, tooltip, showDivider = true, titleClass = "" }: any) {
  return (
    <div className={`flex-1 px-6 py-2 ${showDivider ? 'border-r border-gray-100 md:border-r' : ''}`}>
        <div className="flex justify-between items-start mb-2">
            {icon}
            {tooltip && <InfoTooltip text={tooltip} />}
        </div>
        <div>
            <div className="flex items-baseline gap-2">
                <h3 className={`text-2xl font-bold text-gray-900 ${titleClass}`}>{value}</h3>
            </div>
            <p className="text-sm text-[#000032] mt-1 font-bold">{title}</p>
            {helperText && <p className="text-[11px] text-gray-400 mt-0.5">{helperText}</p>}
        </div>
    </div>
  );
}

// --- MAIN COMPONENT ---
interface CompanyAnalyticsViewProps {
  company: any;
  reviews: any[];
  searchStats: any;
  userRole?: string;
  analyticsTier?: string; 
  features?: string[];
}

export function CompanyAnalyticsView({ company, reviews, analyticsTier = "BASIC", searchStats, userRole }: CompanyAnalyticsViewProps) {

  const hasAdvancedAccess = 
      userRole === 'ADMIN' || 
      analyticsTier === 'ADVANCED' || 
      analyticsTier === 'PRO';

  const [aiData, setAiData] = useState<{
    summary: string;
    suggestions: string[];
    trendAnalysis: string;
    sentimentAnalysis: string;
    sentimentActions: string[];
  } | null>(null);

  const [aiLoading, setAiLoading] = useState(true);

  // --- TABLE STATE ---
  const [tableData, setTableData] = useState(searchStats?.topQueries || []);
  const [tablePagination, setTablePagination] = useState(searchStats?.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 });
  const [tableSearch, setTableSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [tableSort, setTableSort] = useState(company.isSponsored ? "adClicks" : "clicks");

  // --- DATA PROCESSING (Metrics) ---
  const totalReviews = reviews.length;
  const positiveReviews = reviews.filter(r => r.starRating >= 4).length;
  const negativeReviews = reviews.filter(r => r.starRating <= 2).length;
  const nss = totalReviews > 0 ? Math.round(((positiveReviews - negativeReviews) / totalReviews) * 100) : 0;
  const currentScore = company.rating || 0;

  useEffect(() => {
    const generateAi = async () => {
      const metricsData = {
        trustScore: currentScore,
        nss: nss,
        totalReviews: totalReviews,
        searchImpressions: searchStats?.totals?.impressions || 0,
        ctr: Number(searchStats?.totals?.ctr) || 0,
        adValue: searchStats?.totals?.adSpend || "0.00",
        adClicks: searchStats?.totals?.adClicks || 0,
      };
      if (reviews.length > 0) {
        const aiResult = await generateCompanyInsight(reviews, metricsData, searchStats?.topQueries || []);
        if (aiResult) setAiData(aiResult);
      }
      setAiLoading(false);
    };
    generateAi();
  }, [reviews, company.id, searchStats, currentScore, nss, totalReviews]);

  // --- FETCH TABLE DATA ---
  const fetchTableData = useCallback(async () => {
    setIsTableLoading(true);
    try {
        const result = await getSearchAnalytics(company.id, currentPage, 5, tableSearch, tableSort);
        setTableData(result.topQueries);
        setTablePagination(result.pagination);
    } catch (error) {
        console.error("Failed to fetch analytics table", error);
    } finally {
        setIsTableLoading(false);
    }
  }, [company.id, currentPage, tableSearch, tableSort]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
        fetchTableData();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchTableData]);

  // --- DATA PREP ---
  const trendData = [];
  let previousScore = 0;
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    const monthLabel = format(date, "MMM");
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const monthlyReviews = reviews.filter(r => isWithinInterval(new Date(r.createdAt), { start, end }));
    const monthlySum = monthlyReviews.reduce((acc, r) => acc + r.starRating, 0);
    const monthlyAvg = monthlyReviews.length > 0 ? parseFloat((monthlySum / monthlyReviews.length).toFixed(1)) : previousScore;
    if (monthlyReviews.length > 0) previousScore = monthlyAvg;
    trendData.push({ month: monthLabel, score: monthlyAvg, reviews: monthlyReviews.length });
  }

  const keywordMap: Record<string, { total: number; positive: number; negative: number; neutral: number; sumRating: number }> = {};
  
  reviews.forEach(r => {
    const rawKeywords = r.keywords || [];
    
    const seenTopics = new Set<string>();

    rawKeywords.forEach((entry: string) => {
      let topic = entry;
      let sentiment = 'neutral';
      
      if (entry.includes(':')) { 
          const parts = entry.split(':'); 
          topic = parts[0].trim().toLowerCase(); 
          sentiment = parts[1].trim().toLowerCase(); 
      } else { 
          topic = entry.trim().toLowerCase(); 
          if (r.starRating >= 4) sentiment = 'positive'; 
          else if (r.starRating <= 2) sentiment = 'negative'; 
      }
      
      if (!seenTopics.has(topic)) {
          seenTopics.add(topic); 

          if (!keywordMap[topic]) { 
              keywordMap[topic] = { total: 0, positive: 0, negative: 0, neutral: 0, sumRating: 0 }; 
          }
          
          keywordMap[topic].total++;
          keywordMap[topic].sumRating += r.starRating;
          
          if (sentiment === 'positive') keywordMap[topic].positive++; 
          else if (sentiment === 'negative') keywordMap[topic].negative++; 
          else keywordMap[topic].neutral++;
      }
    });
  });

  const keywordAnalysis = Object.entries(keywordMap).map(([topic, data]) => {
    const posPct = Math.round((data.positive / data.total) * 100);
    const negPct = Math.round((data.negative / data.total) * 100);
    const neuPct = Math.round((data.neutral / data.total) * 100);
    return { topic, total: data.total, posCount: data.positive, neuCount: data.neutral, negCount: data.negative, posPct, negPct, neuPct, avgRating: data.sumRating / data.total };
  });

  const topKeywords = [...keywordAnalysis].sort((a, b) => b.total - a.total).slice(0, 6);
  const riskAlert = keywordAnalysis.filter(k => k.total >= 1 && k.negPct >= 20).sort((a, b) => b.negPct - a.negPct)[0];


  // ✅ SMART SENTIMENT CATEGORIZATION FOR GRIDS
  const getReviewSentiment = (review: any) => {
      const keywords = review.keywords || [];
      const smartTags = keywords.filter((k: string) => k.includes(':'));
      
      if (smartTags.length > 0) {
          const posCount = smartTags.filter((k: string) => k.toLowerCase().includes(':positive')).length;
          const negCount = smartTags.filter((k: string) => k.toLowerCase().includes(':negative')).length;
          
          if (negCount > posCount) return 'negative';
          if (posCount > negCount) return 'positive';
          return 'neutral';
      }
      
      // Legacy Fallback 
      if (review.starRating >= 4) return 'positive';
      if (review.starRating <= 2) return 'negative';
      return 'neutral';
  };

  const latestPositive = [...reviews]
      .filter(r => getReviewSentiment(r) === 'positive')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);

  const latestNegative = [...reviews]
      .filter(r => getReviewSentiment(r) === 'negative')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);

  const latestNeutral = [...reviews]
      .filter(r => getReviewSentiment(r) === 'neutral')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);


  const ctrValue = Number(searchStats?.totals?.ctr || 0);
  const gaugeCircumference = 251.2; 
  const ctrFillPercentage = Math.min(ctrValue / 50, 1);
  const gaugeOffset = gaugeCircumference - (gaugeCircumference * ctrFillPercentage);

  return (
    <div className="space-y-8">
      
      {/* --- SECTION 1: OVERVIEW CARD --- */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col xl:flex-row gap-8">
          {/* Main KPI Row */}
          <div className="flex-1 flex flex-col md:flex-row gap-8 md:gap-0">
              <DashboardMetricCard 
                  title="TrustScore"
                  tooltip="Score based on review ratings and recency."
                  value={currentScore.toFixed(1)} 
                  icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
              />
              <DashboardMetricCard 
                  title="Net Sentiment"
                  tooltip="Balance between positive and negative feedback."
                  value={nss} 
                  icon={nss > 0 ? <ThumbsUp className="h-5 w-5 text-blue-500" /> : <ThumbsDown className="h-5 w-5 text-red-500" />}
              />
              <DashboardMetricCard 
                  title="Total Reviews"
                  tooltip="Total verified reviews collected."
                  value={totalReviews} 
                  icon={<MessageSquare className="h-5 w-5 text-[#0ABED6]" />}
                  showDivider={false}
              />
          </div>

          {/* Risk Alert Side Card */}
          <div className={`xl:w-1/3 rounded-2xl p-6 border ${riskAlert ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'} flex items-center gap-4`}>
             <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                <AlertTriangle className={`w-6 h-6 ${riskAlert ? 'text-red-500' : 'text-emerald-500'}`} />
             </div>
             <div className="w-full">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900 text-sm">Risk Alert</h3>
                    <InfoTooltip text="Topics generating high negative sentiment." />
                </div>
                {riskAlert ? (
                  <>
                    <p className="text-lg font-bold text-red-700 capitalize leading-tight mt-0.5">{riskAlert.topic}</p>
                    <p className="text-xs font-bold text-red-600/80 uppercase tracking-wider">{riskAlert.negPct}% Negative</p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-bold text-emerald-700 leading-tight mt-0.5">All Clear</p>
                    <p className="text-xs font-bold text-emerald-600/80 uppercase tracking-wider">No Major Risks</p>
                  </>
                )}
             </div>
          </div>
      </div>

      {/* --- SECTION 2: SEARCH TABLE & METRICS (OUTSIDE TABS) --- */}
      {hasAdvancedAccess && searchStats && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
           
           <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
               
               {/* Left Side: 2 Rows of Metrics */}
               <div className="xl:col-span-2 flex flex-col gap-8">
                   
                   {/* Top Row: Impressions & Clicks (2 columns) */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                       {/* Impressions */}
                       <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                           <div className="flex justify-between items-start mb-6">
                               <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                                   <Eye className="h-6 w-6 text-blue-500" />
                               </div>
                               <InfoTooltip text="Total number of times your profile appeared in search results." />
                           </div>
                           <div>
                               <h3 className="text-4xl font-black text-[#000032]">{searchStats.totals?.impressions || 0}</h3>
                               <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-2">Impressions</p>
                           </div>
                       </div>

                       {/* Total Clicks */}
                       <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                           <div className="flex justify-between items-start mb-6">
                               <div className="h-12 w-12 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
                                   <MousePointerClick className="h-6 w-6 text-emerald-500" />
                               </div>
                               <InfoTooltip text={company.isSponsored ? "Clicks from sponsored positions." : "Total clicks on your profile."} />
                           </div>
                           <div>
                               <h3 className="text-4xl font-black text-[#000032]">{searchStats.totals?.clicks || 0}</h3>
                               <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-2">Total Clicks</p>
                           </div>
                       </div>
                   </div>

                   {/* Bottom Row: Calls, Leads, Est Ad Value (3 columns) */}
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {/* Calls */}
                        <div className="bg-[#111827] rounded-3xl p-6 border border-gray-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                           <div className="flex justify-between items-start mb-6">
                               <div className="h-10 w-10 bg-gray-800/80 rounded-full flex items-center justify-center shrink-0">
                                   <Phone className="h-5 w-5 text-emerald-400" />
                               </div>
                               <InfoTooltip text="Direct calls generated from your profile." iconClass="text-gray-500 hover:text-white" />
                           </div>
                           <div>
                               <h3 className="text-3xl font-black text-white">{searchStats.totals?.calls || 0}</h3>
                               <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1.5">Calls Generated</p>
                           </div>
                       </div>

                       {/* Leads */}
                       <div className="bg-[#111827] rounded-3xl p-6 border border-gray-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                           <div className="flex justify-between items-start mb-6">
                               <div className="h-10 w-10 bg-gray-800/80 rounded-full flex items-center justify-center shrink-0">
                                   <FileText className="h-5 w-5 text-[#0ABED6]" />
                               </div>
                               <InfoTooltip text="Direct leads generated from your profile." iconClass="text-gray-500 hover:text-white" />
                           </div>
                           <div>
                               <h3 className="text-3xl font-black text-white">{searchStats.totals?.leads || 0}</h3>
                               <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1.5">Leads Generated</p>
                           </div>
                       </div>

                       {/* Ad Value */}
                       <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                           <div className="flex justify-between items-start mb-6">
                               <div className="h-10 w-10 bg-purple-50 rounded-full flex items-center justify-center shrink-0">
                                   <DollarSign className="h-5 w-5 text-purple-600" />
                               </div>
                               <InfoTooltip text="Estimated monetary value of your organic traffic if bought via Ads." />
                           </div>
                           <div>
                               <h3 className="text-3xl font-black text-purple-600">${searchStats.totals?.adSpend || "0.00"}</h3>
                               <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1.5">Est. Ad Value</p>
                           </div>
                       </div>
                   </div>

               </div>

               {/* Right Side: Total View Performance Card (CTR) */}
               <div className="xl:col-span-1 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-center text-center h-full hover:shadow-md transition-shadow relative">
                   <div className="absolute top-6 right-6">
                        <InfoTooltip text="Click-Through Rate: Percentage of impressions that resulted in a click." />
                   </div>
                   
                   <h2 className="text-2xl font-bold text-[#000032] mb-1.5 text-left">Total View Performance</h2>
                   <p className="text-sm text-gray-500 text-left mb-10">Click - through performance for this period.</p>
                   
                   {/* SVG Semi-Circle Gauge */}
                   <div className="relative w-full max-w-[220px] mx-auto aspect-[2/1] mb-4 flex items-end justify-center">
                        <svg viewBox="0 0 200 110" className="absolute top-0 left-0 w-full h-full overflow-visible">
                            {/* Background Arc */}
                            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#f3f4f6" strokeWidth="18" strokeLinecap="round" />
                            {/* Foreground Arc */}
                            <path 
                                d="M 20 100 A 80 80 0 0 1 180 100" 
                                fill="none" 
                                stroke="#5fa5d9" 
                                strokeWidth="18" 
                                strokeLinecap="round"
                                strokeDasharray={251.2} 
                                strokeDashoffset={gaugeOffset} 
                                className="transition-all duration-1000 ease-out" 
                            />
                        </svg>
                        <div className="flex flex-col items-center justify-end h-full pb-0 relative z-10 translate-y-3">
                            <h3 className="text-4xl font-black text-[#000032]">{ctrValue}%</h3>
                            <p className="text-sm font-medium text-gray-500 mt-1">Avg CTR</p>
                        </div>
                   </div>
                   
                   <p className="text-[15px] font-medium text-gray-500 mt-6 leading-relaxed px-2">
                       Your click - through rate is performing well for this month.
                   </p>
               </div>

           </div>

           {/* Top Performing Queries Table */}
           <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-[#000032] flex items-center gap-2">
                            <Search className="h-5 w-5 text-[#0ABED6]" /> Top Search Queries
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">What users search to find your profile.</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <Select value={tableSort} onValueChange={(val) => { setTableSort(val); setCurrentPage(1); }}>
                            <SelectTrigger className="w-full sm:w-[180px] h-10 rounded-full bg-gray-50 border-gray-200">
                                <Filter className="h-4 w-4 mr-2 text-gray-500" />
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent align="end" className="rounded-xl">
                                <SelectItem value="impressions">Highest Impressions</SelectItem>
                                {company.isSponsored ? (
                                    <SelectItem value="adClicks">Highest Ad Clicks</SelectItem>
                                ) : (
                                    <SelectItem value="clicks">Highest Clicks</SelectItem>
                                )}
                                <SelectItem value="ctr">Highest CTR</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input 
                                placeholder="Filter queries..." 
                                className="pl-10 h-10 rounded-full bg-gray-50 border-gray-200 focus-visible:ring-[#0ABED6]"
                                value={tableSearch}
                                onChange={(e) => { setTableSearch(e.target.value); setCurrentPage(1); }}
                            />
                        </div>
                    </div>
                </div>

                <div className="relative overflow-x-auto min-h-[300px]">
                    {isTableLoading && (
                        <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center rounded-xl backdrop-blur-sm">
                            <Loader2 className="h-8 w-8 text-[#0ABED6] animate-spin" />
                        </div>
                    )}

                    <table className="w-full text-left min-w-[700px]">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-[35%]">Search Query</th>
                                <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-[20%]">User Region</th>
                                <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right w-[15%]">Impressions</th>
                                {company.isSponsored ? (
                                    <th className="px-4 py-4 text-xs font-bold text-purple-400 uppercase tracking-wider text-right w-[15%]">Ad Clicks</th>
                                ) : (
                                    <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right w-[15%]">Total Clicks</th>
                                )}
                                <th className="px-4 py-4 text-xs font-bold text-[#0ABED6] uppercase tracking-wider text-right w-[15%]">CTR</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {tableData.length > 0 ? (
                            tableData.map((q: any, i: number) => (
                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-4 py-5 align-top">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-[#000032] text-sm capitalize">{q.query}</span>
                                        {(q.location && q.location !== 'Global') && (
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 w-fit px-2 py-1 rounded-md mt-1.5 uppercase tracking-wider">
                                                <Search className="h-3 w-3" /> In {q.location}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-5 align-top">
                                    {(!q.userRegion || q.userRegion === 'unknown') ? (
                                        <span className="inline-flex items-center text-[10px] font-bold bg-gray-100 text-gray-400 px-2 py-1 rounded-md uppercase tracking-wider">Unknown</span>
                                    ) : (
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <div className="bg-gray-100 p-1.5 rounded-full text-gray-500"><MapPin className="h-3.5 w-3.5" /></div>
                                            <span className="capitalize font-bold">{q.userRegion}</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-5 text-right font-medium text-gray-600">{q.impressions}</td>
                                
                                {company.isSponsored ? (
                                    <td className="px-4 py-5 text-right font-bold text-purple-600 bg-purple-50/30">
                                        {q.adClicks || 0}
                                    </td>
                                ) : (
                                    <td className="px-4 py-5 text-right font-medium text-gray-600">
                                        {q.clicks || 0}
                                    </td>
                                )}

                                <td className="px-4 py-5 text-right font-bold text-[#0ABED6]">
                                    {q.ctr ? q.ctr + '%' : (q.impressions > 0 ? ((q.clicks / q.impressions) * 100).toFixed(1) + '%' : '0.0%')}
                                </td>
                            </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-4 py-12 text-center text-gray-400 font-medium">
                                    {isTableLoading ? "Loading..." : "No matching queries found."}
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 mt-6 pt-6">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Page {tablePagination.currentPage} of {tablePagination.totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1 || isTableLoading}
                            className="rounded-full h-9 w-9 border-gray-200 text-gray-600"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => setCurrentPage(p => Math.min(tablePagination.totalPages, p + 1))}
                            disabled={currentPage === tablePagination.totalPages || isTableLoading}
                            className="rounded-full h-9 w-9 border-gray-200 text-gray-600"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
           </div>
        </div>
      )}

      {/* --- SECTION 3: EXECUTIVE SUMMARY --- */}
      {hasAdvancedAccess && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="lg:col-span-2 bg-[#111827] rounded-3xl p-8 text-white relative overflow-hidden flex flex-col h-fit">
            <div className="absolute top-[-20px] right-[-20px] opacity-10"><Sparkles className="h-48 w-48" /></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-6 w-6 text-[#0ABED6]" />
                  <h3 className="font-bold text-xl">{aiLoading ? "Analyzing Business Data..." : "Executive Business Summary"}</h3>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg italic">
                  "{aiData?.summary || "Insufficient data."}"
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col h-fit">
            <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-6 w-6 text-amber-500" />
                <h3 className="font-bold text-[#000032] text-xl">Strategic Suggestions</h3>
            </div>
            <ul className="space-y-3">
              {(aiData?.suggestions || ["Analyzing metrics..."]).map((s, i) => (
                <li key={i} className="text-sm text-gray-600 flex gap-3 items-start">
                    <span className="text-[#0ABED6] mt-1.5 text-[10px]">●</span>
                    <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* --- SECTION 4: TABS --- */}
      <Tabs defaultValue="performance" className="space-y-8 mt-4">
        
        {/* Modern Tabs List */}
        <TabsList className="bg-gray-50/50 p-1 h-14 rounded-full border border-gray-200">
          <TabsTrigger value="performance" className="rounded-full px-6 h-12 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#0ABED6] font-bold text-gray-500 transition-all">
              Performance Trends
          </TabsTrigger>
          <TabsTrigger value="sentiment" className="rounded-full px-6 h-12 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#0ABED6] font-bold text-gray-500 transition-all flex items-center gap-2">
              Sentiment Analysis {!hasAdvancedAccess && <Lock className="h-3 w-3 opacity-50" />}
          </TabsTrigger>
          <TabsTrigger value="comparison" className="rounded-full px-6 h-12 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#0ABED6] font-bold text-gray-500 transition-all flex items-center gap-2">
              Comparison {!hasAdvancedAccess && <Lock className="h-3 w-3 opacity-50" />}
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Performance */}
        <TabsContent value="performance" className="space-y-8 animate-in fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-[#000032] text-lg mb-6">TrustScore History</h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                            <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Line type="monotone" dataKey="score" stroke="#0ABED6" strokeWidth={4} dot={{ r: 4, fill: '#0ABED6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-[#000032] text-lg mb-6">Review Volume</h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                            <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="reviews" fill="#111827" radius={[6, 6, 0, 0]} maxBarSize={50} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-purple-50 p-8 rounded-3xl border border-purple-100 relative overflow-hidden flex flex-col h-fit">
              <div className="flex items-center gap-2 mb-4 text-purple-900 font-bold z-10 text-lg">
                <Sparkles className="h-6 w-6 text-purple-600" /> AI Trend Insight
              </div>
              <p className="text-base text-purple-900/80 leading-relaxed font-medium z-10">
                {aiLoading ? "Analyzing trends..." : (aiData?.trendAnalysis || "Not enough historical data to analyze trends yet.")}
              </p>
              <div className="absolute top-[-20px] right-[-20px] opacity-10"><Sparkles className="h-40 w-40 text-purple-600" /></div>
            </div>
            
            <div className="lg:col-span-1 bg-blue-50 p-8 rounded-3xl border border-blue-100 flex flex-col h-fit">
               <div className="flex items-center gap-2 mb-4 text-blue-900 font-bold text-lg">
                   <BookOpen className="h-5 w-5 text-blue-600" /> How to read charts
               </div>
               <p className="text-sm text-blue-900/80 leading-relaxed">
                   Monitor your TrustScore closely. Sudden drops often indicate a recent influx of negative reviews that need immediate attention and response.
               </p>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Sentiment Analysis */}
        <TabsContent value="sentiment" className="space-y-8 animate-in fade-in">
            {!hasAdvancedAccess ? (
                <LockedFeatureOverlay 
                    title="Unlock Sentiment Analysis" 
                    description="Dive deep into customer feelings with topic extraction, negative keyword highlighting, and AI-driven action plans."
                />
            ) : (
                <>
                {/* 1. Stacked Sentiment Graph */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-[#000032]">Topic Sentiment Distribution</h2>
                        <p className="text-sm text-gray-500 mt-1">See exactly how customers feel about key aspects of your business.</p>
                    </div>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topKeywords} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barCategoryGap="30%">
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="topic" tick={{ fontSize: 12, fill: '#6b7280', textTransform: 'capitalize' } as any} axisLine={false} tickLine={false} dy={10} />
                            <YAxis unit="%" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                            <Tooltip content={<CustomChartTooltip />} cursor={{ fill: '#f9fafb' }} />
                            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 'bold' }} iconType="circle" />
                            <Bar dataKey="negPct" name="Negative" stackId="a" fill="#ef4444" radius={[0, 0, 6, 6]} maxBarSize={60} />
                            <Bar dataKey="neuPct" name="Neutral" stackId="a" fill="#f59e0b" maxBarSize={60} />
                            <Bar dataKey="posPct" name="Positive" stackId="a" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={60} />
                        </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. AI Sentiment & Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-indigo-50 p-8 rounded-3xl border border-indigo-100 relative overflow-hidden flex flex-col h-fit">
                        <div className="flex items-center gap-2 mb-4 text-indigo-900 font-bold z-10 text-lg">
                            <Sparkles className="h-6 w-6 text-indigo-600 fill-indigo-200" /> AI Sentiment Analysis
                        </div>
                        <p className="text-base text-indigo-900/80 leading-relaxed font-medium z-10">
                            {aiLoading ? "Analyzing sentiment..." : (aiData?.sentimentAnalysis || "Insufficient data to analyze sentiment depth.")}
                        </p>
                        <div className="absolute top-[-20px] right-[-20px] opacity-10"><Sparkles className="h-40 w-40 text-indigo-600" /></div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col h-fit">
                        <div className="flex items-center gap-2 mb-4 text-[#000032] font-bold text-lg">
                            <Lightbulb className="h-6 w-6 text-amber-500" /> Recommended Actions
                        </div>
                        <ul className="space-y-3">
                            {(aiData?.sentimentActions || ["Gather more reviews to unlock actions."]).slice(0, 3).map((action, i) => (
                            <li key={i} className="text-sm text-gray-600 flex gap-3 items-start"><span className="text-indigo-500 mt-1.5 text-[10px] shrink-0">●</span><span className="leading-relaxed">{action}</span></li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* 3. Review Grids (Positive / Neutral / Negative) */}
                <div className="space-y-12 mt-8">
                    {/* Positive Grid */}
                    <div>
                      <h3 className="text-xl font-bold text-[#000032] flex items-center gap-2 mb-6">
                        <ThumbsUp className="h-6 w-6 text-emerald-500" />
                        Top Positive Mentions
                      </h3>
                      {latestPositive.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {latestPositive.map((r: any, i: number) => (
                            <div key={`${r.id}-${i}`} className="h-full">
                              <ReviewCard
                                userName={r.user?.name || "Anonymous"}
                                userInitials={r.user?.name?.[0] || "A"}
                                userAvatarUrl={r.user?.image}
                                rating={r.starRating}
                                className="w-full h-full max-w-none shadow-sm rounded-3xl border border-gray-100"
                                textClassName="line-clamp-6 text-gray-600"
                                reviewText={<HighlightedText
                                  text={r.comment || r.text || r.content}
                                  keywords={r.keywords?.filter((k: string) =>
                                    k.toLowerCase().includes(':positive') || (!k.includes(':') && r.starRating >= 4)
                                  )}
                                  type="positive"
                                /> as any}
                                companyName={company.name}
                                companyLogoUrl={company.logoImage}
                                companyDomain={company.websiteUrl}
                                companySlug={company.slug}
                                createdAt={r.createdAt}
                                dateOfExperience={r.dateOfExperience || r.createdAt}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-center text-gray-400 font-medium">
                          No positive reviews with specific keywords found recently.
                        </div>
                      )}
                    </div>

                    {/* Neutral Grid */}
                    <div>
                      <h3 className="text-xl font-bold text-[#000032] flex items-center gap-2 mb-6">
                        <Scale className="h-6 w-6 text-amber-500" />
                        Neutral / Balanced Feedback
                      </h3>
                      {latestNeutral.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {latestNeutral.map((r: any, i: number) => (
                            <div key={`${r.id}-${i}`} className="h-full">
                              <ReviewCard
                                userName={r.user?.name || "Anonymous"}
                                userInitials={r.user?.name?.[0] || "A"}
                                userAvatarUrl={r.user?.image}
                                rating={r.starRating}
                                className="w-full h-full max-w-none shadow-sm rounded-3xl border border-gray-100"
                                textClassName="line-clamp-6 text-gray-600"
                                reviewText={<HighlightedText
                                  text={r.comment || r.text || r.content}
                                  keywords={r.keywords?.filter((k: string) =>
                                    k.toLowerCase().includes(':neutral') || (!k.includes(':') && r.starRating > 2 && r.starRating < 4)
                                  )}
                                  type="neutral"
                                /> as any}
                                companyName={company.name}
                                companyLogoUrl={company.logoImage}
                                companyDomain={company.websiteUrl}
                                companySlug={company.slug}
                                createdAt={r.createdAt}
                                dateOfExperience={r.dateOfExperience || r.createdAt}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-center text-gray-400 font-medium">
                          No neutral or balanced feedback found recently.
                        </div>
                      )}
                    </div>

                    {/* Negative Grid */}
                    <div>
                      <h3 className="text-xl font-bold text-[#000032] flex items-center gap-2 mb-6">
                        <AlertTriangle className="h-6 w-6 text-red-500" />
                        Critical Issues
                      </h3>
                      {latestNegative.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {latestNegative.map((r: any, i: number) => (
                            <div key={`${r.id}-${i}`} className="h-full relative group">
                              {r.starRating >= 4 && (
                                <div className="absolute bottom-7 right-4 z-10 bg-orange-100 text-orange-700 text-[10px] font-bold px-3 py-1 rounded-full border border-orange-200 shadow-sm">
                                  MIXED SENTIMENT
                                </div>
                              )}
                              <ReviewCard
                                userName={r.user?.name || "Anonymous"}
                                userInitials={r.user?.name?.[0] || "A"}
                                userAvatarUrl={r.user?.image}
                                rating={r.starRating}
                                className="w-full h-full max-w-none shadow-sm rounded-3xl border border-gray-100"
                                textClassName="line-clamp-6 text-gray-600"
                                reviewText={<HighlightedText
                                  text={r.comment || r.text || r.content}
                                  keywords={r.keywords?.filter((k: string) =>
                                    k.toLowerCase().includes(':negative') || (!k.includes(':') && r.starRating <= 2)
                                  )}
                                  type="negative"
                                /> as any}
                                companyName={company.name}
                                companyLogoUrl={company.logoImage}
                                companyDomain={company.websiteUrl}
                                companySlug={company.slug}
                                createdAt={r.createdAt}
                                dateOfExperience={r.dateOfExperience || r.createdAt}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-12 bg-emerald-50 rounded-3xl border border-dashed border-emerald-200 text-center text-emerald-600 font-bold">
                          No critical issues found recently. Great job!
                        </div>
                      )}
                    </div>
                </div>
                </>
            )}
        </TabsContent>

        {/* Tab 4: Comparison */}
        <TabsContent value="comparison" className="space-y-8 animate-in fade-in">
            {!hasAdvancedAccess ? (
                <LockedFeatureOverlay 
                    title="Unlock Competitor Comparison" 
                    description="Benchmark your performance against industry leaders. See how your TrustScore and Sentiment metrics stack up."
                />
            ) : (
                <ComparisonTab
                    companyId={company.id}
                    companyName={company.name}
                />
            )}
        </TabsContent>
      </Tabs>
    </div>
  );
}