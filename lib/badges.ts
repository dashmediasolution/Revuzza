import { Clock, BadgeCheck, Zap, Heart, Trophy, Star } from "lucide-react";

export const BADGE_CONFIG: Record<string, { label: string; description: string; icon: any; color: string; border: string }> = {
  FAST_REPLY: {
    label: "Fast Response",
    description: "Replies within 24h.",
    icon: Clock,
    color: "text-gray-500",
    border: "border-gray-200"
  },
  HIGH_RESPONSE: {
    label: "Active Resolver",
    description: "High resolution rate.",
    icon: Zap,
    color: "text-gray-500",
    border: "border-gray-200"
  },
  VERIFIED_DETAILS: {
    label: "Identity Verified",
    description: "Business details confirmed.",
    icon: BadgeCheck,
    color: "text-[#0892A5]", 
    border: "border-[#0892A5]/40"
  },
  COMMUNITY_FAV: {
    label: "Top Rated",
    description: "Consistent 4.5+ rating.",
    icon: Heart,
    color: "text-gray-500",
    border: "border-gray-200"
  },
  CATEGORY_LEADER: {
    label: "Market Leader",
    description: "Top performer in category.",
    icon: Trophy,
    color: "text-gray-500",
    border: "border-gray-200"
  },
  MOST_RELEVANT: {
    label: "Most Relevant",
    description: "Highest relevance score.",
    icon: Star,
    color: "text-white", 
    border: "border-gray-950" 
  }
};

export const PLAN_AUTO_BADGES: Record<string, string[]> = {
  FREE: [],
  GROWTH: ['COMMUNITY_FAV', 'VERIFIED_DETAILS'],
  SCALE: ['COMMUNITY_FAV', 'VERIFIED_DETAILS', 'CATEGORY_LEADER'],
  PRO: ['COMMUNITY_FAV', 'VERIFIED_DETAILS'], 
  CUSTOM: [] 
};