// app/not-found.tsx

"use client";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >

          <DotLottieReact
            src="https://lottie.host/c3e20a79-fdbf-4c15-b11b-9ea605e9fb90/3kFTW7ReU1.lottie"
            loop
            autoplay
          />

        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>

          <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto">
            The page you're looking for doesn't exist or may have been moved.
            Let's get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-white font-medium shadow-lg hover:bg-cyan-600 transition-all duration-300 hover:scale-105"
            >
              <Home size={18} />
              Back Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-100 transition-all duration-300"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
          </div>
        </motion.div>

        {/* Floating Shapes */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 6,
            }}
            className="absolute top-20 left-20 h-24 w-24 rounded-full bg-cyan-200/30 blur-xl"
          />

          <motion.div
            animate={{
              y: [0, 25, 0],
              rotate: [0, -10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 8,
            }}
            className="absolute bottom-20 right-20 h-32 w-32 rounded-full bg-blue-200/30 blur-xl"
          />
        </div>
      </div>
    </div>
  );
}