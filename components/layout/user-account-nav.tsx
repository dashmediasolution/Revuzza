// components/layout/user-account-nav.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react'; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { useSession } from "next-auth/react"

interface UserAccountNavProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  // --- NEW: Props for parent control ---
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function UserAccountNav({ user, open, onOpenChange }: UserAccountNavProps) {
  const { data: session } = useSession()
  
   const role = session?.user?.role
  
   const roleRouteMap: Record<string, string> = {
     BUSINESS: "/business",
     ADMIN: "/admin",
     DATA_ENTRY: "/data-entry",
     BLOG_ENTRY: "/blog-entry",
   }
   const dashboardPath = roleRouteMap[role as keyof typeof roleRouteMap] || "/"
  return (
    // --- UPDATED: Pass open state to Root ---
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-9 w-9 cursor-pointer border-none transition-all hover:opacity-80">
          <AvatarImage className="border-none" src={user.image || ''} alt={user.name || 'User'} />
          <AvatarFallback className="bg-[#0ABED6] text-white font-bold">
            {user.name ? user.name[0].toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56 p-2">
        
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link  href={`${dashboardPath}/dashboard`} className="flex items-center hover:text-[#0ABED6]">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            My Dashboard
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link   href={`${dashboardPath}/dashboard/settings`} className="flex items-center hover:text-[#0ABED6]">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem 
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}