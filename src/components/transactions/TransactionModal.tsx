import React, { useState, useEffect } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { Transaction, TransactionType } from '../../types';
import { X, Check, AlertCircle } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionToEdit?: Transaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  transactionToEdit,
}) => {
  const { accounts, addTransaction, editTransaction, budgetCategories } = useFinancial();

  const [accountId, setAccountId] = useState('');
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState('Alimentation');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (transactionToEdit) {
      setAccountId(transactionToEdit.accountId);
      setLabel(transactionToEdit.label);
      setAmount(transactionToEdit.amount);
      setType(transactionToEdit.type);
      setCategory(transactionToEdit.category);
      setDate(transactionToEdit.date);
      setNotes(transactionToEdit.notes || '');
    } else {
      if (accounts.length > 0) {
        setAccountId(accounts[0].id);
      }
      setLabel('');
      setAmount(0);
      setType('expense');
      setCategory('Alimentation');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
    setErrorMsg('');
  }, [transactionToEdit, accounts, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) {
      setErrorMsg('Veuillez renseigner un libellé.');
      return;
    }
    if (amount <= 0) {
      setErrorMsg('Le montant doit être supérieur à 0.');
      return;
    }

    const selectedAccount = accounts.find(a => a.id === accountId) || accounts[0];

    if (transactionToEdit) {
      editTransaction(transactionToEdit.id, {
        accountId,
        accountName: selectedAccount?.name || 'Compte principal',
        label: label.trim(),
        amount: Number(amount),
        type,
        category,
        date,
        notes: notes.trim(),
      });
    } else {
      addTransaction({
        accountId: selectedAccount?.id || 'acc_01',
        accountName: selectedAccount?.name || 'Compte principal',
        label: label.trim(),
        amount: Number(amount),
        type,
        category,
        date,
        source: 'manual',
        notes: notes.trim(),
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#0F172A] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">
            {transactionToEdit ? 'Modifier l\'opération' : 'Enregistrer une opération'}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Type Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-slate-800/80 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Dépense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                type === 'income'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Revenu / Entrée
            </button>
          </div>

          {/* Amount & Currency */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">Montant (€)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              value={amount || ''}
              onChange={e => setAmount(parseFloat(e.target.value) || 0)}
              placeholder="0,00"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-lg font-bold font-mono text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Label */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">Libellé de l'opération</label>
            <input
              type="text"
              required
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="Ex: Supermarché Monoprix, Salaire, Restaurant..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Account */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">Compte débité / crédité</label>
              <select
                value={accountId}
                onChange={e => setAccountId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.institution})
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">Catégorie budgétaire</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {type === 'income' ? (
                  <>
                    <option value="Revenus">Salaire / Revenus réguliers</option>
                    <option value="Investissements">Dividendes & Plus-values</option>
                    <option value="Vente">Vente / Remboursement</option>
                    <option value="Autre">Autre entrée d'argent</option>
                  </>
                ) : (
                  budgetCategories.map(b => (
                    <option key={b.id} value={b.category}>
                      {b.category}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">Date de l'opération</label>
            <input
              type="date"
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">Notes ou justificatif (facultatif)</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ex: Facture #891, Déjeuner professionnel..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <Check className="w-4 h-4" />
              <span>{transactionToEdit ? 'Mettre à jour' : 'Enregistrer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
