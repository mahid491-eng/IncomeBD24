
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import WalletScreen from './screens/WalletScreen';
import ProfileScreen from './screens/ProfileScreen';
import WithdrawalHistoryScreen from './screens/WithdrawalHistoryScreen';
import ReferralHistoryScreen from './screens/ReferralHistoryScreen';
import DailyIncomeScreen from './screens/DailyIncomeScreen';
import SpinScreen from './screens/SpinScreen';
import AdminPanelScreen from './screens/AdminPanelScreen';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30">
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/wallet" element={<WalletScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/withdrawal-history" element={<WithdrawalHistoryScreen />} />
          <Route path="/referral-history" element={<ReferralHistoryScreen />} />
          <Route path="/daily-income" element={<DailyIncomeScreen />} />
          <Route path="/spin" element={<SpinScreen />} />
          <Route path="/admin-panel" element={<AdminPanelScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
