import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, Lightbulb } from 'lucide-react';

const InputForm = ({ onGenerate, isLoading }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      onGenerate(topic);
    }
  };

  const suggestions = [
    { text: 'Mastering Time', icon: '⏰' },
    { text: 'AI for Growth', icon: '🚀' },
    { text: 'Healthy Hacks', icon: '🥗' },
    { text: 'Coding Tips', icon: '💻' }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mb-16 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-2 rounded-3xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(99,102,241,0.2)]"
      >
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-400">
              <Lightbulb size={22} className="animate-pulse" />
            </div>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What should your carousel be about?"
              className="w-full pl-16 pr-6 py-5 bg-white/5 border-none rounded-2xl text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-lg"
              disabled={isLoading}
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className={`btn-premium group relative flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-bold text-white overflow-hidden w-full md:w-auto ${
              isLoading || !topic.trim() ? 'opacity-50 grayscale cursor-not-allowed' : ''
            }`}
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Sparkles size={20} className="animate-spin" />
                <span>Working...</span>
              </span>
            ) : (
              <>
                <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                <span>Generate Carousel</span>
              </>
            )}
          </button>
        </form>
      </motion.div>

      {/* Suggested Topics */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 flex flex-wrap gap-3 justify-center"
      >
        <span className="text-slate-500 text-sm font-semibold flex items-center mr-2">
          TRY THESE:
        </span>
        {suggestions.map((item) => (
          <button
            key={item.text}
            onClick={() => setTopic(item.text)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-input text-slate-300 text-sm font-medium hover:bg-white/10 hover:text-white hover:scale-105 active:scale-95 transition-all border border-white/5"
          >
            <span>{item.icon}</span>
            <span>{item.text}</span>
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default InputForm;
