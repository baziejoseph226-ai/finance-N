import React, { useState } from 'react';
import { FinancialProvider, useFinancial } from './context/FinancialContext';
import { LandingPage } from './components/landing/LandingPage';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardView } from './components/dashboard/DashboardView';
import { TransactionsView } from './components/transactions/TransactionsView';
import { BudgetView } from './components/budget/BudgetView';
import { SavingsView } from './components/savings/SavingsView';
import { InvestmentsView } from './components/investments/InvestmentsView';
import { FinovaAiView } from './components/ai/FinovaAiView';
import { BankingView } from './components/banking/BankingView';
import { BillingView } from './components/billing/BillingView';
import { SettingsView } from './components/settings/SettingsView';
import { AdminView } from './components/admin/AdminView';
import { TransactionModal } from './components/transactions/TransactionModal';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingModal } from './components/auth/OnboardingModal';
import { LegalModal, LegalModalType } from './components/common/LegalModal';
import { Transaction } from './types';

function MainAppContent() {
  const { currentView, setCurrentView, user, isAuthenticated } = useFinancial();

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [txToEdit, setTxToEdit] = useState<Transaction | null>(null);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<LegalModalType>(null);

  // Trigger onboarding if not completed and authenticated
  React.useEffect(() => {
    if (isAuthenticated && user && !user.hasCompletedOnboarding) {
      setOnboardingOpen(true);
    }
  }, [isAuthenticated, user]);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleOpenAddTx = () => {
    setTxToEdit(null);
    setTxModalOpen(true);
  };

  const handleEditTx = (tx: Transaction) => {
    setTxToEdit(tx);
    setTxModalOpen(true);
  };

  return (
    <>
      {currentView === 'landing' ? (
        <LandingPage
          onOpenAuth={handleOpenAuth}
          onOpenLegalModal={type => setLegalModalType(type)}
        />
      ) : (
        <AppLayout onOpenQuickAddTx={handleOpenAddTx}>
          {currentView === 'dashboard' && (
            <DashboardView
              onOpenAddTx={handleOpenAddTx}
              onEditTx={handleEditTx}
            />
          )}
          {currentView === 'transactions' && (
            <TransactionsView
              onOpenAddTx={handleOpenAddTx}
              onEditTx={handleEditTx}
            />
          )}
          {currentView === 'budgets' && <BudgetView />}
          {currentView === 'savings' && <SavingsView />}
          {currentView === 'investments' && <InvestmentsView />}
          {currentView === 'ai' && <FinovaAiView />}
          {currentView === 'banking' && <BankingView />}
          {currentView === 'billing' && <BillingView />}
          {currentView === 'settings' && <SettingsView />}
          {currentView === 'admin' && <AdminView />}
        </AppLayout>
      )}

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />

      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
      />

      <TransactionModal
        isOpen={txModalOpen}
        onClose={() => {
          setTxModalOpen(false);
          setTxToEdit(null);
        }}
        transactionToEdit={txToEdit}
      />

      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </>
  );
}

export default function App() {
  return (
    <FinancialProvider>
      <MainAppContent />
    </FinancialProvider>
  );
}
