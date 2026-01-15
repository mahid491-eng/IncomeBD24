
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../services/storage';
import { adminService } from '../services/admin';

const SpinScreen: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(storage.getUser());
  const [adminSettings] = useState(adminService.getSettings());

  useEffect(() => {
    if (!adminSettings.isLuckySpinEnabled || adminSettings.maintenanceMode) {
      alert("This feature is currently unavailable.");
      navigate('/home');
    }
  }, [adminSettings, navigate]);

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winMessage, setWinMessage] = useState<string | null>(null);
  const [lastSpinDate, setLastSpinDate] = useState<string | null>(localStorage.getItem('last_spin_date'));

  const rewards = adminSettings.spinWheelRewards;
  const canSpin = lastSpinDate !== new Date().toDateString();

  const handleSpin = () => {
    if (isSpinning || !canSpin) return;

    setIsSpinning(true);
    setWinMessage(null);

    const extraRotations = 10 + Math.floor(Math.random() * 5);
    const stopAtSegment = Math.floor(Math.random() * rewards.length);
    const segmentAngle = 360 / rewards.length;
    const newRotation = rotation + (extraRotations * 360) + (stopAtSegment * segmentAngle);
    
    setRotation(newRotation);

    setTimeout(() => {
      const actualStopIndex = (rewards.length - (stopAtSegment % rewards.length)) % rewards.length;
      const reward = rewards[actualStopIndex];
      
      storage.updateBalance(reward.value);
      setUserData(storage.getUser());
      setIsSpinning(false);
      
      const today = new Date().toDateString();
      localStorage.setItem('last_spin_date', today);
      setLastSpinDate(today);

      setWinMessage(reward.value > 0 ? `JACKPOT! ৳${reward.value} ADDED` : "BETTER LUCK TOMORROW!");
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center overflow-x-hidden">
      <header className="w-full px-6 py-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white shadow-lg shadow-black/20 hover:scale-105 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <h2 className="text-xl font-black text-white tracking-tighter uppercase">Lucky Spin</h2>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full text-amber-400 font-black text-sm flex items-center gap-2">
          <span className="text-[10px] opacity-50">৳</span>{userData.balance.toFixed(2)}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-md relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[60%] bg-indigo-600/10 blur-[100px] -z-10 rounded-full"></div>

        <div className="relative mb-16 scale-110 sm:scale-100">
          <div className="absolute inset-[-15px] border-[1px] border-slate-800 rounded-full"></div>
          <div className="absolute inset-[-30px] border-[1px] border-slate-800/40 rounded-full"></div>

          <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 z-30 filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
            <div className="w-8 h-10 bg-white rounded-t-full rounded-b-lg clip-path-triangle"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full mx-auto mt-[-15px] relative z-40"></div>
          </div>
          
          <div 
            className="w-80 h-80 rounded-full border-[10px] border-slate-900 shadow-[0_0_80px_rgba(79,70,229,0.3)] relative overflow-hidden transition-transform duration-[4500ms] cubic-bezier-spin"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {rewards.map((reward, i) => (
              <div 
                key={i} 
                className="absolute top-0 left-1/2 w-1/2 h-full origin-left flex items-center justify-end px-6"
                style={{ 
                  transform: `rotate(${i * (360/rewards.length)}deg)`,
                  backgroundColor: reward.color,
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                }}
              >
                <div className="flex flex-col items-center justify-center rotate-90 translate-x-4">
                  <span className="text-white font-black text-xl tracking-tighter drop-shadow-md select-none">{reward.label}</span>
                </div>
              </div>
            ))}
            <div className="absolute inset-0 m-auto w-[90%] h-[90%] border border-white/5 rounded-full pointer-events-none"></div>
            <div className="absolute inset-0 m-auto w-16 h-16 bg-slate-900 border-4 border-slate-800 rounded-full z-20 flex items-center justify-center shadow-2xl">
               <div className="w-4 h-4 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.8)]"></div>
            </div>
          </div>
        </div>

        {winMessage ? (
          <div className="mb-10 text-center animate-in zoom-in duration-500">
            <p className={`text-2xl font-black tracking-widest uppercase ${winMessage.includes('JACKPOT') ? 'text-amber-400' : 'text-slate-500'}`}>
              {winMessage}
            </p>
            <p className="text-[10px] text-slate-500 font-bold mt-2 uppercase tracking-[0.4em]">Transaction Secured</p>
          </div>
        ) : (
          <div className="mb-10 text-center opacity-40">
            <p className="text-sm font-black text-white tracking-[0.3em] uppercase">Spin the wheel of fortune</p>
          </div>
        )}

        <button 
          onClick={handleSpin}
          disabled={isSpinning || !canSpin}
          className={`group relative w-full max-w-xs py-7 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-xs transition-all shadow-2xl overflow-hidden ${
            isSpinning || !canSpin 
              ? 'bg-slate-900 border border-slate-800 text-slate-700' 
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-105 active:scale-95 shadow-indigo-600/40'
          }`}
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          {isSpinning ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              <span>GOOD LUCK...</span>
            </div>
          ) : !canSpin ? (
            'COME BACK TOMORROW'
          ) : (
            'TRY YOUR LUCK'
          )}
        </button>

        <p className="mt-8 text-[9px] text-slate-600 font-black uppercase tracking-[0.5em] opacity-60">Daily Limit: 1 Spin</p>
      </main>

      <style>{`
        .cubic-bezier-spin {
          transition-timing-function: cubic-bezier(0.1, 0, 0.1, 1);
        }
        .clip-path-triangle {
          clip-path: polygon(50% 100%, 0 0, 100% 0);
        }
      `}</style>
    </div>
  );
};

export default SpinScreen;
