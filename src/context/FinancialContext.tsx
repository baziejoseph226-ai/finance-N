import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserProfile,
  FinancialAccount,
  Transaction,
  BudgetCategory,
  SavingsGoal,
  InvestmentPosition,
  WatchlistItem,
  ConnectedBank,
  ChatMessage,
  AuditLog,
  CurrencyCode,
} from '../types';
import {
  initialUserProfile,
  initialAccounts,
  initialTransactions,
  initialBudgetCategories,
  initialSavingsGoals,
  initialInvestmentPositions,
  initialWatchlist,
  initialConnectedBanks,
} from '../data/initialData';

export type AppView =
  | 'landing'
  | 'dashboard'
  | 'transactions'
  | 'budgets'
  | 'savings'
  | 'investments'
  | 'ai'
  | 'banking'
  | 'billing'
  | 'settings'
  | 'admin';

interface FinancialContextType {
  // Navigation & View
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Auth & Profile
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  completeOnboarding: (data: Partial<UserProfile>) => void;

  // Accounts & Metrics
  accounts: FinancialAccount[];
  addAccount: (acc: Omit<FinancialAccount, 'id' | 'lastSyncedAt'>) => void;
  deleteAccount: (id: string) => void;
  totalNetWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsCapacity: number;
  savingsRate: number;

  // Transactions
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  exportTransactionsCSV: () => void;

  // Budgets
  budgetCategories: BudgetCategory[];
  updateBudgetLimit: (id: string, plannedAmount: number) => void;
  addBudgetCategory: (cat: Omit<BudgetCategory, 'id'>) => void;

  // Savings Goals
  savingsGoals: SavingsGoal[];
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'currentAmount'>) => void;
  depositToSavingsGoal: (goalId: string, amount: number) => void;
  editSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;

  // Investments
  investmentPositions: InvestmentPosition[];
  addInvestmentPosition: (pos: Omit<InvestmentPosition, 'id' | 'lastUpdated'>) => void;
  editInvestmentPosition: (id: string, updates: Partial<InvestmentPosition>) => void;
  deleteInvestmentPosition: (id: string) => void;
  totalPortfolioValue: number;
  totalPortfolioCost: number;
  totalUnrealizedGain: number;
  totalUnrealizedGainPercent: number;

  // Watchlist
  watchlist: WatchlistItem[];
  addToWatchlist: (item: Omit<WatchlistItem, 'id'>) => void;
  removeFromWatchlist: (id: string) => void;

  // Finova AI
  chatMessages: ChatMessage[];
  isAiThinking: boolean;
  sendAiMessage: (messageText: string) => Promise<void>;
  clearAiChat: () => void;

  // Banking (DSP2)
  connectedBanks: ConnectedBank[];
  syncAllBanks: () => Promise<void>;
  connectBank: (bankName: string) => Promise<void>;
  disconnectBank: (id: string) => void;

  // Billing
  upgradeSubscription: (planId: 'free' | 'premium' | 'family', cycle: 'monthly' | 'yearly') => Promise<any>;

  // Audit Logs & Export
  auditLogs: AuditLog[];
  exportAllUserDataJSON: () => void;
  resetToDefaultData: () => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

const STORAGE_KEY = 'finova_finance_state_v1';

