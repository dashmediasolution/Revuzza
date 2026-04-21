"use client";

import Link from "next/link";
import Image from "next/image";
import { format } from 'date-fns';
import { TranslatableText } from "@/components/shared/translatable-text";

interface FeaturedBlogCardProps {
  blog: {
    blogUrl: string;
    imageUrl: string | null;
    headline: string;
    category: string;
    metaDescription: string;
    authorName: string;
    createdAt: Date | string;
  };
}

export function FeaturedBlogCard({ blog }: FeaturedBlogCardProps) {
  const dateStr = format(new Date(blog.createdAt), "MMMM dd, yyyy");

  return (
    <div className="group relative flex flex-col">
      {/* 1. OVERSIZED TYPOGRAPHY: Headline as the Hero */}
      <div className="mb-12 max-w-5xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0892A5]">
             <TranslatableText text="Featured Article" />
          </span>
          <div className="h-[1px] w-12 bg-gray-200" />
        </div>
        
        <Link href={`/blog/${blog.blogUrl}`}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-[0.95] tracking-tighter group-hover:text-[#0892A5] transition-colors">
            <TranslatableText text={blog.headline} />
          </h1>
        </Link>
      </div>

      {/* 2. THE MONOLITH IMAGE: Full width, rounded-none */}
      <Link href={`/blog/${blog.blogUrl}`} className="relative block w-full aspect-[21/9] overflow-hidden bg-gray-100 mb-10">
        {blog.imageUrl ? (
          <Image
            src={blog.imageUrl}
            alt={blog.headline}
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
             <TranslatableText text="No Media" />
          </div>
        )}
      </Link>

      {/* 3. INTEGRATED DATA BAR: Author & Meta */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-xl">
           <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed italic">
              <TranslatableText text={blog.metaDescription} />
           </p>
        </div>

        {/* REDESIGNED PROFILE: The "Metadata Tag" */}
        <div className="flex items-center gap-6 border-l border-gray-900 pl-6">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              <TranslatableText text="Written by" />
            </span>
            <span className="text-sm font-black text-gray-900 uppercase tracking-tight">
              <TranslatableText text={blog.authorName} />
            </span>
          </div>
          
          <div className="flex flex-col text-right md:text-left">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              <TranslatableText text="Release Date" />
            </span>
            <span className="text-sm font-black text-gray-900 uppercase tracking-tight">
              {dateStr}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}