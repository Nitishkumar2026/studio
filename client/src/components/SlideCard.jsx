import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Edit3, Save, X, Share2 } from 'lucide-react';

const SlideCard = ({ slide, index, onUpdate }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSlide, setEditedSlide] = useState({ ...slide });

  const handleCopy = () => {
    const text = `${slide.title}\n\n${slide.content}`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSave = () => {
    onUpdate(index, editedSlide);
    setIsEditing(false);
  };

  const gradients = [
    'from-indigo-600 to-blue-500',
    'from-purple-600 to-pink-500',
    'from-pink-600 to-rose-500',
    'from-blue-600 to-cyan-500',
    'from-fuchsia-600 to-purple-600'
  ];

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="flex-shrink-0 w-[340px] md:w-[400px] glass-card-premium rounded-[32px] overflow-hidden flex flex-col transition-all duration-500 group slide-item mx-2 border border-white/10"
    >
      <div className={`relative h-48 bg-gradient-to-br ${gradients[index % gradients.length]} p-8 flex flex-col justify-end card-glare`}>
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl border border-white/20">
            <Share2 size={18} className="text-white" />
          </div>
          <span className="text-white/70 text-xs font-black tracking-widest uppercase">Slide {index + 1} of 5</span>
        </div>
        
        <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/20 flex items-center justify-center font-black text-white backdrop-blur-md border border-white/20 text-lg">
          {index + 1}
        </div>
        
        {isEditing ? (
          <input
            type="text"
            value={editedSlide.title}
            onChange={(e) => setEditedSlide({ ...editedSlide, title: e.target.value })}
            className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-2 text-white text-xl font-black placeholder-white/50 focus:outline-none focus:bg-white/20"
          />
        ) : (
          <h3 className="text-2xl font-black text-white leading-tight tracking-tight drop-shadow-lg uppercase">{slide.title}</h3>
        )}
      </div>

      <div className="p-8 flex-1 flex flex-col bg-transparent relative">
        {isEditing ? (
          <textarea
            value={editedSlide.content}
            onChange={(e) => setEditedSlide({ ...editedSlide, content: e.target.value })}
            className="w-full flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 resize-none mb-4 min-h-[160px] text-lg font-medium leading-relaxed"
            placeholder="What should this slide say?"
          />
        ) : (
          <div className="flex-1">
             <p className="text-slate-400 text-lg font-medium leading-relaxed whitespace-pre-wrap mb-4">
              {slide.content}
            </p>
          </div>
        )}

        <div className="flex items-center gap-3 mt-4">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <div key="edit-actions" className="flex gap-2 w-full">
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-all font-bold"
                >
                  <Save size={18} /> Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-3 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div key="view-actions" className="flex gap-2 w-full">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all font-bold text-sm"
                >
                  <Edit3 size={18} /> Edit Slide
                </button>
                <button
                  onClick={handleCopy}
                  className={`px-6 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all font-bold text-sm ${
                    isCopied 
                      ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' 
                      : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {isCopied ? <Check size={18} /> : <Copy size={18} />}
                  {isCopied ? 'Copied' : 'Copy'}
                </button>
              </div>
            )}
          </AnimatePresence>
          
          <button className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all">
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SlideCard;
