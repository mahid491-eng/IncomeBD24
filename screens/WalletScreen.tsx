
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaymentMethod } from '../types';
import { storage } from '../services/storage';
import { adminService } from '../services/admin';

const WalletScreen: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(storage.getUser());
  const [adminSettings] = useState(adminService.getSettings()); // Fetch admin settings
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.BKASH);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPolicy, setShowPolicy] = useState(true);

  // Dynamic Fields State
  const [phone, setPhone] = useState('');
  const [bankName, setBankName] = useState('');
  const [branch, setBranch] = useState('');
  const [accNo, setAccNo] = useState('');
  const [binanceAddr, setBinanceAddr] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (adminSettings.maintenanceMode) {
      alert("System is under maintenance. Withdrawals are paused.");
      return;
    }

    const withdrawAmount = parseFloat(amount);
    
    if (isNaN(withdrawAmount)) {
      alert('Please enter a valid amount');
      return;
    }

    // USE ADMIN SETTINGS FOR LIMITS
    if (withdrawAmount < adminSettings.minWithdrawal) {
      alert(`Minimum withdrawal limit is ৳${adminSettings.minWithdrawal}`);
      return;
    }

    if (withdrawAmount > adminSettings.maxWithdrawal) {
      alert(`Maximum withdrawal limit is ৳${adminSettings.maxWithdrawal.toLocaleString()} per transaction.`);
      return;
    }

    if (withdrawAmount > userData.balance) {
      alert('Insufficient Balance! Earn more to withdraw.');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      storage.updateBalance(-withdrawAmount);
      setLoading(false);
      alert('Withdrawal Request Submitted! Funds will arrive within 12-24 hours.');
      navigate('/home');
    }, 2000);
  };

  const isMobileMethod = [PaymentMethod.BKASH, PaymentMethod.NAGAD, PaymentMethod.ROCKET].includes(method);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Withdrawal Policy Popup - Dynamic Text */}
      {showPolicy && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">📢</div>
            <h3 className="text-xl font-black text-white text-center mb-4 uppercase tracking-tighter">Withdrawal Policy</h3>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <span className="text-indigo-500 font-bold">•</span>
                <span>Minimum Amount: <b className="text-white">৳{adminSettings.minWithdrawal}</b></span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <span className="text-indigo-500 font-bold">•</span>
                <span>Maximum Amount: <b className="text-white">৳{adminSettings.maxWithdrawal.toLocaleString()}</b></span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <span className="text-indigo-500 font-bold">•</span>
                <span>Processing Time: <b className="text-white">12-24 Hours</b></span>
              </li>
            </ul>
            <button 
              onClick={() => setShowPolicy(false)}
              className="w-full bg-white text-black font-black py-4 rounded-2xl uppercase tracking-widest text-xs hover:bg-indigo-500 hover:text-white transition-all shadow-xl shadow-white/5"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      <header className="px-6 py-5 flex items-center gap-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <button onClick={() => navigate(-1)} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <h1 className="text-xl font-black text-white uppercase tracking-tighter">Withdraw Fund</h1>
      </header>

      <main className="p-6 flex-1 max-w-xl mx-auto w-full">
        <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
          
          <div className="mb-8 p-6 bg-slate-950 border border-slate-800 rounded-3xl text-center shadow-inner">
             <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mb-1">Withdrawable Balance</p>
             <h2 className="text-4xl font-black text-white tracking-tighter">৳{userData.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Select Gateway</label>
              <select 
                value={method}
                onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
              >
                {Object.values(PaymentMethod).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Withdraw Amount (৳)</label>
              <input 
                required
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white font-bold text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-700"
              />
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest px-2 mt-1">
                Limit: ৳{adminSettings.minWithdrawal} - ৳{adminSettings.maxWithdrawal.toLocaleString()}
              </p>
            </div>

            {/* Dynamic Fields */}
            <div className="pt-6 border-t border-slate-800/50 space-y-4">
              {isMobileMethod && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{method} Wallet Number</label>
                  <input required value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="01XXXXXXXXX" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                </div>
              )}

              {method === PaymentMethod.BANK && (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Bank Name</label>
                    <input required value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g. Sonali Bank PLC" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Branch</label>
                      <input required value={branch} onChange={(e) => setBranch(e.target.value)} placeholder="Branch" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">A/C No</label>
                      <input required value={accNo} onChange={(e) => setAccNo(e.target.value)} placeholder="Account Number" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                    </div>
                  </div>
                </>
              )}

              {method === PaymentMethod.BINANCE && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Binance USDT (TRC20) Address</label>
                  <input required value={binanceAddr} onChange={(e) => setBinanceAddr(e.target.value)} placeholder="TXXXXXXXXXXXXXXXXXXXX" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                </div>
              )}
            </div>

            <button 
              disabled={loading || adminSettings.maintenanceMode}
              type="submit"
              className={`w-full hover:scale-[1.02] active:scale-[0.98] text-white font-black py-5 rounded-[2rem] shadow-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs ${adminSettings.maintenanceMode ? 'bg-slate-800 cursor-not-allowed text-slate-500' : 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-600/20'}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : adminSettings.maintenanceMode ? (
                <>⚠️ System Paused</>
              ) : (
                <>🚀 Submit Request</>
              )}
            </button>
          </form>
          
          <div className="mt-8 flex items-center justify-center gap-2 grayscale opacity-40">
             <div className="h-4 w-px bg-slate-700 mx-2"></div>
             <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Secure SSL Encrypted Payouts</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WalletScreen;
