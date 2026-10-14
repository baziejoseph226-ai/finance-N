import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Transaction } from '../../types';
import {
  Download,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  ArrowUpDown,
  Calendar,
  AlertTriangle,
  Receipt,
  FileSpreadsheet,
} from 'lucide-react';

interface TransactionsViewProps {
  onOpenAddTx: () => void;
  onEditTx: (tx: Transaction) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({ onOpenAddTx, onEditTx }) => {
  const {
    transactions,
    accounts,
    budgetCategories,
    deleteTransaction,
    exportTransactionsCSV,
    user,
  } = useFinancial();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter logic
  const filtered = transactions.filter(tx => {
    if (selectedType !== 'all' && tx.type !== selectedType) return false;
    if (selectedCategory !== 'all' && tx.category !== selectedCategory) return false;
    if (selectedAccount !== 'all' && tx.accountId !== selectedAccount) return false;
    if (
      searchTerm &&
      !tx.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !tx.category.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !tx.accountName.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Sort logic
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'desc'
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime();
    } else {
      return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
    }
  });

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const totalFilteredAmount = sorted.reduce((sum, tx) => {
    return sum + (tx.type === 'income' ? tx.amount : -tx.amount);
  }, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Receipt className="w-7 h-7 text-emerald-400" />
            <span>Opérations & Flux Financiers</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Consultez, filtrez et exportez l'historique complet de vos écritures bancaires et manuelles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={exportTransactionsCSV}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-2"
            title="Exporter l'ensemble des écritures au format CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Exporter CSV</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddTx}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une opération</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Rechercher par libellé ou note..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Tous les types d'opérations</option>
            <option value="expense">Dépenses uniquement</option>
            <option value="income">Revenus / Crédits uniquement</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Toutes les catégories</option>
            <option value="Revenus">Revenus / Salaire</option>
            {budgetCategories.map(b => (
              <option key={b.id} value={b.category}>
                {b.category}
              </option>
            ))}
          </select>

          {/* Account Filter */}
          <select
            value={selectedAccount}
            onChange={e => setSelectedAccount(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Tous les comptes</option>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Summary Badge */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
          <span>
            {sorted.length} opération{sorted.length > 1 ? 's' : ''} trouvée{sorted.length > 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-2">
            <span>Solde net du filtre :</span>
            <span className={`font-mono font-bold ${totalFilteredAmount >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatCurrency(totalFilteredAmount, user?.currency, true)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="p-6 rounded-2xl bg-[#111C2E] border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th
                  onClick={() => toggleSort('date')}
                  className="py-3 px-3 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Date</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">Libellé</th>
                <th className="py-3 px-3">Catégorie</th>
                <th className="py-3 px-3">Compte</th>
                <th className="py-3 px-3">Source</th>
                <th
                  onClick={() => toggleSort('amount')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Montant</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    Aucune transaction trouvée pour ces filtres.
                  </td>
                </tr>
              ) : (
                sorted.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3 text-slate-400 font-mono whitespace-nowrap">
                      {formatDate(tx.date)}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-white">
                      <div>{tx.label}</div>
                      {tx.notes && <div className="text-[11px] text-slate-400 font-normal">{tx.notes}</div>}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700/60">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-300 whitespace-nowrap font-medium">
                      {tx.accountName}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
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
                      className={`py-3.5 px-3 text-right font-mono font-bold whitespace-nowrap ${
                        tx.type === 'income' ? 'text-emerald-400' : 'text-slate-100'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}
                      {formatCurrency(tx.amount, user?.currency)}
                    </td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEditTx(tx)}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 transition-colors"
                          title="Modifier l'opération"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(tx.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                          title="Supprimer l'opération"
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
                Cette action supprimera définitivement cette écriture comptable et réajustera le solde du compte associé.
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
