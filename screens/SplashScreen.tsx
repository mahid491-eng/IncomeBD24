
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-950">
      <div className="relative">
        <div className="absolute -inset-10 bg-indigo-500 rounded-full blur-[80px] opacity-20 animate-pulse"></div>
        <div className="animate-float relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 mb-6 rotate-12 transform hover:rotate-0 transition-transform duration-500">
             <span className="text-4xl font-black text-white italic">I24</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white">
            IncomeBD<span className="text-indigo-500">24</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium tracking-widest uppercase text-xs text-center">Your Trusted Partner <br/> Since 2024</p>
        </div>
      </div>
      
      <div className="absolute bottom-12 flex flex-col items-center gap-2">
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Securing Connection...</p>
      </div>
    </div>
  );
};

export default SplashScreen;
