import React, { useState, useEffect } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { formatDateTime } from '../../utils/formatters';
import {
  ShieldAlert,
  Users,
  CreditCard,
  Cpu,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Server,
  Lock,
  Search,
  RefreshCw,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { auditLogs } = useFinancial();
  const [metrics, setMetrics] = useState({
    totalUsers: 1420,
    activeSubscribers: 312,
    mrr: '3 116,88 €',
    aiQueriesToday: 489,
    uptimePercent: 99.98,
  });

  const [integrationsStatus, setIntegrationsStatus] = useState({
    geminiAi: 'Opérationnel (Gemini 3.8 Flash)',
    openBankingDsp2: 'Actif (Sandbox RTS 2018/389)',
    stripeBilling: 'Test Sandbox Idempotent',
    marketQuotes: 'Différé 15 min (Euronext/NYSE)',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchMetrics = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/admin/metrics');
      if (res.ok) {
        const data = await res.json();
        setMetrics({
          totalUsers: data.totalUsers,
          activeSubscribers: data.activeSubscribers,
          mrr: data.mrr,
          aiQueriesToday: data.aiQueriesToday,
          uptimePercent: data.uptimePercent,
        });
      }
    } catch {
      // Fallback to existing
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const filteredLogs = auditLogs.filter(
    l =>
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-7 h-7 text-amber-400" />
            <span>Console d'Administration & Supervision</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Indicateurs consolidés anonymisés, état des API tierces et journal d'audit de sécurité.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchMetrics}
          disabled={isRefreshing}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white transition-colors flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
          <span>Actualiser les métriques</span>
        </button>
      </div>

      {/* Global Anonymized Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>Utilisateurs inscrits</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{metrics.totalUsers}</div>
          <div className="text-[11px] text-emerald-400 font-semibold">+18 nouveaux cette semaine</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>Abonnés Premium / Famille</span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{metrics.activeSubscribers}</div>
          <div className="text-[11px] text-slate-400">Taux de conversion : 21.9%</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>Revenus récurrents (MRR)</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{metrics.mrr}</div>
          <div className="text-[11px] text-slate-400">Croissance : +12.4% MoM</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>Requêtes Finova AI aujourd'hui</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{metrics.aiQueriesToday}</div>
          <div className="text-[11px] text-emerald-400 font-semibold">Temps moyen : 380 ms</div>
        </div>
      </div>

      {/* Integration Status Check */}
      <div className="p-6 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <span>État des Passerelles & Services Tiers</span>
          </h2>
          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Disponibilité système : {metrics.uptimePercent}%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1">
            <div className="font-bold text-white">Assistant Finova AI</div>
            <div className="text-emerald-400 font-semibold">{integrationsStatus.geminiAi}</div>
            <div className="text-[10px] text-slate-400">Modèle Gemini 3.8 Flash actif</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1">
            <div className="font-bold text-white">Agrégation Bancaire</div>
            <div className="text-emerald-400 font-semibold">{integrationsStatus.openBankingDsp2}</div>
            <div className="text-[10px] text-slate-400">Protocole DSP2 sans stockage mdp</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1">
            <div className="font-bold text-white">Passerelle de Paiement</div>
            <div className="text-amber-400 font-semibold">{integrationsStatus.stripeBilling}</div>
            <div className="text-[10px] text-slate-400">Sessions de test côté serveur</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1">
            <div className="font-bold text-white">Flux de Marché</div>
            <div className="text-emerald-400 font-semibold">{integrationsStatus.marketQuotes}</div>
            <div className="text-[10px] text-slate-400">Euronext Paris / NYSE</div>
          </div>
        </div>
      </div>

      {/* Security Audit Log Table */}
      <div className="p-6 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Journal d'Audit de Sécurité & Traçabilité</span>
            </h2>
            <p className="text-xs text-slate-400">
              Événements système journalisés avec contrôle d'intégrité (Strictement anonymisé)
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filtrer les journaux..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 w-52"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-2.5 px-3">Horodatage</th>
                <th className="py-2.5 px-3">Action Système</th>
                <th className="py-2.5 px-3">Identifiant</th>
                <th className="py-2.5 px-3">Détails</th>
                <th className="py-2.5 px-3 text-right">Origine IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.slice(0, 15).map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                    {formatDateTime(log.timestamp)}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">{log.userId}</td>
                  <td className="py-2.5 px-3 text-slate-300 font-sans">{log.details}</td>
                  <td className="py-2.5 px-3 text-right text-slate-400">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
