import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ message = "Crafting your carousel masterpiece..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-16 space-y-8">
      <div className="relative">
        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 rounded-full border-[3px] border-indigo-500/10 border-t-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
        />
        
        {/* Middle Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border-[2px] border-purple-500/10 border-t-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)]"
        />

        {/* Inner Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-4 rounded-full border-[1px] border-pink-500/10 border-t-pink-500 shadow-[0_0_5px_rgba(236,72,153,0.3)]"
        />

        {/* Center Glow */}
        <div className="absolute inset-8 bg-indigo-500 rounded-full blur-[20px] opacity-20 animate-pulse"></div>
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold tracking-tight text-white/90">{message}</h3>
        <p className="text-slate-400 text-sm max-w-xs mx-auto">Our AI is analyzing your topic to build the perfect storytelling hook and insights.</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
