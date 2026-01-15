
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { storage } from '../services/storage';

const RegisterScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate email is roughly original Gmail as requested (simple regex check)
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      alert('Please use an original @gmail.com address to prevent account suspension.');
      return;
    }
    storage.saveUser(name, email, undefined);
    localStorage.setItem('user_phone', phone);
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-slate-950 to-slate-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black italic mx-auto mb-4 shadow-xl shadow-indigo-500/20">I24</div>
          <h2 className="text-3xl font-black text-white mb-2">Join IncomeBD24</h2>
          <p className="text-slate-400 font-medium text-sm">Create a verified account to start earning</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name (Legal)</label>
            <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="John Doe" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Original Gmail Address</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="example@gmail.com" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone Number (Verified)</label>
            <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="01XXXXXXXXX" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Password</label>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="••••••••" />
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-500/20 active:scale-[0.98] transition-all uppercase tracking-widest text-xs mt-2">
            Verify & Create Account
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-sm font-medium">
          Already a member? <Link to="/login" className="text-indigo-400 font-black hover:text-indigo-300">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterScreen;
