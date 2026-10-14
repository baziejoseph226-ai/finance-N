import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { formatCurrency, calculateEstimatedMonthsLeft, formatDate } from '../../utils/formatters';
import { SavingsGoal } from '../../types';
import {
  Target,
  Plus,
  Coins,
  Edit2,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

export const SavingsView: React.FC = () => {
  const {
    savingsGoals,
    addSavingsGoal,
    depositToSavingsGoal,
    editSavingsGoal,
    deleteSavingsGoal,
    user,
  } = useFinancial();

  const [depositModalGoal, setDepositModalGoal] = useState<SavingsGoal | null>(null);
  const [depositAmount, setDepositAmount] = useState<number>(100);

  const [showAddModal, setShowAddModal] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState<number>(5000);
  const [goalContribution, setGoalContribution] = useState<number>(250);
  const [goalDate, setGoalDate] = useState('2027-12-31');
  const [goalPriority, setGoalPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [goalCategory, setGoalCategory] = useState('Projet personnel');

  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);

  const totalSaved = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositModalGoal || depositAmount <= 0) return;
    depositToSavingsGoal(depositModalGoal.id, depositAmount);
    setDepositModalGoal(null);
    setDepositAmount(100);
  };

  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim() || goalTarget <= 0) return;

    const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4'];
    const chosenColor = colors[savingsGoals.length % colors.length];

    if (editingGoal) {
      editSavingsGoal(editingGoal.id, {
        title: goalTitle.trim(),
        targetAmount: Number(goalTarget),
        monthlyContribution: Number(goalContribution),
        targetDate: goalDate,
        priority: goalPriority,
        category: goalCategory,
      });
      setEditingGoal(null);
    } else {
      addSavingsGoal({
        title: goalTitle.trim(),
        targetAmount: Number(goalTarget),
        monthlyContribution: Number(goalContribution),
        targetDate: goalDate,
        priority: goalPriority,
        category: goalCategory,
        color: chosenColor,
      });
    }

    setGoalTitle('');
    setGoalTarget(5000);
    setGoalContribution(250);
    setShowAddModal(false);
  };

  const startEdit = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setGoalTitle(goal.title);
    setGoalTarget(goal.targetAmount);
    setGoalContribution(goal.monthlyContribution);
    setGoalDate(goal.targetDate || '');
    setGoalPriority(goal.priority);
    setGoalCategory(goal.category);
    setShowAddModal(true);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Target className="w-7 h-7 text-emerald-400" />
            <span>Objectifs d'Épargne & Projets</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Programmez vos ambitions de vie, suivez l'effort mensuel nécessaire et visualisez vos dates d'atteinte.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingGoal(null);
            setGoalTitle('');
            setShowAddModal(true);
          }}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Créer un objectif</span>
        </button>
      </div>

      {/* Global Progress Banner */}
      <div className="p-6 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">Total épargné sur vos projets</div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
              {formatCurrency(totalSaved, user?.currency)}
              <span className="text-sm font-normal text-slate-400 ml-2">
                / {formatCurrency(totalTarget, user?.currency)} (visé)
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-emerald-400 font-mono">{overallProgress}%</div>
            <div className="text-xs text-slate-400">Progression globale consolidée</div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, overallProgress)}%` }}
          />
        </div>

        {/* Regulatory disclaimer */}
        <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-start gap-2.5 text-xs text-slate-400">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Information réglementaire :</strong> Ces objectifs d'épargne constituent des repères de projection personnelle et ne représentent pas des sous-comptes bancaires distincts. Les fonds demeurent sur vos comptes réels agrégés (Livrets ou comptes courants).
          </span>
        </div>
      </div>

      {/* Goals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {savingsGoals.map(goal => {
          const progress = goal.targetAmount > 0 ? Math.round((goal.currentAmount / goal.targetAmount) * 100) : 0;
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
          const estimation = calculateEstimatedMonthsLeft(
            goal.currentAmount,
            goal.targetAmount,
            goal.monthlyContribution
          );

          const priorityBadge = {
            high: { label: 'Priorité Haute', bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30' },
            medium: { label: 'Priorité Moyenne', bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
            low: { label: 'Priorité Basse', bg: 'bg-slate-700/50 text-slate-300 border-slate-600' },
          }[goal.priority];

          return (
            <div
              key={goal.id}
              className="p-6 rounded-2xl bg-[#111C2E] border border-slate-800 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      {goal.category}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">{goal.title}</h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${priorityBadge.bg}`}>
                    {priorityBadge.label}
                  </span>
                </div>

                {/* Amounts */}
                <div className="flex items-baseline justify-between mt-4">
                  <div className="text-xl font-black text-white font-mono">
                    {formatCurrency(goal.currentAmount, user?.currency)}
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    Cible : {formatCurrency(goal.targetAmount, user?.currency)}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden my-2.5">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, progress)}%`,
                      backgroundColor: goal.color || '#10B981',
                    }}
                  />
                </div>

                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span className="font-semibold text-white">{progress}% financé</span>
                  <span>Reste {formatCurrency(remaining, user?.currency)}</span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800/80 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-slate-400">Contribution mensuelle</span>
                    <div className="font-mono font-bold text-emerald-400">
                      {formatCurrency(goal.monthlyContribution, user?.currency)} / mois
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-slate-400">Date d'atteinte estimée</span>
                    <div className="font-semibold text-slate-200 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{estimation.text}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setDepositModalGoal(goal)}
                  className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>Alimenter l'objectif</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(goal)}
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                    title="Modifier"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSavingsGoal(goal.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deposit to Goal Modal */}
      {depositModalGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#0F172A] border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100 space-y-4">
            <h4 className="text-base font-bold text-white">Alimenter « {depositModalGoal.title} »</h4>
            <p className="text-xs text-slate-400">
              Saisissez le montant alloué depuis votre épargne disponible.
            </p>

            <form onSubmit={handleDepositSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Montant à ajouter (€)</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={depositAmount}
                  onChange={e => setDepositAmount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-lg font-bold font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDepositModalGoal(null)}
                  className="px-3 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Valider le versement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#0F172A] border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100 space-y-4">
            <h4 className="text-base font-bold text-white">
              {editingGoal ? 'Modifier l\'objectif' : 'Créer un nouvel objectif d\'épargne'}
            </h4>

            <form onSubmit={handleAddGoalSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Intitulé du projet</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Voyage au Japon, Apport Résidence Principale..."
                  value={goalTitle}
                  onChange={e => setGoalTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Montant cible (€)</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={goalTarget}
                    onChange={e => setGoalTarget(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Effort mensuel (€/mois)</label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={goalContribution}
                    onChange={e => setGoalContribution(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Date cible souhaitée</label>
                  <input
                    type="date"
                    value={goalDate}
                    onChange={e => setGoalDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Priorité</label>
                  <select
                    value={goalPriority}
                    onChange={e => setGoalPriority(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="high">Haute</option>
                    <option value="medium">Moyenne</option>
                    <option value="low">Basse</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Catégorie du projet</label>
                <select
                  value={goalCategory}
                  onChange={e => setGoalCategory(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Sécurité financière">Sécurité financière (Fonds d'urgence)</option>
                  <option value="Immobilier">Immobilier (Apport ou travaux)</option>
                  <option value="Voyages & Découvertes">Voyages & Découvertes</option>
                  <option value="Mobilité">Mobilité (Véhicule / Vélo)</option>
                  <option value="Projet personnel">Projet personnel / Famille</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  {editingGoal ? 'Enregistrer les modifications' : 'Créer l\'objectif'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