export const FinancialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [currentView, setCurrentView] = useState<AppView>('landing');

  // Core Data States
  const [user, setUser] = useState<UserProfile | null>(initialUserProfile);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [accounts, setAccounts] = useState<FinancialAccount[]>(initialAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>(initialBudgetCategories);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(initialSavingsGoals);
  const [investmentPositions, setInvestmentPositions] = useState<InvestmentPosition[]>(initialInvestmentPositions);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(initialWatchlist);
  const [connectedBanks, setConnectedBanks] = useState<ConnectedBank[]>(initialConnectedBanks);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'log_init_01',
      timestamp: new Date().toISOString(),
      action: 'SESSION_INITIALIZED',
      userId: 'usr_finova_01',
      details: 'Session sécurisée active sur Finova Finance',
      ip: '127.0.0.1',
    },
  ]);

  // AI Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_01',
      role: 'assistant',
      content: `Bonjour Alexandre ! Je suis **Finova AI**, votre conseiller financier intelligent.
      
J'ai analysé votre situation financière actuelle :
- Votre patrimoine financier consolidé s'élève à **52 480,50 €**.
- Votre taux d'épargne ce mois-ci est de **36.8%** (${(3450 - 2180).toLocaleString('fr-FR')} € de marge nette).
- Votre objectif d'épargne de précaution est complété à **85%**.

Comment puis-je vous accompagner aujourd'hui ? Vous pouvez par exemple me demander :
* « Comment optimiser mes abonnements récurrents ? »
* « Quel est mon niveau de diversification en bourse ? »
* « Dans combien de mois mon apport immobilier sera-t-il financé ? »`,
      timestamp: new Date().toISOString(),
      source: 'Finova AI Core',
    },
  ]);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.user) setUser(parsed.user);
        if (parsed.isAuthenticated !== undefined) setIsAuthenticated(parsed.isAuthenticated);
        if (parsed.accounts) setAccounts(parsed.accounts);
        if (parsed.transactions) setTransactions(parsed.transactions);
        if (parsed.budgetCategories) setBudgetCategories(parsed.budgetCategories);
        if (parsed.savingsGoals) setSavingsGoals(parsed.savingsGoals);
        if (parsed.investmentPositions) setInvestmentPositions(parsed.investmentPositions);
        if (parsed.watchlist) setWatchlist(parsed.watchlist);
        if (parsed.connectedBanks) setConnectedBanks(parsed.connectedBanks);
        if (parsed.chatMessages) setChatMessages(parsed.chatMessages);
        if (parsed.theme) setTheme(parsed.theme);
      }
    } catch (e) {
      console.error('Error loading saved state:', e);
    }
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    try {
      const stateToPersist = {
        user,
        isAuthenticated,
        accounts,
        transactions,
        budgetCategories,
        savingsGoals,
        investmentPositions,
        watchlist,
        connectedBanks,
        chatMessages,
        theme,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist));
    } catch (e) {
      console.error('Error saving state:', e);
    }
  }, [
    user,
    isAuthenticated,
    accounts,
    transactions,
    budgetCategories,
    savingsGoals,
    investmentPositions,
    watchlist,
    connectedBanks,
    chatMessages,
    theme,
  ]);

  // Sync theme class to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Add audit log helper
  const addAudit = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString(),
      action,
      userId: user?.id || 'anonymous',
      details,
      ip: '127.0.0.1 (Local Verified)',
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 99)]);
  };

  // Calculate Key Financial Metrics
  const totalNetWorth = accounts.reduce((acc, curr) => acc + curr.balance, 0);

  // Current month income & expenses
  const monthlyIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const savingsCapacity = Math.max(0, monthlyIncome - monthlyExpenses);
  const savingsRate = monthlyIncome > 0 ? Math.round((savingsCapacity / monthlyIncome) * 100) : 0;

  // Investment aggregates
  const totalPortfolioValue = investmentPositions.reduce((acc, p) => acc + p.quantity * p.currentPrice, 0);
  const totalPortfolioCost = investmentPositions.reduce((acc, p) => acc + p.quantity * p.avgBuyPrice, 0);
  const totalUnrealizedGain = totalPortfolioValue - totalPortfolioCost;
  const totalUnrealizedGainPercent = totalPortfolioCost > 0 ? (totalUnrealizedGain / totalPortfolioCost) * 100 : 0;

  // Auth handlers
  const login = async (email: string, pass: string) => {
    if (!email || !pass) return { success: false, error: 'Veuillez saisir votre email et mot de passe.' };
    const loggedUser: UserProfile = {
      ...initialUserProfile,
      email,
      name: email.split('@')[0],
    };
    setUser(loggedUser);
    setIsAuthenticated(true);
    addAudit('USER_LOGIN', `Connexion réussie pour ${email}`);
    setCurrentView('dashboard');
    return { success: true };
  };

  const register = async (name: string, email: string, pass: string) => {
    if (!name || !email || !pass) return { success: false, error: 'Tous les champs sont requis.' };
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name,
      email,
      currency: 'EUR',
      monthlyIncome: 3000,
      hasCompletedOnboarding: false,
      plan: 'free',
      planBillingCycle: 'monthly',
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    setIsAuthenticated(true);
    addAudit('USER_REGISTER', `Création du compte pour ${email}`);
    setCurrentView('dashboard');
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    addAudit('USER_LOGOUT', 'Déconnexion volontaire de session');
    setCurrentView('landing');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    addAudit('PROFILE_UPDATE', `Mise à jour des informations de profil (${Object.keys(updates).join(', ')})`);
  };

  const completeOnboarding = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data, hasCompletedOnboarding: true };
    setUser(updated);
    addAudit('ONBOARDING_COMPLETED', 'Assistant de démarrage finalisé');
  };

  // Account operations
  const addAccount = (acc: Omit<FinancialAccount, 'id' | 'lastSyncedAt'>) => {
    const newAccount: FinancialAccount = {
      ...acc,
      id: `acc_${Date.now()}`,
      lastSyncedAt: new Date().toISOString(),
    };
    setAccounts(prev => [...prev, newAccount]);
    addAudit('ACCOUNT_CREATED', `Ajout du compte "${acc.name}" (${acc.institution})`);
  };

  const deleteAccount = (id: string) => {
    const found = accounts.find(a => a.id === id);
    setAccounts(prev => prev.filter(a => a.id !== id));
    addAudit('ACCOUNT_DELETED', `Suppression du compte "${found?.name || id}"`);
  };

  // Transaction operations
  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    };
    setTransactions(prev => [newTx, ...prev]);

    // Update account balance
    setAccounts(prev =>
      prev.map(acc => {
        if (acc.id === tx.accountId) {
          const delta = tx.type === 'income' ? tx.amount : -tx.amount;
          return { ...acc, balance: acc.balance + delta };
        }
        return acc;
      })
    );

    addAudit('TRANSACTION_CREATED', `Opération "${tx.label}" (${tx.amount} €)`);
  };

  const editTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map(tx => (tx.id === id ? { ...tx, ...updates } : tx))
    );
    addAudit('TRANSACTION_UPDATED', `Modification de l'opération ${id}`);
  };

  const deleteTransaction = (id: string) => {
    const target = transactions.find(t => t.id === id);
    setTransactions(prev => prev.filter(tx => tx.id !== id));
    if (target) {
      // Revert account balance
      setAccounts(prev =>
        prev.map(acc => {
          if (acc.id === target.accountId) {
            const revertDelta = target.type === 'income' ? -target.amount : target.amount;
            return { ...acc, balance: acc.balance + revertDelta };
          }
          return acc;
        })
      );
      addAudit('TRANSACTION_DELETED', `Suppression de l'opération "${target.label}" (${target.amount} €)`);
    }
  };

  const exportTransactionsCSV = () => {
    const headers = ['ID', 'Date', 'Libelle', 'Categorie', 'Montant', 'Type', 'Compte', 'Source', 'Notes'];
    const rows = transactions.map(t => [
      t.id,
      t.date,
      `"${t.label.replace(/"/g, '""')}"`,
      `"${t.category}"`,
      t.amount.toFixed(2),
      t.type,
      `"${t.accountName}"`,
      t.source,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `finova_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addAudit('DATA_EXPORT_CSV', 'Export des transactions au format CSV');
  };

  // Budgets
  const updateBudgetLimit = (id: string, plannedAmount: number) => {
    setBudgetCategories(prev =>
      prev.map(b => (b.id === id ? { ...b, plannedAmount } : b))
    );
    addAudit('BUDGET_UPDATED', `Plafond budgétaire ajusté à ${plannedAmount} €`);
  };

  const addBudgetCategory = (cat: Omit<BudgetCategory, 'id'>) => {
    const newCat: BudgetCategory = {
      ...cat,
      id: `b_${Date.now()}`,
    };
    setBudgetCategories(prev => [...prev, newCat]);
    addAudit('BUDGET_CATEGORY_ADDED', `Nouvelle catégorie de budget "${cat.category}"`);
  };

  // Savings Goals
  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id' | 'currentAmount'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: `goal_${Date.now()}`,
      currentAmount: 0,
    };
    setSavingsGoals(prev => [...prev, newGoal]);
    addAudit('SAVINGS_GOAL_CREATED', `Création objectif d'épargne "${goal.title}"`);
  };

  const depositToSavingsGoal = (goalId: string, amount: number) => {
    setSavingsGoals(prev =>
      prev.map(g => (g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g))
    );
    addAudit('SAVINGS_DEPOSIT', `Alimentation de ${amount} € sur l'objectif d'épargne`);
  };

  const editSavingsGoal = (id: string, updates: Partial<SavingsGoal>) => {
    setSavingsGoals(prev =>
      prev.map(g => (g.id === id ? { ...g, ...updates } : g))
    );
    addAudit('SAVINGS_GOAL_UPDATED', `Mise à jour de l'objectif d'épargne`);
  };

  const deleteSavingsGoal = (id: string) => {
    const found = savingsGoals.find(g => g.id === id);
    setSavingsGoals(prev => prev.filter(g => g.id !== id));
    addAudit('SAVINGS_GOAL_DELETED', `Suppression de l'objectif "${found?.title || id}"`);
  };

  // Investment Positions
  const addInvestmentPosition = (pos: Omit<InvestmentPosition, 'id' | 'lastUpdated'>) => {
    const newPos: InvestmentPosition = {
      ...pos,
      id: `pos_${Date.now()}`,
      lastUpdated: new Date().toLocaleDateString('fr-FR') + ' ' + new Date().toLocaleTimeString('fr-FR'),
    };
    setInvestmentPositions(prev => [...prev, newPos]);
    addAudit('INVESTMENT_POSITION_ADDED', `Ajout de la position ${pos.symbol} (${pos.name})`);
  };

  const editInvestmentPosition = (id: string, updates: Partial<InvestmentPosition>) => {
    setInvestmentPositions(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
    addAudit('INVESTMENT_POSITION_UPDATED', `Position d'investissement mise à jour`);
  };

  const deleteInvestmentPosition = (id: string) => {
    const found = investmentPositions.find(p => p.id === id);
    setInvestmentPositions(prev => prev.filter(p => p.id !== id));
    addAudit('INVESTMENT_POSITION_DELETED', `Vente ou retrait de la position ${found?.symbol}`);
  };

  // Watchlist
  const addToWatchlist = (item: Omit<WatchlistItem, 'id'>) => {
    const newItem: WatchlistItem = {
      ...item,
      id: `w_${Date.now()}`,
    };
    setWatchlist(prev => [...prev, newItem]);
    addAudit('WATCHLIST_ADDED', `Ajout de ${item.symbol} à la watchlist`);
  };

  const removeFromWatchlist = (id: string) => {
    setWatchlist(prev => prev.filter(w => w.id !== id));
    addAudit('WATCHLIST_REMOVED', `Retrait de l'actif de la watchlist`);
  };

  // Finova AI Chat
  const sendAiMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...chatMessages, userMessage];
    setChatMessages(newMessages);
    setIsAiThinking(true);

    try {
      // Assemble aggregated financial snapshot (data minimization: no passwords, no full bank account numbers)
      const topSpentCat = budgetCategories
        .map(b => {
          const spent = transactions
            .filter(t => t.type === 'expense' && t.category === b.category)
            .reduce((s, t) => s + t.amount, 0);
          return { category: b.category, spent };
        })
        .sort((a, b) => b.spent - a.spent)[0]?.category || 'Logement';

      const financialContext = {
        userName: user?.name,
        monthlyIncome,
        monthlyExpenses,
        savingsCapacity,
        savingsRate,
        totalNetWorth,
        topCategory: topSpentCat,
        portfolioValuation: totalPortfolioValue,
        savingsGoals: savingsGoals.map(g => ({
          title: g.title,
          current: g.currentAmount,
          target: g.targetAmount,
          monthly: g.monthlyContribution,
        })),
        accountsSummary: accounts.map(a => ({
          type: a.type,
          name: a.name,
          balance: a.balance,
        })),
      };

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.slice(-8), // Send recent context
          financialContext,
        }),
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la communication avec l\'assistant IA.');
      }

      const data = await res.json();
      const aiReply: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: data.timestamp || new Date().toISOString(),
        source: data.source === 'gemini-3.8-flash' ? 'Google Gemini 3.8 Flash' : 'Finova Financial Engine',
      };

      setChatMessages(prev => [...prev, aiReply]);
      addAudit('AI_CHAT_MESSAGE', `Interaction avec Finova AI (${messageText.slice(0, 30)}...)`);
    } catch (error: any) {
      console.error('AI chat error:', error);
      const fallbackReply: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        role: 'assistant',
        content: `Désolé, une anomalie temporaire de connexion est survenue. Veuillez vérifier votre réseau ou réessayer dans un instant.`,
        timestamp: new Date().toISOString(),
        source: 'Finova Error Handler',
      };
      setChatMessages(prev => [...prev, fallbackReply]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const clearAiChat = () => {
    setChatMessages([]);
    addAudit('AI_CHAT_CLEARED', 'Historique de conversation réinitialisé');
  };

  // Banking
  const syncAllBanks = async () => {
    addAudit('BANK_SYNC_START', 'Synchronisation globale des comptes DSP2 initiée');
    await fetch('/api/banking/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bankId: 'all', institutionName: 'Agrégation multi-banques' }),
    });

    const now = new Date().toISOString();
    setConnectedBanks(prev =>
      prev.map(b => ({ ...b, lastSyncAt: now, status: 'active' }))
    );
    setAccounts(prev =>
      prev.map(a => ({ ...a, lastSyncedAt: now }))
    );
    addAudit('BANK_SYNC_COMPLETE', 'Synchronisation bancaire DSP2 terminée');
  };

  const connectBank = async (bankName: string) => {
    addAudit('BANK_CONNECT_REQUEST', `Autorisation Open Banking DSP2 pour ${bankName}`);
    const newBank: ConnectedBank = {
      id: `bnk_${Date.now()}`,
      name: bankName,
      logo: '🏛️',
      status: 'active',
      connectedAt: new Date().toISOString(),
      lastSyncAt: new Date().toISOString(),
      accountCount: 1,
    };
    setConnectedBanks(prev => [...prev, newBank]);

    // Also add a connected account for this bank
    const newAcc: FinancialAccount = {
      id: `acc_${Date.now()}`,
      name: `Compte ${bankName}`,
      type: 'checking',
      institution: bankName,
      balance: Math.floor(1200 + Math.random() * 3000),
      currency: 'EUR',
      accountNumberMasked: 'FR76 •••• ' + Math.floor(1000 + Math.random() * 9000),
      lastSyncedAt: new Date().toISOString(),
      isExternalSynced: true,
      color: '#10B981',
    };
    setAccounts(prev => [...prev, newAcc]);
    addAudit('BANK_CONNECT_SUCCESS', `Connexion DSP2 établie pour ${bankName}`);
  };

  const disconnectBank = (id: string) => {
    const found = connectedBanks.find(b => b.id === id);
    setConnectedBanks(prev => prev.filter(b => b.id !== id));
    addAudit('BANK_REVOKED', `Révocation de l'accès bancaire ${found?.name || id}`);
  };

  // Billing
  const upgradeSubscription = async (planId: 'free' | 'premium' | 'family', cycle: 'monthly' | 'yearly') => {
    const res = await fetch('/api/billing/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId, billingCycle: cycle }),
    });
    const data = await res.json();
    if (user) {
      setUser({ ...user, plan: planId, planBillingCycle: cycle });
    }
    addAudit('SUBSCRIPTION_UPDATED', `Passage au forfait ${planId.toUpperCase()} (${cycle})`);
    return data;
  };

  // Export JSON (RGPD)
  const exportAllUserDataJSON = () => {
    const fullArchive = {
      exportDate: new Date().toISOString(),
      rgpdVersion: '2016/679 - Article 20 (Portabilité des données)',
      user,
      accounts,
      transactions,
      budgetCategories,
      savingsGoals,
      investmentPositions,
      watchlist,
      connectedBanks,
      auditLogs,
    };

    const blob = new Blob([JSON.stringify(fullArchive, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finova_donnees_personnelles_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addAudit('RGPD_DATA_PORTABILITY_EXPORT', 'Exportation complète des données personnelles au format JSON');
  };

  // Reset to default
  const resetToDefaultData = () => {
    setUser(initialUserProfile);
    setAccounts(initialAccounts);
    setTransactions(initialTransactions);
    setBudgetCategories(initialBudgetCategories);
    setSavingsGoals(initialSavingsGoals);
    setInvestmentPositions(initialInvestmentPositions);
    setWatchlist(initialWatchlist);
    setConnectedBanks(initialConnectedBanks);
    localStorage.removeItem(STORAGE_KEY);
    addAudit('SYSTEM_RESET', 'Réinitialisation des données de démonstration');
  };

  return (
    <FinancialContext.Provider
      value={{
        currentView,
        setCurrentView,
        theme,
        toggleTheme,
        user,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        completeOnboarding,
        accounts,
        addAccount,
        deleteAccount,
        totalNetWorth,
        monthlyIncome,
        monthlyExpenses,
        savingsCapacity,
        savingsRate,
        transactions,
        addTransaction,
        editTransaction,
        deleteTransaction,
        exportTransactionsCSV,
        budgetCategories,
        updateBudgetLimit,
        addBudgetCategory,
        savingsGoals,
        addSavingsGoal,
        depositToSavingsGoal,
        editSavingsGoal,
        deleteSavingsGoal,
        investmentPositions,
        addInvestmentPosition,
        editInvestmentPosition,
        deleteInvestmentPosition,
        totalPortfolioValue,
        totalPortfolioCost,
        totalUnrealizedGain,
        totalUnrealizedGainPercent,
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        chatMessages,
        isAiThinking,
        sendAiMessage,
        clearAiChat,
        connectedBanks,
        syncAllBanks,
        connectBank,
        disconnectBank,
        upgradeSubscription,
        auditLogs,
        exportAllUserDataJSON,
        resetToDefaultData,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};
