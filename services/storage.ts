
import { adminService } from './admin';

export const storage = {
  saveUser: (name: string, email: string, profilePic?: string) => {
    localStorage.setItem('user_name', name);
    localStorage.setItem('user_email', email);
    if (profilePic) localStorage.setItem('user_photo', profilePic);
  },
  getUser: () => {
    const adminSettings = adminService.getSettings();
    const balance = localStorage.getItem('user_balance');
    if (balance === null) {
      // Use initial balance from admin settings
      localStorage.setItem('user_balance', adminSettings.initialBalance.toString());
    }
    return {
      name: localStorage.getItem('user_name') || 'Guest User',
      email: localStorage.getItem('user_email') || 'guest@example.com',
      profilePic: localStorage.getItem('user_photo') || `https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky`,
      balance: parseFloat(localStorage.getItem('user_balance') || adminSettings.initialBalance.toString())
    };
  },
  updateBalance: (amount: number) => {
    const current = parseFloat(localStorage.getItem('user_balance') || '0');
    const updated = current + amount;
    localStorage.setItem('user_balance', updated.toString());
    return updated;
  },
  clear: () => {
    localStorage.clear();
  }
};
