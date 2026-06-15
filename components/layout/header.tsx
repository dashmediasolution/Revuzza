'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/lib/hooks/use-scroll';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { UserAccountNav } from './user-account-nav';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from 'next-auth/react';
import { LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { NotificationBell } from '@/components/layout/notification-bell';
// ✅ Import Translation Components
import { LanguageSelector } from "@/components/shared/language-selector";
import { TranslatableText } from "@/components/shared/translatable-text";
import { useSession } from "next-auth/react"

type NavLink = {
  label: string;
  href: string;
};

interface HeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  variant?: 'user' | 'business';
}

export function Header({ user, variant = 'user' }: HeaderProps) {
  const { data: session } = useSession()

  const role = session?.user?.role

  const roleRouteMap: Record<string, string> = {
    USER: "",
    BUSINESS: "business",
    ADMIN: "admin",
    DATA_ENTRY: "data-entry",
    BLOG_ENTRY: "blog-entry",
  }

  const getDashboardPrefix = (role?: string) => {
    const prefix = role ? roleRouteMap[role as keyof typeof roleRouteMap] : "";
    return prefix ? `/${prefix}` : "";
  };

  const [open, setOpen] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
  const scrolled = useScroll(10);

  const isBusiness = variant === 'business';

  const links: NavLink[] = isBusiness
    ? [
      { label: 'Features', href: '/business/features' },
      { label: 'Plans', href: '/business/plans' },
    ]
    : [
      { label: 'Write a Review', href: '/write-review' },
      { label: 'Categories', href: '/categories' },
      { label: 'Blog', href: '/blog' },
    ];

  const logoHref = isBusiness ? '/business' : '/';

  const dashboardPath = `${getDashboardPrefix(role)}`;

  const Logo = () => (
    <Link
      href={logoHref}
      className="flex items-center gap-2 transition-colors group select-none"
    >
      {isBusiness ? (
        <div className="flex flex-col items-start justify-center leading-none">
          <span className="text-2xl font-bold tracking-tight text-gray-900 group-hover:text-[#0ABED6] transition-colors">
            help
          </span>
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em] ml-[1px]">
            business
          </span>
        </div>
      ) : (
        <span className="text-2xl font-bold tracking-tight text-gray-900 group-hover:text-[#0ABED6] transition-colors">
          help
        </span>
      )}
    </Link>
  );

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={cn('sticky top-0 z-50 w-full border-b border-transparent transition-all duration-300', {
        'bg-white border-gray-200': scrolled,
        'bg-gray-100': !scrolled
      })}
    >
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
        <Logo />

        {/* --- DESKTOP VIEW --- */}
        <div className="hidden items-center gap-6 md:flex">
          <div className="flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.label}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#0ABED6]",
                  scrolled ? "text-gray-700" : "text-gray-600"
                )}
                href={link.href}
              >
                <TranslatableText text={link.label} />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
            {user ? (
              <div className="flex items-center gap-4">
                <NotificationBell
                  isOpen={activeDropdown === 'notifications'}
                  onToggle={(isOpen) => setActiveDropdown(isOpen ? 'notifications' : null)}
                />
                <UserAccountNav
                  user={user}
                  open={activeDropdown === 'account'}
                  onOpenChange={(isOpen) => setActiveDropdown(isOpen ? 'account' : null)}
                />
                {/* Extreme Right Placement */}
                {/* <div className="pl-4 border-l border-gray-100">
                  <LanguageSelector />
                </div> */}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                  <Link href={isBusiness ? "/business/login" : "/login"}>
                    <Button variant="ghost" className="font-semibold text-gray-700">
                      <TranslatableText text={isBusiness ? "Log in" : "Log In"} />
                    </Button>
                  </Link>
                  <Link href={isBusiness ? "/business/signup?new=true" : "/business"}>
                    <Button className="rounded-full bg-[#0ABED6] hover:bg-[#0ABED6]/80 text-white px-6 font-semibold shadow-sm">
                      <TranslatableText text={isBusiness ? "Create Free Account" : "Sign in for Business"} />
                    </Button>
                  </Link>
                </div>
                {/* Extreme Right Placement for Guest */}
                {/* <div className="pl-4 border-l border-gray-100">
                  <LanguageSelector variant="header" />
                </div> */}
              </div>
            )}
          </div>
        </div>

        {/* --- MOBILE TOGGLE --- */}
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setOpen(!open)}
          className="md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
        >
          <MenuToggleIcon open={open} className="size-6" duration={300} />
        </Button>
      </nav>

      {/* --- MOBILE MENU CONTENT --- */}
      <MobileMenu open={open}>
        <div className="flex flex-col h-full p-6">
          {user && (
            <div className="mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10 border border-gray-200">
                  <AvatarImage src={user.image || ''} alt={user.name || 'User'} />
                  <AvatarFallback className="bg-[#0ABED6] text-white font-bold">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="font-bold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate w-[200px]">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Language Selector (Mobile - Top) */}
          {/* <div className="mb-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Language</p>
            <div className="flex justify-start">
              <LanguageSelector />
            </div>
          </div> */}

          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-lg font-medium text-gray-600 hover:text-[#0ABED6] transition-colors"
                onClick={() => setOpen(false)}
              >
                <TranslatableText text={link.label} />
              </Link>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-gray-100">
            {user ? (
              <div className="flex flex-col gap-3">
                <Link
                  href={
                    ["/blog-entry", "/data-entry", "/admin"].includes(dashboardPath)
                      ? dashboardPath
                      : `${dashboardPath}/dashboard`
                  }
                  className="flex items-center hover:text-[#0ABED6]"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  My Dashboard
                </Link>
                {role === "USER" &&
                  <>
                    <Link
                      href={
                        ["/blog-entry", "/data-entry"].includes(dashboardPath)
                          ? dashboardPath
                          : `${dashboardPath}/dashboard/settings`
                      }
                      className="flex items-center hover:text-[#0ABED6]"
                    > 
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </>
                }
                <button
                  onClick={() => { signOut({ callbackUrl: '/' }); setOpen(false); }}
                  className="flex items-center gap-2 text-red-600 font-medium p-2 hover:bg-red-50 rounded-md w-full text-left"
                >
                  <LogOut className="h-5 w-5" />
                  <TranslatableText text="Log out" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {isBusiness ? (
                  <>
                    <Link href="/business/login" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full h-12 text-base hover:bg-gray-200">
                        <TranslatableText text="Log in" />
                      </Button>
                    </Link>
                    <Link href="/business/signup?new=true" onClick={() => setOpen(false)}>
                      <Button className="w-full h-12 text-base bg-[#0ABED6] hover:bg-[#0ABED6]/90 text-white">
                        <TranslatableText text="Create Free Account" />
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full h-12 text-base hover:bg-gray-200">
                        <TranslatableText text="Log In" />
                      </Button>
                    </Link>
                    <Link href="/business" onClick={() => setOpen(false)}>
                      <Button className="w-full h-12 text-base bg-[#0ABED6] hover:bg-[#0ABED6]/90 text-white">
                        <TranslatableText text="Sign in for Business" />
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </MobileMenu>
    </header>
  );
}

function MobileMenu({ open, children }: { open: boolean, children: React.ReactNode }) {
  if (!open || typeof window === 'undefined') return null;

  return createPortal(
    <div
      id="mobile-menu"
      className={cn(
        'bg-white fixed top-16 right-0 bottom-0 left-0 z-40 flex flex-col overflow-y-auto  border-t animate-in slide-in-from-top-5 duration-200 md:hidden',
      )}
    >  
      {children}
    </div>,
    document.body,
  );
}