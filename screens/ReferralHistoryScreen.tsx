
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/admin';

const ReferralHistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const adminSettings = adminService.getSettings();

  // Mock Data now uses admin-set referral bonus
  const referrals = [
    { id: '1', name: 'Zayed Ahmed', date: '2024-03-21', bonus: adminSettings.referralBonus, status: 'Verified' },
    { id: '2', name: 'Sumit Das', date: '2024-03-19', bonus: adminSettings.referralBonus, status: 'Verified' },
    { id: '3', name: 'Tanvir Hasan', date: '2024-03-18', bonus: 0, status: 'Pending' },
    { id: '4', name: 'Mridul Islam', date: '2024-03-15', bonus: adminSettings.referralBonus, status: 'Verified' },
  ];
  
  const totalRevenue = referrals.reduce((acc, curr) => acc + curr.bonus, 0);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <header className="px-6 py-6 flex items-center gap-4 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
        <button onClick={() => navigate(-1)} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <h1 className="text-xl font-black text-white uppercase tracking-tighter">Referral Network</h1>
      </header>

      <main className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-[2rem]">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Total Invites</p>
                <p className="text-3xl font-black text-white">{referrals.length}</p>
            </div>
            <div className="bg-indigo-600 p-5 rounded-[2rem] shadow-xl shadow-indigo-600/20">
                <p className="text-[10px] text-indigo-200 font-black uppercase tracking-widest mb-1">Invite Revenue</p>
                <p className="text-3xl font-black text-white">৳{totalRevenue.toLocaleString()}</p>
            </div>
        </div>

        <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800">
           <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">My Referral Link</h3>
           <div className="flex gap-2">
              <div className="flex-1 bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs text-indigo-400 font-bold overflow-hidden whitespace-nowrap opacity-70">
                https://incomebd24.com/r/RAHAT99
              </div>
              <button className="bg-white text-black font-black px-4 rounded-xl text-[10px] uppercase active:scale-95 transition-all">Copy</button>
           </div>
        </div>

        <div className="space-y-4">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] px-2">Recently Joined</h3>
           <div className="space-y-3">
             {referrals.map((ref) => (
                <div key={ref.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center font-black text-indigo-400 text-xs">
                           {ref.name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-black text-white">{ref.name}</p>
                            <p className="text-[10px] text-slate-500">{ref.date}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className={`text-xs font-black ${ref.bonus > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                           {ref.bonus > 0 ? `+৳${ref.bonus}` : 'Pending'}
                        </p>
                        <p className="text-[9px] text-slate-600 font-bold uppercase">{ref.status}</p>
                    </div>
                </div>
             ))}
           </div>
        </div>
      </main>
    </div>
  );
};

export default ReferralHistoryScreen;
