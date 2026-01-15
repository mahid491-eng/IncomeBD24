
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService, AdminSettings } from '../services/admin';

const AdminPanelScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [settings, setSettings] = useState<AdminSettings>(adminService.getSettings());
  const [quizJson, setQuizJson] = useState(JSON.stringify(settings.quizQuestions, null, 2));

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminService.verifyAdmin(password)) {
      setIsAuthenticated(true);
    } else {
      alert('Invalid Admin Password');
    }
  };

  const handleSave = () => {
    try {
      const parsedQuizzes = JSON.parse(quizJson);
      const updatedSettings = { ...settings, quizQuestions: parsedQuizzes };
      adminService.updateSettings(updatedSettings);
      alert('System Configuration Updated Successfully');
    } catch (error) {
      alert('Error: Invalid JSON format in Quiz Questions. Please check your syntax.');
    }
  };

  const toggleFeature = (key: keyof AdminSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full max-w-sm">
          <h2 className="text-2xl font-black text-red-500 mb-6 uppercase tracking-tighter text-center">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Enter Admin Password (admin123)" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none"
            />
            <button type="submit" className="w-full bg-red-600 text-white font-black py-3 rounded-xl uppercase tracking-widest">
              Unlock System
            </button>
            <button type="button" onClick={() => navigate('/home')} className="w-full text-slate-500 font-bold py-2 text-xs uppercase tracking-widest">
              Return to App
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <header className="px-6 py-6 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
        <h1 className="text-xl font-black text-white uppercase tracking-tighter">System Control</h1>
        <button onClick={() => navigate('/home')} className="text-xs font-bold text-slate-400 uppercase">Exit</button>
      </header>

      <main className="p-6 space-y-8 max-w-2xl mx-auto w-full pb-24">
        {/* Status Section */}
        <section className="bg-slate-900/50 border border-slate-800 p-6 rounded-[2rem]">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">App Status</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-white">Maintenance Mode</p>
              <p className="text-[10px] text-slate-500">Stop all user activities</p>
            </div>
            <button 
              onClick={() => toggleFeature('maintenanceMode')}
              className={`w-14 h-8 rounded-full relative transition-all ${settings.maintenanceMode ? 'bg-red-500' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${settings.maintenanceMode ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>
        </section>

        {/* Feature Management */}
        <section className="bg-slate-900/50 border border-slate-800 p-6 rounded-[2rem] space-y-6">
          <h3 className="text-xs font-black text-blue-500 uppercase tracking-widest">Feature Visibility</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-white">Daily Income (Quiz)</p>
              <p className="text-[10px] text-slate-500">Enable/Disable Quiz tasks</p>
            </div>
            <button onClick={() => toggleFeature('isDailyIncomeEnabled')} className={`w-14 h-8 rounded-full relative transition-all ${settings.isDailyIncomeEnabled ? 'bg-indigo-500' : 'bg-slate-700'}`}>
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.isDailyIncomeEnabled ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-white">Lucky Spin</p>
              <p className="text-[10px] text-slate-500">Enable/Disable Spin Wheel</p>
            </div>
            <button onClick={() => toggleFeature('isLuckySpinEnabled')} className={`w-14 h-8 rounded-full relative transition-all ${settings.isLuckySpinEnabled ? 'bg-indigo-500' : 'bg-slate-700'}`}>
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.isLuckySpinEnabled ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-white">Referral System</p>
              <p className="text-[10px] text-slate-500">Enable/Disable Referral Network</p>
            </div>
            <button onClick={() => toggleFeature('isReferralEnabled')} className={`w-14 h-8 rounded-full relative transition-all ${settings.isReferralEnabled ? 'bg-indigo-500' : 'bg-slate-700'}`}>
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.isReferralEnabled ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>
        </section>

        {/* User Settings */}
        <section className="bg-slate-900/50 border border-slate-800 p-6 rounded-[2rem] space-y-4">
          <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-2">User Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Initial Balance (৳)</label>
              <input type="number" value={settings.initialBalance} onChange={(e) => setSettings({...settings, initialBalance: parseFloat(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Referral Bonus (৳)</label>
              <input type="number" value={settings.referralBonus} onChange={(e) => setSettings({...settings, referralBonus: parseInt(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-bold" />
            </div>
          </div>
        </section>

        {/* Financial Controls */}
        <section className="bg-slate-900/50 border border-slate-800 p-6 rounded-[2rem] space-y-4">
          <h3 className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-2">Financial Controls</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Min Withdrawal (৳)</label>
              <input type="number" value={settings.minWithdrawal} onChange={(e) => setSettings({...settings, minWithdrawal: parseInt(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Max Withdrawal (৳)</label>
              <input type="number" value={settings.maxWithdrawal} onChange={(e) => setSettings({...settings, maxWithdrawal: parseInt(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-bold" />
            </div>
          </div>
        </section>

        {/* Global Notice */}
        <section className="bg-slate-900/50 border border-slate-800 p-6 rounded-[2rem] space-y-4">
          <div className="flex justify-between items-center">
             <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest">Global Notice</h3>
             <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-[9px] font-bold text-slate-500 uppercase">Show</span>
                <input type="checkbox" checked={settings.isNoticeVisible} onChange={(e) => setSettings({...settings, isNoticeVisible: e.target.checked})} className="accent-indigo-500" />
             </label>
          </div>
          <textarea value={settings.globalNotice} onChange={(e) => setSettings({...settings, globalNotice: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm min-h-[100px]" placeholder="Enter announcement text..." />
        </section>

        {/* Quiz Management */}
        <section className="bg-slate-900/50 border border-slate-800 p-6 rounded-[2rem] space-y-4">
          <h3 className="text-xs font-black text-purple-500 uppercase tracking-widest">Daily Quiz Management (JSON)</h3>
          <textarea value={quizJson} onChange={(e) => setQuizJson(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-green-400 min-h-[300px]" placeholder="Enter quiz questions as a JSON array..." />
        </section>
        
        <button onClick={handleSave} className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-black py-4 rounded-2xl uppercase tracking-widest shadow-xl shadow-emerald-500/10 transition-all sticky bottom-6">
          Save All Configurations
        </button>
      </main>
    </div>
  );
};

export default AdminPanelScreen;
