import { SearchBar } from '@/components/shared/search-bar';
import Link from 'next/link';
import { getAllCategories } from '@/lib/data';
import { getCategoryIcon } from '@/lib/category-icons';
import { prisma } from "@/lib/prisma";
import { ChevronRight, ArrowUpRight } from 'lucide-react';
import { TranslatableText } from "@/components/shared/translatable-text";

export const metadata = {
  title: 'All Categories - Discover',
  description: 'Browse companies by category.',
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  const locationsData = await prisma.company.findMany({
    select: { city: true, state: true },
    distinct: ['city', 'state'],
    where: { OR: [{ city: { not: null } }, { state: { not: null } }] }
  });

  const uniqueLocations = Array.from(new Set(
    locationsData.map(l => [l.city, l.state].filter(Boolean).join(", ")).filter(Boolean)
  )).sort();

  return (
    <div className="min-h-screen pb-20 bg-[#F8FAFC]">

      {/* 1. Slim Header */}
      {/* 1. Attractive Slim Header */}
      <div className="relative bg-white border-b border-slate-100 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-50%] left-[-10%] w-[40%] h-[200%] bg-gradient-to-b from-[#0892A5]/10 to-transparent rotate-12 blur-3xl" />
          <div className="absolute top-[-50%] right-[-10%] w-[30%] h-[200%] bg-gradient-to-b from-blue-50 to-transparent -rotate-12 blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="flex flex-col items-center text-center space-y-6">

            {/* Floating Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/60 shadow-sm transition-transform hover:scale-105">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0892A5] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0892A5]"></span>
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">
                <TranslatableText text="Industry Directory" />
              </span>
            </div>

            {/* Main Title with Gradient Text */}
            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                <TranslatableText text="Find the best in" />{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0892A5] to-blue-600">
                  <TranslatableText text="every category" />
                </span>
              </h1>
              <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                <TranslatableText text="Search through thousands of verified companies across specialized industries." />
              </p>
            </div>

            {/* Modern Integrated Search Bar */}
            <div className="w-full max-w-2xl mt-4 relative group">
              {/* Soft glow behind search */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#0892A5]/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />

              <div className="relative">
                <SearchBar
                  className="w-full shadow-2xl shadow-slate-200/60 border-none ring-1 ring-slate-200 focus-within:ring-[#0892A5]/50 transition-all rounded-xl"
                  locations={uniqueLocations}
                />
              </div>
            </div>

     
          </div>
        </div>
      </div>

      {/* 2. Compact Grid */}
      <div className="container mx-auto max-w-7xl px-4 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = getCategoryIcon(category.name);

            return (
              <div
                key={category.id}
                className="group flex flex-col bg-white rounded-2xl border border-slate-200 p-5 transition-all duration-200 hover:border-[#0892A5] hover:shadow-lg hover:shadow-[#0892A5]/5"
              >
                {/* Header: Icon + Title inline */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-[#0892A5]/10 transition-colors">
                    <Icon className="h-5 w-5 text-[#0892A5]" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900 truncate">
                    <TranslatableText text={category.name} />
                  </h2>
                </div>

                {/* Compact & Interactive Subcategories */}
                <div className="flex-1 mb-4">
                  {category.subCategories.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {category.subCategories.slice(0, 4).map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/categories/${category.slug}/${sub.slug}`}
                          className="inline-flex items-center text-[11px] font-semibold text-slate-600 
                     bg-white border border-slate-200 px-2.5 py-1 rounded-full 
                     transition-all duration-200 
                     hover:border-[#0892A5] hover:bg-[#0892A5]/5 hover:text-[#0892A5] 
                     active:scale-95 shadow-sm hover:shadow-md"
                        >
                          <TranslatableText text={sub.name} />
                        </Link>
                      ))}

                      {category.subCategories.length > 4 && (
                        <Link
                          href={`/categories/${category.slug}`}
                          className="text-[10px] font-bold text-slate-400 self-center hover:text-[#0892A5] ml-1"
                        >
                          +{category.subCategories.length - 4} <TranslatableText text="more" />
                        </Link>
                      )}
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic px-1">
                      <TranslatableText text="No sub-industries" />
                    </span>
                  )}
                </div>

                {/* Clean Footer */}
                <Link
                  href={`/categories/${category.slug}`}
                  className="flex items-center justify-between pt-3 border-t border-slate-50 group/link"
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                    {category.subCategories.length} <TranslatableText text="Items" />
                  </span>
                  <div className="h-6 w-6 rounded-full bg-slate-50 flex items-center justify-center group-hover/link:bg-[#0892A5] group-hover/link:text-white transition-all">
                    <ChevronRight className="h-3 w-3" />
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}