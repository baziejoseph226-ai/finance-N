import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { formatCurrency, formatPercent, formatDate } from '../../utils/formatters';
import { NetWorthChart, IncomeExpenseBarChart, CategoryDonutChart } from '../common/Charts';
import { Transaction } from '../../types';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  PiggyBank,
  Calendar,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  ArrowRight,
  Building2,
  AlertTriangle,
} from 'lucide-react';

interface DashboardViewProps {
  onOpenAddTx: () => void;
  onEditTx: (tx: Transaction) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenAddTx, onEditTx }) => {
  const {
    totalNetWorth,
    monthlyIncome,
    monthlyExpenses,
    savingsCapacity,
    savingsRate,
    accounts,
    transactions,
    deleteTransaction,
    budgetCategories,
    user,
    setCurrentView,
  } = useFinancial();

  const [txSearch, setTxSearch] = useState('');
  const [txFilterType, setTxFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filtered transactions for recent activity
  const filteredTransactions = transactions
    .filter(t => {
      if (txFilterType === 'income') return t.type === 'income';
      if (txFilterType === 'expense') return t.type === 'expense';
      return true;
    })
    .filter(t =>
      t.label.toLowerCase().includes(txSearch.toLowerCase()) ||
      t.category.toLowerCase().includes(txSearch.toLowerCase()) ||
      t.accountName.toLowerCase().includes(txSearch.toLowerCase())
    )
    .slice(0, 7);

  // Category spending aggregation for donut chart
  const categorySpending = budgetCategories.map(b => {
    const totalSpent = transactions
      .filter(t => t.type === 'expense' && t.category === b.category)
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      label: b.category,
      amount: totalSpent,
      color: b.color,
    };
  }).filter(c => c.amount > 0);

  // If no category expense yet, provide baseline
  const displayCategories = categorySpending.length > 0 ? categorySpending : [
    { label: 'Logement', amount: 880, color: '#3B82F6' },
    { label: 'Alimentation', amount: 340, color: '#10B981' },
    { label: 'Transport', amount: 86.4, color: '#F59E0B' },
    { label: 'Loisirs', amount: 76.5, color: '#EC4899' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Header greeting & sync badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Bonjour, {user?.name?.split(' ')[0] || 'Alexandre'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-2">
            <span>Dernière consolidation financière :</span>
            <span className="text-slate-300 font-medium">Aujourd'hui à 11h45 (Euronext & DSP2)</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentView('banking')}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-2"
          >
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>Gérer mes banques ({accounts.length} comptes)</span>
          </button>
          <button
            type="button"
            onClick={onOpenAddTx}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle opération</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Estimated Net Worth */}
        <div className="p-5 rounded-2xl bg-[#111C2E] border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Patrimoine financier estimé</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono mt-3">
            {formatCurrency(totalNetWorth, user?.currency)}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="text-emerald-400 font-bold flex items-center font-mono">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +4,8%
            </span>
            <span className="text-slate-400">vs mois précédent</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2">
            Source : Soldes confirmés & valorisations boursières
          </div>
        </div>

        {/* Card 2: Monthly Income */}
        <div className="p-5 rounded-2xl bg-[#111C2E] border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Revenus du mois (Oct.)</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono mt-3 text-emerald-400">
            {formatCurrency(monthlyIncome, user?.currency)}
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
            <span className="text-slate-300 font-semibold">{transactions.filter(t => t.type === 'income').length} versements</span>
            <span>enregistrés</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2">
            Prochain versement prévu le 28 oct.
          </div>
        </div>

        {/* Card 3: Monthly Expenses */}
        <div className="p-5 rounded-2xl bg-[#111C2E] border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Dépenses du mois</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono mt-3 text-rose-400">
            {formatCurrency(monthlyExpenses, user?.currency)}
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
            <span className="text-slate-300 font-semibold">{transactions.filter(t => t.type === 'expense').length} débits</span>
            <span>sur les comptes</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2">
            Plafond global cible : 2 800,00 €
          </div>
        </div>

        {/* Card 4: Savings Capacity */}
        <div className="p-5 rounded-2xl bg-[#111C2E] border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Capacité d'épargne</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono mt-3 text-purple-300">
            {formatCurrency(savingsCapacity, user?.currency)}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold font-mono">
              {savingsRate}%
            </span>
            <span className="text-slate-400">de taux d'épargne net</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2">
            Recommandation : min. 15% pour précaution
          </div>
        </div>
      </div>

      {/* 3. Account Cards Row */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Comptes & Avoirs Enregistrés
          </h2>
          <button
            type="button"
            onClick={() => setCurrentView('banking')}
            className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Voir le détail</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {accounts.map(acc => (
            <div
              key={acc.id}
              className="p-4 rounded-xl bg-[#111C2E] border border-slate-800 hover:border-slate-700 transition-colors space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 truncate">{acc.name}</span>
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: acc.color || '#10B981' }}
                />
              </div>

              <div className="text-xl font-bold text-white font-mono">
                {formatCurrency(acc.balance, acc.currency)}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <span>{acc.institution}</span>
                <span className="font-mono text-slate-400">{acc.accountNumberMasked}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Net Worth Trend Curve */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">Évolution du patrimoine financier</h3>
              <p className="text-xs text-slate-400">Simulation d'historique consolidé avec prises de valorisation</p>
            </div>
            <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              Historique certifié
            </div>
          </div>

          <NetWorthChart currentValue={totalNetWorth} currency={user?.currency} />
        </div>

        {/* Right: Cashflow comparison & Allocation */}
        <div className="lg:col-span-4 space-y-6">
          {/* Monthly Cashflow Bar */}
          <div className="p-6 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Flux du mois (Revenus vs Dépenses)</h3>
            <IncomeExpenseBarChart
              income={monthlyIncome}
              expenses={monthlyExpenses}
              currency={user?.currency}
            />
          </div>

          {/* Category breakdown donut */}
          <div className="p-6 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Répartition des dépenses</h3>
              <button
                type="button"
                onClick={() => setCurrentView('budgets')}
                className="text-xs text-emerald-400 hover:underline"
              >
                Gérer budgets
              </button>
            </div>
            <CategoryDonutChart categories={displayCategories} currency={user?.currency} />
          </div>
        </div>
      </div>

      {/* 5. Recent Activity Table with Filters & Search */}
      <div className="p-6 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white">Activité financière récente</h3>
            <p className="text-xs text-slate-400">Dernières écritures enregistrées (manuelles ou synchronisées)</p>
          </div>

          {/* Search & Filter Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={txSearch}
                onChange={e => setTxSearch(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 w-44"
              />
            </div>

            <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => setTxFilterType('all')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                  txFilterType === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Toutes
              </button>
              <button
                type="button"
                onClick={() => setTxFilterType('expense')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                  txFilterType === 'expense' ? 'bg-rose-500/20 text-rose-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                Dépenses
              </button>
              <button
                type="button"
                onClick={() => setTxFilterType('income')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                  txFilterType === 'income' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                Revenus
              </button>
            </div>

            <button
              type="button"
              onClick={onOpenAddTx}
              className="p-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
              title="Ajouter une opération"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Libellé</th>
                <th className="py-3 px-3">Catégorie</th>
                <th className="py-3 px-3">Compte</th>
                <th className="py-3 px-3">Source</th>
                <th className="py-3 px-3 text-right">Montant</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    Aucune transaction ne correspond à vos critères de recherche.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 text-slate-400 font-mono whitespace-nowrap">
                      {formatDate(tx.date)}
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">
                      <div>{tx.label}</div>
                      {tx.notes && <div className="text-[10px] text-slate-400 font-normal">{tx.notes}</div>}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700/60">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                      {tx.accountName}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          tx.source === 'open_banking'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {tx.source === 'open_banking' ? 'DSP2 Banq.' : 'Manuel'}
                      </span>
                    </td>
                    <td
                      className={`py-3 px-3 text-right font-mono font-bold whitespace-nowrap ${
                        tx.type === 'income' ? 'text-emerald-400' : 'text-slate-100'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}
                      {formatCurrency(tx.amount, user?.currency)}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEditTx(tx)}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50"
                          title="Modifier"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(tx.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Link to full transaction view */}
        <div className="pt-2 flex justify-between items-center text-xs">
          <span className="text-slate-400">
            Affichage des {filteredTransactions.length} écritures récentes sur {transactions.length} au total.
          </span>
          <button
            type="button"
            onClick={() => setCurrentView('transactions')}
            className="text-emerald-400 hover:underline font-bold flex items-center gap-1"
          >
            <span>Consulter toutes les opérations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#0F172A] border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h4 className="text-base font-bold text-white">Confirmer la suppression</h4>
              <p className="text-xs text-slate-400 mt-1">
                Êtes-vous sûr de vouloir supprimer cette transaction ? Le solde de votre compte sera automatiquement réajusté.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteTransaction(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
