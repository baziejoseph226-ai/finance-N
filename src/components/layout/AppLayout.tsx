import React, { useState } from 'react';
import { useFinancial, AppView } from '../../context/FinancialContext';
import { Logo } from '../common/Logo';
import { formatCurrency } from '../../utils/formatters';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Target,
  TrendingUp,
  Cpu,
  Building2,
  CreditCard,
  Settings,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  Plus,
  Sun,
  Moon,
  Sparkles,
  ChevronRight,
  User,
  Bell,
  RefreshCw,
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  onOpenQuickAddTx: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, onOpenQuickAddTx }) => {
  const {
    currentView,
    setCurrentView,
    user,
    logout,
    theme,
    toggleTheme,
    totalNetWorth,
    syncAllBanks,
  } = useFinancial();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navItems: { view: AppView; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { view: 'dashboard', label: 'Vue d\'ensemble', icon: LayoutDashboard },
    { view: 'transactions', label: 'Opérations & Flux', icon: Receipt },
    { view: 'budgets', label: 'Gestion du Budget', icon: PieChart },
    { view: 'savings', label: 'Objectifs d\'Épargne', icon: Target },
    { view: 'investments', label: 'Portefeuille d\'Actifs', icon: TrendingUp },
    { view: 'ai', label: 'Assistant Finova AI', icon: Cpu, badge: 'IA' },
    { view: 'banking', label: 'Connexions Bancaires', icon: Building2, badge: 'DSP2' },
    { view: 'billing', label: 'Offres & Facturation', icon: CreditCard },
    { view: 'settings', label: 'Paramètres & Sécurité', icon: Settings },
    { view: 'admin', label: 'Espace Administration', icon: ShieldAlert },
  ];

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncAllBanks();
    } finally {
      setIsSyncing(false);
    }
  };

  const currentNavLabel = navItems.find(i => i.view === currentView)?.label || 'Finova Finance';

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-emerald-500/30">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0F172A] border-b border-slate-800 sticky top-0 z-40">
        <Logo size="sm" />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-slate-800 text-slate-400"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800 text-white"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-[#0E1626] border-r border-slate-800/80 flex-shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto">
        <div className="p-6 border-b border-slate-800/80">
          <div className="cursor-pointer" onClick={() => setCurrentView('landing')}>
            <Logo size="md" showSlogan={true} />
          </div>
        </div>

        {/* User Mini Card */}
        <div className="p-4 mx-4 my-3 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">{user?.name || 'Alexandre M.'}</div>
              <div className="text-[11px] text-emerald-400 font-medium capitalize">Forfait {user?.plan || 'Gratuit'}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSync}
            disabled={isSyncing}
            className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Actualiser la synchronisation bancaire"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-2 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                type="button"
                onClick={() => setCurrentView(item.view)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-emerald-500/15 text-emerald-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Help & Logout */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col">
          <div className="p-4 bg-[#0E1626] border-b border-slate-800 flex items-center justify-between">
            <Logo size="sm" />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-4 flex-1 overflow-y-auto space-y-1 bg-[#0E1626]">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  type="button"
                  onClick={() => {
                    setCurrentView(item.view);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold ${
                    isActive ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded text-xs bg-slate-800 text-emerald-400">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
            <div className="pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 font-semibold text-sm"
              >
                <LogOut className="w-5 h-5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-800/80 bg-[#0B1220]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>{currentNavLabel}</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Net Worth Badge on Desktop */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/70 border border-slate-700/60">
              <span className="text-[11px] text-slate-400">Patrimoine consolidé :</span>
              <span className="text-xs font-bold text-white font-mono">{formatCurrency(totalNetWorth, user?.currency)}</span>
            </div>

            {/* Quick Add Transaction Button */}
            <button
              type="button"
              onClick={onOpenQuickAddTx}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Ajouter opération</span>
            </button>

            {/* Finova AI Badge Trigger */}
            <button
              type="button"
              onClick={() => setCurrentView('ai')}
              className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-semibold text-xs transition-all flex items-center gap-1.5"
              title="Ouvrir l'assistant Finova AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Finova AI</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Changer de thème (Clair / Sombre)"
              aria-label="Changer de thème"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1.5 right-1.5 ring-2 ring-[#0B1220]" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-[#111C2E] border border-slate-700 rounded-xl shadow-2xl p-4 z-50 text-xs space-y-3 animate-fade-in">
                  <div className="flex justify-between items-center font-bold text-white border-b border-slate-800 pb-2">
                    <span>Notifications financières</span>
                    <span className="text-[10px] text-emerald-400 font-normal">2 non lues</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                      <div className="font-semibold text-slate-200">Synchronisation BoursoBank réussie</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">8 nouvelles écritures enregistrées via DSP2.</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <div className="font-semibold text-emerald-300">Capacité d'épargne en hausse</div>
                      <div className="text-[11px] text-emerald-200/80 mt-0.5">Vous avez dégagé 36.8% de marge nette ce mois-ci.</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNotifications(false)}
                    className="w-full text-center text-[11px] text-slate-400 hover:text-white pt-1"
                  >
                    Fermer les notifications
                  </button>
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center justify-center hover:ring-2 hover:ring-emerald-500/30 transition-all"
              >
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[#111C2E] border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-xs animate-fade-in">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <div className="font-bold text-white truncate">{user?.name}</div>
                    <div className="text-slate-400 text-[11px] truncate">{user?.email}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentView('settings');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    Profil & Sécurité
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentView('billing');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    Abonnements & Forfait
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentView('admin');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-amber-400 hover:bg-slate-800"
                  >
                    Console d'administration
                  </button>
                  <div className="border-t border-slate-800 my-1" />
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-rose-400 hover:bg-rose-500/10"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
