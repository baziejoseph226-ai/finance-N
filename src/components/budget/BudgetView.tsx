import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { BudgetCategory } from '../../types';
import {
  PieChart,
  Plus,
  Edit2,
  AlertTriangle,
  CheckCircle2,
  Flame,
  Calendar,
  Layers,
  ArrowRight,
  TrendingDown,
  Info,
} from 'lucide-react';

export const BudgetView: React.FC = () => {
  const {
    budgetCategories,
    updateBudgetLimit,
    addBudgetCategory,
    transactions,
    monthlyIncome,
    monthlyExpenses,
    user,
  } = useFinancial();

  const [selectedMonth, setSelectedMonth] = useState('2026-10');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [newLimitValue, setNewLimitValue] = useState<number>(0);
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatLimit, setNewCatLimit] = useState<number>(150);

  // Calculate spent amounts for each category
  const categoriesWithSpending = budgetCategories.map(cat => {
    const spent = transactions
      .filter(t => t.type === 'expense' && t.category === cat.category)
      .reduce((acc, t) => acc + t.amount, 0);

    const percent = cat.plannedAmount > 0 ? Math.round((spent / cat.plannedAmount) * 100) : 0;
    const remaining = cat.plannedAmount - spent;

    return {
      ...cat,
      spent,
      percent,
      remaining,
      isExceeded: percent > 100,
      isWarning: percent >= 80 && percent <= 100,
    };
  });

  const totalBudgetPlanned = budgetCategories.reduce((acc, b) => acc + b.plannedAmount, 0);
  const totalBudgetSpent = categoriesWithSpending.reduce((acc, b) => acc + b.spent, 0);
  const totalBudgetRemaining = totalBudgetPlanned - totalBudgetSpent;

  // Over-budget count
  const overBudgetCount = categoriesWithSpending.filter(c => c.isExceeded).length;
  const warningCount = categoriesWithSpending.filter(c => c.isWarning).length;

  // Recurring subscriptions detected
  const recurringExpenses = [
    { label: 'Loyer Résidence Principale', amount: 880, cat: 'Logement', day: '10 de chaque mois' },
    { label: 'Pass Navigo Mensuel', amount: 86.4, cat: 'Transport', day: '08 de chaque mois' },
    { label: 'Spotify & Netflix Streaming', amount: 29.98, cat: 'Abonnements', day: '05 de chaque mois' },
    { label: 'Abonnement Salle de Sport', amount: 34.9, cat: 'Loisirs', day: '15 de chaque mois' },
  ];

  const handleEditLimitSubmit = (id: string) => {
    if (newLimitValue >= 0) {
      updateBudgetLimit(id, newLimitValue);
    }
    setEditingCatId(null);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim() || newCatLimit <= 0) return;
    const palette = ['#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#06B6D4', '#64748B'];
    const randomColor = palette[Math.floor(Math.random() * palette.length)];

    addBudgetCategory({
      category: newCatName.trim(),
      plannedAmount: newCatLimit,
      color: randomColor,
      iconName: 'MoreHorizontal',
    });
    setNewCatName('');
    setNewCatLimit(150);
    setShowAddCatModal(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Month Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <PieChart className="w-7 h-7 text-emerald-400" />
            <span>Gestion du Budget Mensuel</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Fixez vos plafonds cibles, suivez les dépassements et maîtrisez vos dépenses récurrentes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs text-white">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold text-white focus:outline-none cursor-pointer"
            >
              <option value="2026-10" className="bg-slate-900">Octobre 2026 (En cours)</option>
              <option value="2026-09" className="bg-slate-900">Septembre 2026</option>
              <option value="2026-08" className="bg-slate-900">Août 2026</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setShowAddCatModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une catégorie</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-2">
          <div className="text-xs text-slate-400 font-semibold uppercase">Total des plafonds alloués</div>
          <div className="text-2xl font-black text-white font-mono">
            {formatCurrency(totalBudgetPlanned, user?.currency)}
          </div>
          <div className="text-[11px] text-slate-400">
            Couvre 100% de vos charges budgétées
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-2">
          <div className="text-xs text-slate-400 font-semibold uppercase">Dépenses réelles constatées</div>
          <div className="text-2xl font-black text-rose-400 font-mono">
            {formatCurrency(totalBudgetSpent, user?.currency)}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span>Consommation globale :</span>
            <span className="font-bold text-slate-200">
              {totalBudgetPlanned > 0 ? Math.round((totalBudgetSpent / totalBudgetPlanned) * 100) : 0}%
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-2">
          <div className="text-xs text-slate-400 font-semibold uppercase">Marge budgétaire restante</div>
          <div className={`text-2xl font-black font-mono ${totalBudgetRemaining >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatCurrency(totalBudgetRemaining, user?.currency)}
          </div>
          <div className="text-[11px] text-slate-400">
            {overBudgetCount > 0 ? (
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {overBudgetCount} catégorie(s) en dépassement
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Tous les plafonds sont respectés
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Category Progress Cards Grid */}
      <div className="p-6 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-white">Comparatif : Prévisionnel vs Réalisé</h2>
            <p className="text-xs text-slate-400">Surveillez vos jauges d'alerte (&lt;80% vert, 80-100% orange, &gt;100% alerte)</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Conforme
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Attention
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Dépassement
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoriesWithSpending.map(cat => {
            const isEditing = editingCatId === cat.id;

            return (
              <div
                key={cat.id}
                className={`p-4 rounded-xl border transition-all ${
                  cat.isExceeded
                    ? 'bg-rose-500/5 border-rose-500/40'
                    : cat.isWarning
                    ? 'bg-amber-500/5 border-amber-500/30'
                    : 'bg-slate-800/40 border-slate-700/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="font-bold text-white text-sm">{cat.category}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {cat.isExceeded && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        Dépassement
                      </span>
                    )}
                    {cat.isWarning && !cat.isExceeded && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Seuil 80%
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setEditingCatId(cat.id);
                        setNewLimitValue(cat.plannedAmount);
                      }}
                      className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-700/50"
                      title="Modifier le plafond"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Spending Numbers */}
                <div className="flex items-baseline justify-between text-xs my-2">
                  <span className="font-mono text-slate-200">
                    Dépensé : <strong className="text-white text-sm">{formatCurrency(cat.spent, user?.currency)}</strong>
                  </span>

                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={newLimitValue}
                        onChange={e => setNewLimitValue(Number(e.target.value))}
                        className="w-20 bg-slate-900 border border-emerald-500 rounded px-2 py-0.5 text-xs font-mono text-white"
                        min={0}
                      />
                      <button
                        type="button"
                        onClick={() => handleEditLimitSubmit(cat.id)}
                        className="px-2 py-0.5 bg-emerald-500 text-slate-950 rounded text-[10px] font-bold"
                      >
                        OK
                      </button>
                    </div>
                  ) : (
                    <span className="font-mono text-slate-400">
                      Plafond : {formatCurrency(cat.plannedAmount, user?.currency)}
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden my-2">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      cat.isExceeded
                        ? 'bg-rose-500'
                        : cat.isWarning
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, cat.percent)}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-400">
                  <span>{cat.percent}% consommé</span>
                  <span>
                    {cat.remaining >= 0 ? (
                      <span className="text-emerald-400">Reste {formatCurrency(cat.remaining, user?.currency)}</span>
                    ) : (
                      <span className="text-rose-400">Excès de {formatCurrency(Math.abs(cat.remaining), user?.currency)}</span>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recurring Subscriptions & Fixed Expenses Tracker */}
      <div className="p-6 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">Dépenses Récurrentes & Abonnements Détectés</h3>
            <p className="text-xs text-slate-400">Prélèvements automatiques identifiés sur vos comptes bancaires</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-300">
            Total fixe : {formatCurrency(recurringExpenses.reduce((s, r) => s + r.amount, 0), user?.currency)} / mois
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recurringExpenses.map((rec, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1.5 text-xs">
              <div className="font-bold text-white truncate">{rec.label}</div>
              <div className="text-slate-400 text-[11px]">{rec.cat} • {rec.day}</div>
              <div className="text-base font-mono font-bold text-emerald-400 pt-1">
                {formatCurrency(rec.amount, user?.currency)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#0F172A] border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100 space-y-4">
            <h4 className="text-base font-bold text-white">Créer une catégorie budgétaire</h4>
            <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Nom de la catégorie</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Animaux de compagnie, Bricolage..."
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Plafond mensuel alloué (€)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={newCatLimit}
                  onChange={e => setNewCatLimit(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCatModal(false)}
                  className="px-3 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Créer le plafond
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
