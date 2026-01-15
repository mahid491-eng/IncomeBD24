
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../services/storage';
import { adminService } from '../services/admin';
import AdPlaceholder from '../components/AdPlaceholder';

const HomeScreen: React.FC = () => {
  const [userData, setUserData] = useState(storage.getUser());
  const [adminSettings] = useState(adminService.getSettings());
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [showDailyWork, setShowDailyWork] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setUserData(storage.getUser());
    const handleFocus = () => setUserData(storage.getUser());
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleLogout = () => {
    storage.clear();
    navigate('/login');
  };

  const handleFeatureClick = (path: string, featureEnabled: boolean = true) => {
    if (adminSettings.maintenanceMode) {
      alert("System Maintenance: This feature is temporarily unavailable.");
      return;
    }
    if (!featureEnabled) {
      alert("This feature is currently closed by Admin. Stay tuned!");
      return;
    }
    navigate(path);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <div className={`fixed inset-0 z-50 transition-opacity bg-black/70 backdrop-blur-md ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setDrawerOpen(false)}></div>
      <aside className={`fixed left-0 top-0 z-[60] h-full w-72 bg-slate-900 border-r border-slate-800 transition-transform duration-500 transform ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black italic shadow-xl">I24</div>
            <h2 className="text-xl font-black text-white">IncomeBD<span className="text-indigo-500">24</span></h2>
          </div>
          <nav className="flex-1 space-y-2">
            {[
              { label: 'Profile Settings', path: '/profile', icon: '👤', enabled: true },
              { label: 'My Wallet', path: '/wallet', icon: '💰', enabled: true },
              { label: 'Withdrawal History', path: '/withdrawal-history', icon: '📜', enabled: true },
              { label: 'Referral Network', path: '/referral-history', icon: '🤝', enabled: adminSettings.isReferralEnabled },
            ].map((item, i) => (
              <button 
                key={i} 
                onClick={() => { if(item.enabled) { navigate(item.path); setDrawerOpen(false); } else { alert("Feature Disabled by Admin"); } }} 
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${item.enabled ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-700 opacity-50 cursor-not-allowed'}`}
              >
                <span className="text-xl">{item.enabled ? item.icon : '🔒'}</span>
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
          <button onClick={handleLogout} className="mt-auto w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-400 font-bold hover:bg-red-500/10 transition-all">
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="px-6 py-5 flex items-center justify-between border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setDrawerOpen(true)} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
               <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <div>
              <p className="text-[9px] text-indigo-400 font-black uppercase tracking-[0.3em]">Welcome Back</p>
              <h1 className="text-base font-black text-white">{userData.name}</h1>
            </div>
          </div>
          <img src={userData.profilePic} className="w-11 h-11 rounded-full border-2 border-indigo-500/40 p-0.5" alt="Profile" />
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {adminSettings.isNoticeVisible && adminSettings.globalNotice && (
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <span className="text-lg">📢</span>
              <p className="text-xs text-amber-200 font-medium leading-relaxed">{adminSettings.globalNotice}</p>
            </div>
          )}

          {adminSettings.maintenanceMode && (
            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-[2rem] text-center">
              <h3 className="text-red-500 font-black text-lg uppercase tracking-widest mb-2">System Maintenance</h3>
              <p className="text-slate-400 text-xs">Some features are currently paused for upgrades.</p>
            </div>
          )}

          <div className="relative group p-1 rounded-[3rem] bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 shadow-2xl">
            <div className="bg-slate-950 rounded-[2.8rem] p-8 flex flex-col items-center justify-center">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Account Balance</p>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-indigo-500 mt-2">৳</span>
                <span className="text-5xl font-black text-white tracking-tighter">{userData.balance.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <AdPlaceholder type="banner" />

          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={() => setShowDailyWork(true)}
              className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] flex items-center justify-between hover:border-indigo-500/50 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">📋</div>
                <div className="text-left">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Daily Work</h3>
                  <p className="text-xs text-slate-500 font-medium">Income Tasks & Lucky Spin</p>
                </div>
              </div>
              <span className="text-indigo-500 text-3xl font-black transition-transform group-hover:translate-x-2">→</span>
            </button>

            <button 
              onClick={() => handleFeatureClick('/wallet')}
              className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] flex items-center justify-between hover:border-emerald-500/50 transition-all group"
            >
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">💰</div>
                <div className="text-left">
                  <h3 className="text-lg font-black text-white">Withdraw Fund</h3>
                  <p className="text-xs text-slate-500">Fast Payouts to Local Wallets</p>
                </div>
              </div>
              <span className="text-emerald-500 text-2xl">→</span>
            </button>
          </div>

          <AdPlaceholder type="native" />
        </main>
      </div>

      {showDailyWork && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowDailyWork(false)}></div>
          <div className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-[3rem] sm:rounded-[3rem] w-full max-w-lg p-8 relative z-10 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1 bg-slate-800 rounded-full mx-auto mb-8 sm:hidden"></div>
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Daily Work</h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Select your activity</p>
              </div>
              <button onClick={() => setShowDailyWork(false)} className="p-3 bg-slate-800 rounded-2xl text-white">✕</button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => { setShowDailyWork(false); handleFeatureClick('/daily-income', adminSettings.isDailyIncomeEnabled); }}
                className={`flex items-center gap-5 p-6 border rounded-[2rem] transition-all group ${adminSettings.isDailyIncomeEnabled ? 'bg-slate-950 border-slate-800 hover:border-indigo-500' : 'bg-slate-900 border-slate-800/50 opacity-40 grayscale'}`}
              >
                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {adminSettings.isDailyIncomeEnabled ? '🔥' : '🔒'}
                </div>
                <div className="text-left flex-1">
                  <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Activity 01</p>
                  <h3 className="text-lg font-black text-white">Daily Income</h3>
                  <p className="text-xs text-slate-500">{adminSettings.isDailyIncomeEnabled ? 'Quizzes & Math Tasks' : 'Closed by Admin'}</p>
                </div>
                {adminSettings.isDailyIncomeEnabled && <div className="text-indigo-500 font-black">→</div>}
              </button>

              <button 
                onClick={() => { setShowDailyWork(false); handleFeatureClick('/spin', adminSettings.isLuckySpinEnabled); }}
                className={`flex items-center gap-5 p-6 border rounded-[2rem] transition-all group ${adminSettings.isLuckySpinEnabled ? 'bg-slate-950 border-slate-800 hover:border-amber-500' : 'bg-slate-900 border-slate-800/50 opacity-40 grayscale'}`}
              >
                <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-2xl group-hover:rotate-45 transition-transform">
                  {adminSettings.isLuckySpinEnabled ? '🎡' : '🔒'}
                </div>
                <div className="text-left flex-1">
                  <p className="text-[10px] text-amber-400 font-black uppercase tracking-widest">Activity 02</p>
                  <h3 className="text-lg font-black text-white">Daily Spin</h3>
                  <p className="text-xs text-slate-500">{adminSettings.isLuckySpinEnabled ? 'Lucky Rewards up to ৳10' : 'Closed by Admin'}</p>
                </div>
                {adminSettings.isLuckySpinEnabled && <div className="text-amber-500 font-black">→</div>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
