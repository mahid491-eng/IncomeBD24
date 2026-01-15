
import { QuizQuestion } from '../types';

export interface SpinWheelSegment {
  value: number;
  color: string;
  label: string;
}

export interface AdminSettings {
  maintenanceMode: boolean;
  minWithdrawal: number;
  maxWithdrawal: number;
  globalNotice: string;
  isNoticeVisible: boolean;
  initialBalance: number;
  referralBonus: number;
  spinWheelRewards: SpinWheelSegment[];
  quizQuestions: QuizQuestion[];
  // Feature Toggles
  isDailyIncomeEnabled: boolean;
  isLuckySpinEnabled: boolean;
  isReferralEnabled: boolean;
}

const DEFAULT_SETTINGS: AdminSettings = {
  maintenanceMode: false,
  minWithdrawal: 500,
  maxWithdrawal: 500000,
  globalNotice: "Welcome to IncomeBD24! Withdrawals are processed within 24 hours.",
  isNoticeVisible: true,
  initialBalance: 0.5,
  referralBonus: 50,
  isDailyIncomeEnabled: true,
  isLuckySpinEnabled: true,
  isReferralEnabled: true,
  spinWheelRewards: [
    { value: 5, color: '#6366f1', label: '৳5' },
    { value: 0, color: '#1e293b', label: '৳0' },
    { value: 10, color: '#a855f7', label: '৳10' },
    { value: 1, color: '#4f46e5', label: '৳1' },
    { value: 5, color: '#8b5cf6', label: '৳5' },
    { value: 0, color: '#334155', label: '৳0' },
    { value: 1, color: '#6366f1', label: '৳1' },
    { value: 10, color: '#7c3aed', label: '৳10' },
  ],
  quizQuestions: [
    { id: 'm1', category: 'Math', question: '12 + 48 = ?', options: ['50', '60', '70', '68'], answer: '60', reward: 1 },
    { id: 'm2', category: 'Math', question: '150 + 250 = ?', options: ['300', '400', '450', '500'], answer: '400', reward: 1 },
    { id: 'b1', category: 'Bengali', question: 'What is the national fruit of Bangladesh?', options: ['Mango', 'Jackfruit', 'Litchi', 'Guava'], answer: 'Jackfruit', reward: 1 },
    { id: 'b2', category: 'Bengali', question: 'Who wrote the national anthem?', options: ['Nazrul', 'Jashimuddin', 'Tagore', 'Lalon'], answer: 'Tagore', reward: 1 },
    { id: 's1', category: 'Sports', question: 'How many players are in a football team?', options: ['10', '11', '12', '9'], answer: '11', reward: 1 },
    { id: 's2', category: 'Sports', question: 'Which country won the 2023 Cricket World Cup?', options: ['India', 'Australia', 'South Africa', 'England'], answer: 'Australia', reward: 1 },
    { id: 's3', category: 'Sports', question: 'How many goals in a Hat-trick?', options: ['2', '3', '4', '5'], answer: '3', reward: 1 },
  ],
};

export const adminService = {
  getSettings: (): AdminSettings => {
    try {
      const saved = localStorage.getItem('admin_settings');
      if (!saved) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch (error) {
      console.error("Failed to parse admin settings, returning defaults.", error);
      return DEFAULT_SETTINGS;
    }
  },

  updateSettings: (settings: Partial<AdminSettings>) => {
    const current = adminService.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem('admin_settings', JSON.stringify(updated));
    return updated;
  },

  verifyAdmin: (password: string) => {
    return password === 'admin123';
  }
};
