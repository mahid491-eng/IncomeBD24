
import React from 'react';
import { useNavigate } from 'react-router-dom';

const WithdrawalHistoryScreen: React.FC = () => {
  const navigate = useNavigate();

  // Mock Data
  const history = [
    { id: '1', date: '2024-03-20', amount: 1200, method: 'Bkash', status: 'Completed', ref: 'WDR-90123' },
    { id: '2', date: '2024-03-15', amount: 500, method: 'Nagad', status: 'Pending', ref: 'WDR-88210' },
    { id: '3', date: '2024-03-02', amount: 2500, method: 'Binance', status: 'Completed', ref: 'WDR-77192' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <header className="px-6 py-6 flex items-center gap-4 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
        <button onClick={() => navigate(-1)} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <h1 className="text-xl font-black text-white uppercase tracking-tighter">Withdrawal Ledger</h1>
      </header>

      <main className="p-6 space-y-4">
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 mb-6 flex items-center justify-between">
            <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Lifetime Payout</p>
                <p className="text-2xl font-black text-white">৳4,200.00</p>
            </div>
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-xl">💹</div>
        </div>

        <div className="space-y-3">
          {history.map((item) => (
            <div key={item.id} className="bg-slate-900/60 border border-slate-800 p-5 rounded-3xl flex flex-col gap-3 group">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-1">{item.ref}</p>
                  <p className="text-lg font-black text-white">৳{item.amount}</p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${item.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                  {item.status}
                </span>
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-slate-800/50">
                <div className="flex items-center gap-2">
                   <div className="w-6 h-6 bg-slate-800 rounded-lg flex items-center justify-center text-[10px]">💳</div>
                   <span className="text-xs text-slate-400 font-bold">{item.method}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-black uppercase">{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default WithdrawalHistoryScreen;
