'use client';

import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-deep-black flex items-center justify-center">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="mb-8"
          >
            <div className="text-8xl md:text-9xl font-bold text-desert-gold mb-4">
              404
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-elegant-white mb-4">
              الصفحة غير موجودة
            </h1>
            <p className="text-xl text-stone-gray mb-8 leading-relaxed">
              عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها إلى موقع آخر
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <motion.button
                  className="bg-desert-gold text-deep-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-warm-sand transition-all duration-300 hover:shadow-xl hover:shadow-desert-gold/25 inline-flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Home className="h-5 w-5 mr-2" />
                  العودة للرئيسية
                </motion.button>
              </Link>

              <Link href="/projects">
                <motion.button
                  className="border-2 border-desert-gold text-desert-gold px-8 py-4 rounded-lg font-bold text-lg hover:bg-desert-gold hover:text-deep-black transition-all duration-300 inline-flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="ml-2">تصفح المشاريع</span>
                  <ArrowLeft className="h-5 w-5 rtl-flip" />
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-desert-gold rounded-full opacity-30"
                animate={{
                  x: [0, 100, 0],
                  y: [0, -100, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 10 + i * 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}