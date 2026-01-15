
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../services/storage';

const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(storage.getUser());
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  const handlePhotoUpdate = () => {
    const newSeed = Math.random().toString(36).substring(7);
    const newPhoto = `https://api.dicebear.com/7.x/avataaars/svg?seed=${newSeed}`;
    storage.saveUser(user.name, user.email, newPhoto);
    setUser({ ...user, profilePic: newPhoto });
  };

  const saveProfile = () => {
    if (!name.trim()) {
      alert("Name cannot be empty");
      return;
    }
    storage.saveUser(name, user.email, user.profilePic);
    setUser({ ...user, name });
    setEditing(false);
    // Simple toast simulation
    const btn = document.getElementById('save-btn');
    if (btn) {
      const originalText = btn.innerText;
      btn.innerText = "Saved ✓";
      setTimeout(() => { if(btn) btn.innerText = originalText; }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <header className="px-6 py-5 flex items-center gap-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <h1 className="text-xl font-black text-white">Profile Security</h1>
      </header>

      <main className="p-6 flex-1 max-w-xl mx-auto w-full space-y-6">
        <div className="flex flex-col items-center">
          <div className="relative group mb-6">
            <div className="absolute -inset-1 bg-indigo-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <img src={user.profilePic} className="w-28 h-28 rounded-full border-4 border-slate-900 relative z-10" alt="Profile" />
            <button onClick={handlePhotoUpdate} className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full border-4 border-slate-900 z-20 shadow-lg hover:scale-110 active:scale-95 transition-all">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path></svg>
            </button>
          </div>
          <h2 className="text-2xl font-black text-white">{user.name}</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{user.email}</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-[2rem] space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-500 font-black text-[10px] uppercase tracking-widest">Personal Info</h3>
            <button onClick={() => setEditing(!editing)} className="text-xs font-black text-indigo-400">
              {editing ? 'Cancel' : 'Edit'}
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest ml-1">Verified Name</p>
              {editing ? (
                <input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-bold focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
                  autoFocus
                />
              ) : (
                <div className="bg-slate-950/50 px-4 py-3 rounded-xl text-white font-bold flex justify-between items-center">
                  {user.name}
                  <button onClick={() => setEditing(true)} className="opacity-50 hover:opacity-100">
                    <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                </div>
              )}
            </div>
            {editing && (
              <button id="save-btn" onClick={saveProfile} className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl shadow-lg shadow-indigo-500/10 active:scale-95 transition-all uppercase text-[10px] tracking-widest">
                Update Identity
              </button>
            )}
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-[2rem] space-y-6 shadow-xl">
          <h3 className="text-slate-500 font-black text-[10px] uppercase tracking-widest">Security Settings</h3>
          
          <div className="space-y-3">
            <button onClick={() => setShowPasswordDialog(true)} className="w-full bg-slate-950 border border-slate-800 hover:border-indigo-500/50 p-4 rounded-2xl flex items-center justify-between transition-all group">
               <div className="flex items-center gap-3">
                  <span className="text-lg">🔑</span>
                  <span className="text-sm font-bold text-slate-300">Change Password</span>
               </div>
               <span className="text-indigo-500">→</span>
            </button>

            <div className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center justify-between transition-all">
               <div className="flex items-center gap-3">
                  <span className="text-lg">🛡️</span>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-300">2-Factor Auth</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase">Strong Protection</p>
                  </div>
               </div>
               <button 
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${twoFactor ? 'bg-emerald-500' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${twoFactor ? 'right-1' : 'left-1'}`}></div>
               </button>
            </div>
          </div>
        </div>

        {/* Hidden Admin Access Button */}
        <div className="flex justify-center pt-8">
           <button 
             onClick={() => navigate('/admin-panel')}
             className="text-[9px] text-slate-800 hover:text-slate-600 uppercase font-black tracking-[0.5em] transition-colors"
           >
             • Admin Access •
           </button>
        </div>

        {showPasswordDialog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowPasswordDialog(false)}></div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] w-full max-w-sm relative z-10 shadow-2xl">
               <h3 className="text-xl font-black text-white mb-6">Change Password</h3>
               <div className="space-y-4">
                  <input type="password" placeholder="Current Password" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-1 focus:ring-indigo-500" />
                  <input type="password" placeholder="New Password" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-1 focus:ring-indigo-500" />
                  <button onClick={() => {alert('Password Updated Successfully!'); setShowPasswordDialog(false);}} className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl uppercase text-[10px] tracking-widest mt-2 shadow-xl shadow-indigo-600/20">
                    Update Password
                  </button>
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfileScreen;
