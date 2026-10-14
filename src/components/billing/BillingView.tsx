import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  CreditCard,
  Check,
  Sparkles,
  ShieldCheck,
  Download,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Zap,
  Users,
} from 'lucide-react';

export const BillingView: React.FC = () => {
  const { user, upgradeSubscription } = useFinancial();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [sessionNotice, setSessionNotice] = useState<{ status: string; message: string } | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'Gratuit',
      priceMonthly: 0,
      priceYearly: 0,
      desc: 'Idéal pour démarrer la gestion manuelle de votre budget personnel.',
      features: [
        'Tableau de bord financier de base',
        'Enregistrement manuel des dépenses & revenus',
        'Objectifs d\'épargne personnels (jusqu\'à 3)',
        'Suivi manuel des investissements cotés',
        'Export des transactions au format CSV standard',
      ],
      isPopular: false,
    },
    {
      id: 'premium',
      name: 'Premium',
      priceMonthly: 9.99,
      priceYearly: 99.0, // 2 mois offerts
      desc: 'Pour les particuliers désireux d\'automatiser et d\'optimiser leur patrimoine.',
      features: [
        'Toutes les fonctionnalités Gratuites',
        'Agrégation bancaire automatique DSP2 illimitée',
        'Assistant Finova AI avec requêtes élargies',
        'Alertes prédictives & détection des dépassements',
        'Graphiques patrimoniaux multi-actifs complets',
        'Calcul automatique des PRU et plus-values latentes',
        'Support client prioritaire sous 24h',
      ],
      isPopular: true,
    },
    {
      id: 'family',
      name: 'Famille',
      priceMonthly: 19.99,
      priceYearly: 199.0,
      desc: 'Gestion partagée et transparente pour les couples et foyers.',
      features: [
        'Toutes les fonctionnalités de l\'offre Premium',
        'Jusqu\'à 5 profils membres avec permissions distinctes',
        'Budgets de dépenses communs et partagés',
        'Objectifs d\'épargne familiaux (logement, enfants)',
        'Vue consolidée du patrimoine global du foyer',
      ],
      isPopular: false,
    },
  ];

  const handleSelectPlan = async (planId: 'free' | 'premium' | 'family') => {
    setLoadingPlan(planId);
    setSessionNotice(null);
    try {
      const res = await upgradeSubscription(planId, billingCycle);
      setSessionNotice({
        status: 'success',
        message: `${res.message || 'Votre abonnement a été mis à jour.'} (Identifiant session : ${res.sessionId || 'cs_test'})`,
      });
    } catch {
      setSessionNotice({
        status: 'error',
        message: 'Impossible de joindre le service de facturation.',
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  // Simulated Invoices
  const invoices = [
    { id: 'INV-2026-003', date: '2026-10-01', amount: user?.plan === 'family' ? 19.99 : 9.99, status: 'Payée' },
    { id: 'INV-2026-002', date: '2026-09-01', amount: user?.plan === 'family' ? 19.99 : 9.99, status: 'Payée' },
    { id: 'INV-2026-001', date: '2026-08-01', amount: user?.plan === 'family' ? 19.99 : 9.99, status: 'Payée' },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-7 h-7 text-emerald-400" />
            <span>Offres, Abonnements & Facturation</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Gérez votre forfait Finova, consultez vos reçus et profitez d'une tarification transparente sans engagement.
          </p>
        </div>

        {/* Current status pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs">
          <span className="text-slate-400">Votre formule actuelle :</span>
          <span className="text-emerald-400 font-bold uppercase">{user?.plan || 'Gratuit'}</span>
        </div>
      </div>

      {sessionNotice && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center gap-2 animate-fade-in ${
            sessionNotice.status === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {sessionNotice.status === 'success' ? (
            <Check className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          )}
          <span>{sessionNotice.message}</span>
        </div>
      )}

      {/* Stripe Sandbox Mode Banner */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
        <HelpCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-amber-300">Environnement de test Stripe Sandbox sécurisé</div>
          <p className="text-amber-200/90 leading-relaxed">
            Finova Finance fonctionne actuellement en mode bac à sable test. Les sessions de paiement sont validées de manière idempotente côté serveur sans débit bancaire réel, vous permettant d'essayer toutes les fonctionnalités immédiatement.
          </p>
        </div>
      </div>

      {/* Monthly / Yearly Billing Cycle Switcher */}
      <div className="flex justify-center items-center gap-3">
        <button
          type="button"
          onClick={() => setBillingCycle('monthly')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            billingCycle === 'monthly'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Facturation Mensuelle
        </button>

        <button
          type="button"
          onClick={() => setBillingCycle('yearly')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            billingCycle === 'yearly'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Facturation Annuelle</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-900 text-emerald-300 font-bold">
            2 mois offerts
          </span>
        </button>
      </div>

      {/* Plans Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map(p => {
          const isCurrent = user?.plan === p.id;
          const price = billingCycle === 'monthly' ? p.priceMonthly : p.priceYearly;

          return (
            <div
              key={p.id}
              className={`p-6 rounded-2xl flex flex-col justify-between transition-all relative ${
                p.isPopular
                  ? 'bg-[#111C2E] border-2 border-emerald-500 shadow-2xl ring-1 ring-emerald-500/20'
                  : 'bg-[#0E1626] border border-slate-800 hover:border-slate-700'
              }`}
            >
              {p.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                  Recommandé
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold text-white">{p.name}</h3>
                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Forfait Actif
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 mb-6">{p.desc}</p>

                {/* Price Display */}
                <div className="mb-6 font-mono">
                  {price === 0 ? (
                    <div className="text-3xl font-black text-white">0,00 €</div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">
                        {billingCycle === 'monthly' ? `${p.priceMonthly.toFixed(2).replace('.', ',')} €` : `${p.priceYearly.toFixed(2).replace('.', ',')} €`}
                      </span>
                      <span className="text-xs text-slate-400 font-sans">
                        / {billingCycle === 'monthly' ? 'mois' : 'an'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Features List */}
                <ul className="space-y-3 text-xs text-slate-300 border-t border-slate-800/80 pt-6">
                  {p.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold cursor-default"
                  >
                    Votre formule active
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSelectPlan(p.id as any)}
                    disabled={loadingPlan === p.id}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                      p.isPopular
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                  >
                    {loadingPlan === p.id ? (
                      <span>Chargement...</span>
                    ) : (
                      <>
                        <span>Choisir {p.name}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Invoice History & Payment Details */}
      <div className="p-6 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white">Historique des factures & Reçus</h2>
          <span className="text-xs text-slate-400 font-semibold">TVA standard 20% applicable</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-3 px-3">Numéro</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Montant TTC</th>
                <th className="py-3 px-3">Statut</th>
                <th className="py-3 px-3 text-right">Téléchargement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-mono font-bold text-white">{inv.id}</td>
                  <td className="py-3 px-3 text-slate-400">{formatDate(inv.date)}</td>
                  <td className="py-3 px-3 font-mono font-semibold text-slate-200">
                    {formatCurrency(inv.amount, user?.currency)}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => alert(`Reçu PDF ${inv.id} téléchargé (Mode démo certifié).`)}
                      className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700/50"
                      title="Télécharger le reçu PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
