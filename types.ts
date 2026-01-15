
export enum PaymentMethod {
  BKASH = 'Bkash',
  NAGAD = 'Nagad',
  ROCKET = 'Rocket',
  BANK = 'Bank Transfer (BD)',
  BINANCE = 'Binance (USDT)'
}

export interface User {
  name: string;
  email: string;
  balance: number;
  profilePic?: string;
}

export interface Task {
  id: string;
  title: string;
  reward: number;
  isCompleted: boolean;
}

export interface QuizQuestion {
  id: string;
  category: 'Math' | 'Bengali' | 'Sports' | 'General';
  question: string;
  options: string[];
  answer: string;
  reward: number;
}
