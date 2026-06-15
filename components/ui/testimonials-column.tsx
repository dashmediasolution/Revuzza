"use client";

import React from "react";
import { motion } from "motion/react"; // Or "framer-motion" if on older version
import { cn } from "@/lib/utils";
import { HeroReviewCard } from "@/components/home_components/hero-review-card"; // Adjust path to where your card lives

export const TestimonialsColumn = (props: {
  className?: string;
  reviews: any[]; // Accepting your review data
  duration?: number;
}) => {
  return (
    <div className={cn("relative h-150 overflow-hidden", props.className)}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6"
      >
        {/* We duplicate the data to create an infinite loop effect */}
        {[...new Array(2)].map((_, index) => (
          <React.Fragment key={index}>
            {props.reviews.map((review, i) => (
              <div key={`${index}-${i}`} className="w-full">
                {/*  */}
                <HeroReviewCard 
                    {...review} 
                    // Adjust width to fit the column if needed
                    className="w-full shadow-lg" 
                />
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
      
      {/* Gradient masks for smooth fade in/out at top and bottom */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gray-100 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-100 to-transparent" />
    </div>
  );
};