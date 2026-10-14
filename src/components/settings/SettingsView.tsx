import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { CurrencyCode } from '../../types';
import {
  Settings,
  Shield,
  Key,
  Smartphone,
  Download,
  Trash2,
  RefreshCcw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Globe,
  User,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    user,
    updateProfile,
    exportAllUserDataJSON,
    resetToDefaultData,
    logout,
  } = useFinancial();

  const [name, setName] = useState(user?.name || '');
  const [currency, setCurrency] = useState<CurrencyCode>(user?.currency || 'EUR');
  const [monthlyIncome, setMonthlyIncome] = useState<number>(user?.monthlyIncome || 3200);
  const [twoFactor, setTwoFactor] = useState(user?.twoFactorEnabled || false);

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      currency,
      monthlyIncome: Number(monthlyIncome),
      twoFactorEnabled: twoFactor,
    });
    setFeedbackMsg('Vos paramètres et préférences ont été mis à jour avec succès.');
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleAccountDeletion = () => {
    if (deleteConfirmationText.trim().toUpperCase() !== 'SUPPRIMER') return;
    resetToDefaultData();
    setShowDeleteModal(false);
    logout();
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-emerald-400" />
          <span>Paramètres & Sécurité du Compte</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Gérez vos informations de profil, renforcez la sécurité de votre compte et exercez vos droits RGPD.
        </p>
      </div>

      {feedbackMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Profile Form */}
      <div className="p-6 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-6">
        <div className="border-b border-slate-800 pb-3 flex items-center gap-2 text-white font-bold text-base">
          <User className="w-5 h-5 text-emerald-400" />
          <span>Informations Personnelles</span>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 block mb-1.5 font-medium">Nom complet</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1.5 font-medium">Adresse email (Identifiant)</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 block mb-1.5 font-medium">Devise de référence</label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value as CurrencyCode)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="EUR">Euro (€ - France & UE)</option>
                <option value="USD">Dollar US ($)</option>
                <option value="CHF">Franc Suisse (CHF)</option>
                <option value="GBP">Livre Sterling (£)</option>
                <option value="CAD">Dollar Canadien (CA$)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 block mb-1.5 font-medium">Revenus mensuels indicatifs (€)</label>
              <input
                type="number"
                min={0}
                step={50}
                value={monthlyIncome}
                onChange={e => setMonthlyIncome(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20"
            >
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>

      {/* Security & 2FA */}
      <div className="p-6 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-6">
        <div className="border-b border-slate-800 pb-3 flex items-center gap-2 text-white font-bold text-base">
          <Shield className="w-5 h-5 text-emerald-400" />
          <span>Sécurité & Authentification à Deux Facteurs (2FA)</span>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="font-bold text-white">Validation en deux étapes (TOTP / Authenticator)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Exige un code temporaire généré par Google Authenticator ou Apple Passwords.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const nextVal = !twoFactor;
                setTwoFactor(nextVal);
                updateProfile({ twoFactorEnabled: nextVal });
                setFeedbackMsg(nextVal ? 'Authentification 2FA activée.' : 'Authentification 2FA désactivée.');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                twoFactor
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {twoFactor ? 'Activé ✓' : 'Désactivé'}
            </button>
          </div>

          {twoFactor && (
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-200 space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Key className="w-4 h-4 text-emerald-400" />
                <span>Clé secrète de secours :</span>
              </div>
              <code className="block p-2 rounded bg-slate-900 border border-slate-800 font-mono text-emerald-300">
                FINOVA-SEC-8921-X91A-42K8-B990
              </code>
              <p className="text-[11px] text-slate-400">
                Conservez cette clé en lieu sûr en cas de perte de votre appareil principal.
              </p>
            </div>
          )}

          {/* Active Sessions */}
          <div className="space-y-2 pt-2">
            <span className="font-bold text-slate-300 block">Sessions actives vérifiées :</span>
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center justify-between text-[11px]">
              <div>
                <span className="font-semibold text-white">Navigateur actuel (Web Client sécurisé)</span>
                <span className="text-slate-400 block">IP : 127.0.0.1 • Chiffrement TLS 1.3 actif</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                Session en cours
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RGPD & Data Rights */}
      <div className="p-6 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-6">
        <div className="border-b border-slate-800 pb-3 flex items-center gap-2 text-white font-bold text-base">
          <Globe className="w-5 h-5 text-emerald-400" />
          <span>Droits des Personnes & Conformité RGPD</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Export JSON */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-col justify-between space-y-3">
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-blue-400" />
                <span>Portabilité des données (Art. 20)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Téléchargez l'intégralité de vos comptes, transactions, budgets, investissements et journaux d'audit au format standard JSON.
              </p>
            </div>
            <button
              type="button"
              onClick={exportAllUserDataJSON}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold transition-colors"
            >
              Télécharger mon archive JSON
            </button>
          </div>

          {/* Reset Demo Data */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-col justify-between space-y-3">
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <RefreshCcw className="w-4 h-4 text-amber-400" />
                <span>Réinitialiser les données de démonstration</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Rétablit le jeu de données initial certifié de Finova Finance et efface les modifications locales.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm('Voulez-vous réinitialiser le jeu de données ?')) {
                  resetToDefaultData();
                  setFeedbackMsg('Données réinitialisées au jeu standard.');
                }
              }}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold transition-colors"
            >
              Réinitialiser les données
            </button>
          </div>
        </div>

        {/* Delete Account */}
        <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="font-bold text-rose-400">Suppression définitive du compte (Droit à l'oubli)</div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Supprime irrémédiablement l'ensemble de vos données, connexions et écritures budgétaires.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold transition-colors whitespace-nowrap"
          >
            Supprimer mon compte
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#0F172A] border border-rose-500/40 rounded-2xl p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h4 className="text-base font-bold text-white">Confirmation irréversible</h4>
              <p className="text-xs text-slate-400 mt-1">
                Pour confirmer la suppression immédiate de votre compte, veuillez taper le mot <strong>SUPPRIMER</strong> ci-dessous :
              </p>
            </div>

            <input
              type="text"
              value={deleteConfirmationText}
              onChange={e => setDeleteConfirmationText(e.target.value)}
              placeholder="SUPPRIMER"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-center text-xs font-mono uppercase text-white focus:outline-none focus:border-rose-500"
            />

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmationText('');
                }}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={deleteConfirmationText.trim().toUpperCase() !== 'SUPPRIMER'}
                onClick={handleAccountDeletion}
                className="py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold disabled:opacity-40"
              >
                Confirmer l'effacement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
