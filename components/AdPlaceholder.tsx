
import React from 'react';

interface AdPlaceholderProps {
  type: 'banner' | 'native';
  className?: string;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ type, className = "" }) => {
  return (
    <div className={`flex items-center justify-center bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group transition-all duration-300 hover:border-indigo-500/50 ${type === 'banner' ? 'h-24 w-full' : 'h-48 w-full'} ${className}`}>
      <div className="text-center">
        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">Adsterra Ad</p>
        <p className="text-[10px] text-slate-500">Sponsored Content</p>
        <div className="mt-2 text-[10px] py-1 px-2 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity">
          Click to learn more
        </div>
      </div>
    </div>
  );
};

export default AdPlaceholder;
