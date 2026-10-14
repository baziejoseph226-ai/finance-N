import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { CurrencyCode } from '../../types';
import { Sparkles, DollarSign, Wallet, Target, Palette, CheckCircle2, ArrowRight } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { user, completeOnboarding, theme, toggleTheme } = useFinancial();

  const [step, setStep] = useState<number>(1);
  const [currency, setCurrency] = useState<CurrencyCode>(user?.currency || 'EUR');
  const [monthlyIncome, setMonthlyIncome] = useState<number>(user?.monthlyIncome || 3200);
  const [skipIncome, setSkipIncome] = useState<boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'Logement',
    'Alimentation',
    'Transport',
    'Loisirs',
  ]);
  const [primaryGoal, setPrimaryGoal] = useState<string>('Épargne de précaution');

  if (!isOpen) return null;

  const handleFinish = () => {
    completeOnboarding({
      currency,
      monthlyIncome: skipIncome ? 0 : monthlyIncome,
    });
    onClose();
  };

  const categoriesList = [
    'Logement',
    'Alimentation',
    'Transport',
    'Santé',
    'Loisirs',
    'Abonnements',
    'Éducation',
    'Investissements',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#0F172A] border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Progress Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Assistant de démarrage</h3>
              <p className="text-xs text-slate-400">Étape {step} sur 4 — Personnalisation Finova</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`w-6 h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? 'bg-emerald-500 w-8' : s < step ? 'bg-emerald-500/50' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Body */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-emerald-400">
                <DollarSign className="w-6 h-6" />
                <h4 className="text-base font-semibold text-white">Devise principale</h4>
              </div>
              <p className="text-sm text-slate-300">
                Sélectionnez la monnaie dans laquelle vous souhaitez afficher et consolider vos finances personnelles :
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { code: 'EUR', label: 'Euro (€)', desc: 'France & Zone Euro' },
                  { code: 'USD', label: 'Dollar US ($)', desc: 'États-Unis' },
                  { code: 'CHF', label: 'Franc Suisse (CHF)', desc: 'Suisse' },
                  { code: 'GBP', label: 'Livre Sterling (£)', desc: 'Royaume-Uni' },
                ].map(c => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setCurrency(c.code as CurrencyCode)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      currency === c.code
                        ? 'bg-emerald-500/15 border-emerald-500 text-white ring-1 ring-emerald-500'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-bold text-sm">{c.label}</div>
                    <div className="text-xs text-slate-400">{c.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-emerald-400">
                <Wallet className="w-6 h-6" />
                <h4 className="text-base font-semibold text-white">Revenus mensuels approximatifs</h4>
              </div>
              <p className="text-sm text-slate-300">
                Cette donnée permet de calibrer vos seuils d'épargne et de calculer votre taux d'épargne. Elle reste facultative et strictement confidentielle.
              </p>

              {!skipIncome ? (
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-medium text-slate-400">Montant net estimé par mois</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={monthlyIncome}
                      onChange={e => setMonthlyIncome(Number(e.target.value))}
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3 text-white text-lg font-semibold focus:outline-none focus:border-emerald-500"
                      min={0}
                      step={100}
                    />
                    <span className="absolute right-4 top-3.5 text-sm font-semibold text-slate-400">
                      {currency === 'EUR' ? '€ / mois' : '$ / mois'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSkipIncome(true)}
                    className="text-xs text-slate-400 hover:text-slate-200 underline"
                  >
                    Je préfère ne pas renseigner mes revenus pour l'instant
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-center space-y-2">
                  <p className="text-sm text-slate-300">Revenus non renseignés (vous pourrez les définir plus tard).</p>
                  <button
                    type="button"
                    onClick={() => setSkipIncome(false)}
                    className="text-xs text-emerald-400 hover:underline"
                  >
                    Renseigner finalement un montant
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-emerald-400">
                <Target className="w-6 h-6" />
                <h4 className="text-base font-semibold text-white">Postes prioritaires & Objectif d'épargne</h4>
              </div>
              <p className="text-sm text-slate-300">
                Quels sont vos postes de dépenses les plus importants à suivre en priorité ?
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {categoriesList.map(cat => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedCategories(selectedCategories.filter(c => c !== cat));
                        } else {
                          setSelectedCategories([...selectedCategories, cat]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {cat} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                <label className="text-xs font-medium text-slate-400 block mb-2">Votre objectif financier prioritaire :</label>
                <select
                  value={primaryGoal}
                  onChange={e => setPrimaryGoal(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Épargne de précaution">Constituer une épargne de précaution (3 à 6 mois)</option>
                  <option value="Apport immobilier">Préparer un apport pour un achat immobilier</option>
                  <option value="Investissement indiciel">Commencer ou développer mes investissements boursiers</option>
                  <option value="Projet voyage">Financer un voyage ou projet personnel</option>
                  <option value="Optimisation budget">Réduire mes dépenses superflues</option>
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-emerald-400">
                <Palette className="w-6 h-6" />
                <h4 className="text-base font-semibold text-white">Préférence d'affichage</h4>
              </div>
              <p className="text-sm text-slate-300">
                Finova Finance propose un mode sombre premium pour une immersion optimale, ou un mode clair lumineux.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (theme !== 'dark') toggleTheme();
                  }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    theme === 'dark'
                      ? 'bg-emerald-500/15 border-emerald-500 text-white ring-1 ring-emerald-500'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="text-2xl mb-1">🌙</div>
                  <div className="font-bold text-sm">Mode Sombre</div>
                  <div className="text-xs text-slate-400">Bleu nuit & ardoise (#0B1220)</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (theme !== 'light') toggleTheme();
                  }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    theme === 'light'
                      ? 'bg-emerald-500/15 border-emerald-500 text-white ring-1 ring-emerald-500'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="text-2xl mb-1">☀️</div>
                  <div className="font-bold text-sm">Mode Clair</div>
                  <div className="text-xs text-slate-400">Blanc cassé & épuré</div>
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-200">
                  Votre espace sécurisé est prêt. Toutes vos configurations restent modifiables à tout moment dans les Paramètres.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Précédent
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              Continuer
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/30"
            >
              Accéder à mon espace Finova
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
