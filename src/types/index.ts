export type CurrencyCode = 'EUR' | 'USD' | 'GBP' | 'CHF' | 'CAD';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  currency: CurrencyCode;
  monthlyIncome: number;
  hasCompletedOnboarding: boolean;
  avatarUrl?: string;
  plan: 'free' | 'premium' | 'family';
  planBillingCycle: 'monthly' | 'yearly';
  twoFactorEnabled: boolean;
  createdAt: string;
}

export type AccountType = 'checking' | 'savings' | 'investment' | 'crypto';

export interface FinancialAccount {
  id: string;
  name: string;
  type: AccountType;
  institution: string;
  balance: number;
  currency: CurrencyCode;
  accountNumberMasked: string;
  lastSyncedAt: string;
  isExternalSynced: boolean;
  color?: string;
}

export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction {
  id: string;
  accountId: string;
  accountName: string;
  date: string;
  label: string;
  category: string;
  amount: number;
  type: TransactionType;
  source: 'manual' | 'open_banking';
  notes?: string;
}

export interface BudgetCategory {
  id: string;
  category: string;
  plannedAmount: number;
  color: string;
  iconName: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  monthlyContribution: number;
  priority: 'high' | 'medium' | 'low';
  category: string;
  color: string;
}

export type AssetType = 'stock' | 'etf' | 'crypto' | 'bond';

export interface InvestmentPosition {
  id: string;
  name: string;
  symbol: string;
  type: AssetType;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  dailyChangePercent: number;
  exchange: string;
  lastUpdated: string;
}

export interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  type: AssetType;
  currentPrice: number;
  dailyChangePercent: number;
  exchange: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: string;
}

export interface ConnectedBank {
  id: string;
  name: string;
  logo: string;
  status: 'active' | 'disconnected' | 'syncing';
  connectedAt: string;
  lastSyncAt: string;
  accountCount: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  userId: string;
  details: string;
  ip: string;
}
