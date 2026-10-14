import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import {
  Building2,
  RefreshCw,
  Plus,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ExternalLink,
  Trash2,
} from 'lucide-react';

export const BankingView: React.FC = () => {
  const {
    connectedBanks,
    accounts,
    syncAllBanks,
    connectBank,
    disconnectBank,
    user,
  } = useFinancial();

  const [isSyncing, setIsSyncing] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedBankToConnect, setSelectedBankToConnect] = useState<string | null>(null);
  const [simulatedConsentStep, setSimulatedConsentStep] = useState<number>(1);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const supportedInstitutions = [
    { name: 'BoursoBank', code: 'bourso', logo: '🏦', color: '#E11D48', type: 'Banque en ligne leader' },
    { name: 'BNP Paribas', code: 'bnp', logo: '🏛️', color: '#059669', type: 'Réseau bancaire national' },
    { name: 'Crédit Agricole', code: 'ca', logo: '🌾', color: '#0284C7', type: 'Banque mutualiste' },
    { name: 'Société Générale', code: 'sg', logo: '🔴', color: '#DC2626', type: 'Réseau bancaire' },
    { name: 'Revolut', code: 'revo', logo: '⚡', color: '#2563EB', type: 'Néobanque européenne' },
    { name: 'La Banque Postale', code: 'lbp', logo: '📬', color: '#D97706', type: 'Service public postal' },
  ];

  const handleGlobalSync = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      await syncAllBanks();
      setSyncFeedback('Synchronisation DSP2 réussie : 100% des comptes sont à jour.');
      setTimeout(() => setSyncFeedback(null), 4000);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLaunchConnect = (bankName: string) => {
    setSelectedBankToConnect(bankName);
    setSimulatedConsentStep(1);
    setShowConnectModal(true);
  };

  const handleConfirmDsp2Consent = async () => {
    if (!selectedBankToConnect) return;
    setSimulatedConsentStep(2); // Connecting screen
    setTimeout(async () => {
      await connectBank(selectedBankToConnect);
      setShowConnectModal(false);
      setSelectedBankToConnect(null);
      setSimulatedConsentStep(1);
      setSyncFeedback(`Connexion sécurisée établie avec succès pour ${selectedBankToConnect}.`);
      setTimeout(() => setSyncFeedback(null), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title & Global Sync */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-emerald-400" />
            <span>Agrégation Bancaire & Open Banking (DSP2)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Connectez vos établissements bancaires via les API officielles européennes certifiées RTS 2018/389.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleGlobalSync}
            disabled={isSyncing}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isSyncing ? 'Synchronisation...' : 'Actualiser tous les comptes'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowConnectModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Connecter un établissement</span>
          </button>
        </div>
      </div>

      {syncFeedback && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span>{syncFeedback}</span>
        </div>
      )}

      {/* Security Framework Banner */}
      <div className="p-6 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white">
              Garantie de sécurité bancaire sans stockage de mot de passe
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Conformément à la Directive européenne sur les Services de Paiement (DSP2), Finova Finance <strong>ne vous demandera jamais</strong> vos codes secrets bancaires. L'authentification forte (2FA) se déroule exclusivement sur l'interface sécurisée de votre banque d'origine.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-300">
            <div className="font-bold text-white mb-0.5">Accès en lecture seule</div>
            <p className="text-[11px] text-slate-400">Aucun virement ni mouvement de fonds n'est autorisé.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-300">
            <div className="font-bold text-white mb-0.5">Consentement 90 jours</div>
            <p className="text-[11px] text-slate-400">Renouvellement automatique sécurisé ou révocation instantanée.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-300">
            <div className="font-bold text-white mb-0.5">Agrégateur certifié ACPR</div>
            <p className="text-[11px] text-slate-400">Interopérabilité Bridge / Budget Insight / Tink certifiée.</p>
          </div>
        </div>
      </div>

      {/* Connected Banks List */}
      <div className="p-6 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white">Établissements actuellement connectés</h2>
          <span className="text-xs text-slate-400 font-semibold">{connectedBanks.length} connexion(s) active(s)</span>
        </div>

        <div className="space-y-3">
          {connectedBanks.map(bank => {
            const bankAccounts = accounts.filter(a => a.institution.toLowerCase().includes(bank.name.toLowerCase()));
            const totalBankBalance = bankAccounts.reduce((sum, a) => sum + a.balance, 0);

            return (
              <div
                key={bank.id}
                className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-xl flex items-center justify-center flex-shrink-0">
                    {bank.logo}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm flex items-center gap-2">
                      <span>{bank.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        DSP2 Actif
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Dernière synchronisation : {formatDateTime(bank.lastSyncAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 text-xs">
                  <div className="text-left sm:text-right font-mono">
                    <div className="font-bold text-white text-sm">
                      {formatCurrency(totalBankBalance, user?.currency)}
                    </div>
                    <div className="text-[11px] text-slate-400 font-sans">
                      {bankAccounts.length || 1} compte(s) rattaché(s)
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => disconnectBank(bank.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                    title="Révoquer l'autorisation DSP2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Connect Bank Modal with DSP2 Flow Simulation */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#0F172A] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-white">Connexion bancaire sécurisée</h4>
                <p className="text-xs text-slate-400">Protocole Open Banking DSP2 certifié</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowConnectModal(false);
                  setSelectedBankToConnect(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {!selectedBankToConnect ? (
                <div className="space-y-4">
                  <p className="text-xs text-slate-300">
                    Sélectionnez votre banque pour initier la redirection d'authentification forte :
                  </p>
                  <div className="grid grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                    {supportedInstitutions.map(inst => (
                      <button
                        key={inst.code}
                        type="button"
                        onClick={() => setSelectedBankToConnect(inst.name)}
                        className="p-3.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:border-emerald-500 hover:bg-emerald-500/10 transition-all text-left flex items-center gap-3"
                      >
                        <span className="text-2xl">{inst.logo}</span>
                        <div>
                          <div className="font-bold text-xs text-white">{inst.name}</div>
                          <div className="text-[10px] text-slate-400">{inst.type}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : simulatedConsentStep === 1 ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700 text-center space-y-2">
                    <div className="text-3xl mb-1">🏦</div>
                    <h5 className="font-bold text-white text-sm">
                      Autorisation d'accès aux comptes — {selectedBankToConnect}
                    </h5>
                    <p className="text-xs text-slate-300">
                      En poursuivant, vous allez être redirigé vers l'interface d'authentification sécurisée de votre banque pour autoriser Finova Finance à importer vos soldes et transactions en mode <strong>lecture seule</strong>.
                    </p>
                  </div>

                  <div className="space-y-2 text-xs text-slate-400">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Aucun virement autorisé</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Identifiants bancaires jamais communiqués à Finova</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Révocable à tout moment en un clic</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedBankToConnect(null)}
                      className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                    >
                      Choisir une autre banque
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmDsp2Consent}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                    >
                      <span>Simuler l'autorisation bancaire</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                  <h5 className="font-bold text-white text-sm">Connexion en cours via les API DSP2...</h5>
                  <p className="text-xs text-slate-400">
                    Échange sécurisé des jetons OAuth et synchronisation initiale des écritures.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
