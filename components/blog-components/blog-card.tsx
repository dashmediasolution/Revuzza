"use client";

import Link from "next/link";
import Image from "next/image";
import { format } from 'date-fns';
import { TranslatableText } from "@/components/shared/translatable-text";

interface BlogCardProps {
  blog: {
    blogUrl: string;
    imageUrl: string | null;
    headline: string;
    category: string;
    metaDescription: string;
    createdAt: Date | string;
  };
}

export function BlogCard({ blog }: BlogCardProps) {
  const dateStr = format(new Date(blog.createdAt), "dd MMM, yyyy");

  return (
    <Link href={`/blog/${blog.blogUrl}`} className="group h-full flex flex-col">
      {/* Image Container - ✅ Rounded None */}
      <div className="relative aspect-[16/10] rounded-none overflow-hidden bg-gray-50 mb-5 border border-gray-100">
        {blog.imageUrl ? (
          <Image
            src={blog.imageUrl}
            alt={blog.headline}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-gray-300 text-xs">
            <TranslatableText text="No Image" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <span className="text-[10px] font-black text-[#0892A5] mb-3 uppercase tracking-[0.2em]">
          <TranslatableText text={blog.category} />
        </span>
        
        <h3 className="text-base font-black text-gray-900 leading-snug mb-3 group-hover:text-[#0892A5] transition-colors line-clamp-2 tracking-tight">
           <TranslatableText text={blog.headline} />
        </h3>
        
        <div className="text-[13px] text-gray-500 line-clamp-2 mb-4 flex-1 leading-relaxed">
           <TranslatableText text={blog.metaDescription} />
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-50">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            <TranslatableText text={dateStr} />
          </span>
        </div>
      </div>
    </Link>
  );
}