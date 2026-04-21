"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  LogOut,
  Star,
  BarChart3,
  Store,
  Megaphone,
  Settings,
  BellPlusIcon,
  Building2 
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

// --- ANIMATION VARIANTS ---
// Wider open state for elegance, 5rem closed to fit the floating padding perfectly
const sidebarVariants = {
  open: { width: "17rem" },
  closed: { width: "5rem" },
};

const textVariants = {
  open: { opacity: 1, x: 0, display: "block", transition: { delay: 0.1 } },
  closed: { opacity: 0, x: -10, transition: { duration: 0.1 }, transitionEnd: { display: "none" } },
};

// --- BUSINESS LINKS ---
const BUSINESS_LINKS = [
  { name: "Overview", href: "/business/dashboard", icon: LayoutDashboard },
  { name: "Reviews", href: "/business/dashboard/reviews", icon: Star },
  { name: "Business Updates", href: "/business/dashboard/updates", icon: BellPlusIcon, badge: "New" },
  { name: "Analytics", href: "/business/dashboard/analytics", icon: BarChart3 },
  { name: "Marketing", href: "/business/dashboard/marketing", icon: Megaphone },
  { name: "Products & Services", href: "/business/dashboard/showcase", icon: Store },
  { name: "Edit Profile", href: "/business/dashboard/settings", icon: Settings },
];

export function BusinessSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const pathname = usePathname();

  return (
    <motion.nav
      className={cn(
        // ✅ FLOATING DESIGN: inset-y-4 left-4 creates the floating gap. rounded-3xl gives the premium app feel.
        "fixed inset-y-4 left-4 z-50 flex flex-col rounded-3xl bg-[#000032] border border-white/10 shadow-2xl overflow-hidden",
      )}
      initial={isCollapsed ? "closed" : "open"}
      animate={isCollapsed ? "closed" : "open"}
      variants={sidebarVariants}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
        
      {/* --- TOP: Premium App Brand Header --- */}
      <div className="flex h-[88px] shrink-0 items-center px-4 border-b border-white/5 bg-white/5">
        <div className="flex items-center gap-4 w-full">
          {/* Logo Box */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0ABED6] to-blue-600 shadow-lg">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          
          {/* Text (Fades out when closed) */}
          <motion.div variants={textVariants} className="flex flex-col whitespace-nowrap">
            <h2 className="text-base font-black text-white tracking-wide">Business Center</h2>
            <p className="text-[11px] font-bold text-[#0ABED6] uppercase tracking-widest mt-0.5">Workspace</p>
          </motion.div>
        </div>
      </div>

      {/* --- MIDDLE: Scrollable Nav Links --- */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-6 px-3 space-y-1.5">
        {BUSINESS_LINKS.map((link) => {
          const isActive = pathname === link.href;
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "relative flex h-12 w-full items-center rounded-2xl px-3 transition-all duration-200 group",
                isActive 
                  ? "bg-white/10" // Subtle background for active
                  : "hover:bg-white/5"
              )}
            >
              {/* ✅ ACTIVE INDICATOR: Sleek vertical line on the left */}
              {isActive && (
                <motion.div 
                    layoutId="activeTab"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#0ABED6] rounded-r-full"
                />
              )}

              <link.icon className={cn(
                "h-5 w-5 shrink-0 transition-colors duration-200",
                isActive ? "text-[#0ABED6]" : "text-gray-400 group-hover:text-gray-200"
              )} />
              
              <motion.div variants={textVariants} className="ml-4 flex flex-1 items-center justify-between overflow-hidden">
                <span className={cn(
                    "whitespace-nowrap text-sm font-medium transition-colors duration-200",
                    isActive ? "text-white font-bold" : "text-gray-400 group-hover:text-gray-200"
                )}>
                    {link.name}
                </span>
          
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* --- BOTTOM: Sign Out --- */}
      <div className="p-4 border-t border-white/5 bg-black/20 shrink-0">
        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: '/business/login' })}
          className="flex h-12 w-full items-center justify-start rounded-2xl px-3 text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-colors group"
        >
          <LogOut className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:-translate-x-1" />
          <motion.div variants={textVariants} className="ml-4 overflow-hidden">
            <span className="whitespace-nowrap text-sm font-bold tracking-wide">Sign Out</span>
          </motion.div>
        </Button>
      </div>

    </motion.nav>
  );
}