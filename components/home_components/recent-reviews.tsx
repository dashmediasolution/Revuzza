'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ReviewCard } from '@/components/shared/review-card';
import { TranslatableText } from "@/components/shared/translatable-text";

interface RecentReviewsProps {
  reviews: any[];
}

export function RecentReviews({ reviews }: RecentReviewsProps) {
  // Split reviews into two rows for a more dynamic look
  const row1 = reviews.slice(0, Math.ceil(reviews.length / 2));
  const row2 = reviews.slice(Math.ceil(reviews.length / 2));

  return (
    <section className="py-24 bg-slate-50/50 overflow-hidden">
      <div className="container mx-auto px-4 mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl mb-4">
            <TranslatableText text="What our community says" />
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Real feedback from users around the world.
          </p>
        </motion.div>
      </div>

      <div className="flex flex-col gap-8">
        {/* Row 1: Moving Left */}
        <ScrollingRow reviews={row1} direction="left" speed={40} />
        
        {/* Row 2: Moving Right */}
        <ScrollingRow reviews={row2} direction="right" speed={50} />
      </div>
      
      {/* Soft gradient overlays to fade the edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-slate-50 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-slate-50 to-transparent" />
    </section>
  );
}

function ScrollingRow({ reviews, direction, speed }: { reviews: any[], direction: 'left' | 'right', speed: number }) {
  const duplicateReviews = [...reviews, ...reviews, ...reviews]; // Ensure seamless looping

  return (
    <div className="flex w-full overflow-hidden">
      <motion.div
        className="flex gap-6 pr-6"
        animate={{
          x: direction === 'left' ? [0, -1000] : [-1000, 0],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
        whileHover={{ animationPlayState: 'paused' }} // Pause on hover for readability
      >
        {duplicateReviews.map((review, idx) => (
          <div key={`${review.id}-${idx}`} className="w-[350px] flex-shrink-0 py-1">
            <ReviewCard 
              {...review} 
              className="border-none rounded-1xl transition-transform duration-300" 
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}