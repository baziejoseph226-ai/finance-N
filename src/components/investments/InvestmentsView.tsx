import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { InvestmentPosition, AssetType, WatchlistItem } from '../../types';
import {
  TrendingUp,
  Plus,
  Trash2,
  Edit2,
  Star,
  ShieldAlert,
  Info,
  Clock,
  ExternalLink,
  Layers,
  BarChart2,
  PieChart,
} from 'lucide-react';

export const InvestmentsView: React.FC = () => {
  const {
    investmentPositions,
    addInvestmentPosition,
    editInvestmentPosition,
    deleteInvestmentPosition,
    totalPortfolioValue,
    totalPortfolioCost,
    totalUnrealizedGain,
    totalUnrealizedGainPercent,
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    user,
  } = useFinancial();

  const [activeTab, setActiveTab] = useState<'all' | 'stock' | 'etf' | 'crypto' | 'bond'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPos, setEditingPos] = useState<InvestmentPosition | null>(null);

  // Modal form states
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [type, setType] = useState<AssetType>('etf');
  const [quantity, setQuantity] = useState<number>(1);
  const [avgBuyPrice, setAvgBuyPrice] = useState<number>(100);
  const [currentPrice, setCurrentPrice] = useState<number>(105);
  const [exchange, setExchange] = useState('Euronext Paris');

  const filteredPositions = investmentPositions.filter(p => {
    if (activeTab === 'all') return true;
    return p.type === activeTab;
  });

  // Asset allocation breakdown
  const allocation = [
    { type: 'etf', label: 'ETF Indiciels', color: '#3B82F6' },
    { type: 'stock', label: 'Actions Vives', color: '#10B981' },
    { type: 'crypto', label: 'Cryptomonnaies', color: '#F59E0B' },
    { type: 'bond', label: 'Obligations', color: '#8B5CF6' },
  ].map(item => {
    const total = investmentPositions
      .filter(p => p.type === item.type)
      .reduce((s, p) => s + p.quantity * p.currentPrice, 0);
    const percent = totalPortfolioValue > 0 ? Math.round((total / totalPortfolioValue) * 100) : 0;
    return { ...item, total, percent };
  }).filter(a => a.total > 0);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !symbol.trim() || quantity <= 0 || currentPrice <= 0) return;

    if (editingPos) {
      editInvestmentPosition(editingPos.id, {
        name: name.trim(),
        symbol: symbol.trim().toUpperCase(),
        type,
        quantity: Number(quantity),
        avgBuyPrice: Number(avgBuyPrice),
        currentPrice: Number(currentPrice),
        exchange,
      });
      setEditingPos(null);
    } else {
      addInvestmentPosition({
        name: name.trim(),
        symbol: symbol.trim().toUpperCase(),
        type,
        quantity: Number(quantity),
        avgBuyPrice: Number(avgBuyPrice),
        currentPrice: Number(currentPrice),
        dailyChangePercent: 0.5,
        exchange,
      });
    }

    setName('');
    setSymbol('');
    setShowAddModal(false);
  };

  const startEdit = (pos: InvestmentPosition) => {
    setEditingPos(pos);
    setName(pos.name);
    setSymbol(pos.symbol);
    setType(pos.type);
    setQuantity(pos.quantity);
    setAvgBuyPrice(pos.avgBuyPrice);
    setCurrentPrice(pos.currentPrice);
    setExchange(pos.exchange);
    setShowAddModal(true);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <TrendingUp className="w-7 h-7 text-emerald-400" />
            <span>Portefeuille d'Investissements</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Suivi consolidé de vos positions cotées (Actions, ETF, Crypto) avec calcul de plus/moins-values latentes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingPos(null);
            setName('');
            setSymbol('');
            setQuantity(1);
            setAvgBuyPrice(100);
            setCurrentPrice(105);
            setShowAddModal(true);
          }}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une position</span>
        </button>
      </div>

      {/* Portfolio Value Summary Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-2">
          <div className="text-xs text-slate-400 font-semibold uppercase">Valeur brute du portefeuille</div>
          <div className="text-2xl font-black text-white font-mono">
            {formatCurrency(totalPortfolioValue, user?.currency)}
          </div>
          <div className="text-[11px] text-slate-400">
            {investmentPositions.length} position(s) enregistrée(s)
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-2">
          <div className="text-xs text-slate-400 font-semibold uppercase">Montant total investi (PRU)</div>
          <div className="text-2xl font-black text-slate-300 font-mono">
            {formatCurrency(totalPortfolioCost, user?.currency)}
          </div>
          <div className="text-[11px] text-slate-400">
            Prix de revient unitaire consolidé
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-2">
          <div className="text-xs text-slate-400 font-semibold uppercase">Plus / Moins-value latente</div>
          <div className={`text-2xl font-black font-mono ${totalUnrealizedGain >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatCurrency(totalUnrealizedGain, user?.currency, true)}
          </div>
          <div className="text-[11px] font-bold">
            <span className={totalUnrealizedGainPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
              {formatPercent(totalUnrealizedGainPercent)}
            </span>{' '}
            <span className="text-slate-400 font-normal">de gain non réalisé</span>
          </div>
        </div>
      </div>

      {/* Asset Allocation & Watchlist Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Allocation breakdown */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-400" />
            <span>Répartition par classe d'actifs</span>
          </h2>
          <div className="space-y-3">
            {allocation.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.label}
                  </span>
                  <span className="font-mono text-white font-bold">
                    {formatCurrency(item.total, user?.currency)} ({item.percent}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Watchlist widget */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Liste de suivi (Watchlist)</span>
            </h2>
            <span className="text-[11px] text-slate-400">Cotations indicatives</span>
          </div>

          <div className="space-y-2">
            {watchlist.map(item => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{item.symbol}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-700 text-slate-300 uppercase">
                      {item.type}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[200px]">{item.name}</div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right font-mono">
                    <div className="font-bold text-white">{item.currentPrice.toFixed(2)} €</div>
                    <div className={item.dailyChangePercent >= 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                      {formatPercent(item.dailyChangePercent)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromWatchlist(item.id)}
                    className="text-slate-400 hover:text-rose-400 text-xs"
                    title="Retirer de la watchlist"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Positions Table */}
      <div className="p-6 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-4">
        {/* Table Filters Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-xl">
            {(['all', 'etf', 'stock', 'crypto'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === tab
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'all' && 'Toutes les positions'}
                {tab === 'etf' && 'ETF'}
                {tab === 'stock' && 'Actions'}
                {tab === 'crypto' && 'Crypto'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Données de marché différées (15 min) • Euronext Paris & Crypto Spot</span>
          </div>
        </div>

        {/* Main Positions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-3 px-3">Actif & Symbole</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3 text-right">Quantité</th>
                <th className="py-3 px-3 text-right">PRU Unitaire</th>
                <th className="py-3 px-3 text-right">Dernier Cours</th>
                <th className="py-3 px-3 text-right">Valeur Estimée</th>
                <th className="py-3 px-3 text-right">Plus/Moins-Value</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPositions.map(pos => {
                const totalVal = pos.quantity * pos.currentPrice;
                const totalCost = pos.quantity * pos.avgBuyPrice;
                const gain = totalVal - totalCost;
                const gainPct = totalCost > 0 ? (gain / totalCost) * 100 : 0;

                return (
                  <tr key={pos.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white">{pos.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                        <span>{pos.symbol}</span>
                        <span>•</span>
                        <span>{pos.exchange}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                        {pos.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-slate-200">
                      {pos.quantity}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-slate-400">
                      {formatCurrency(pos.avgBuyPrice, user?.currency)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-semibold text-white">
                      <div>{formatCurrency(pos.currentPrice, user?.currency)}</div>
                      <div className={`text-[10px] ${pos.dailyChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {formatPercent(pos.dailyChangePercent)}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-white">
                      {formatCurrency(totalVal, user?.currency)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono">
                      <div className={`font-bold ${gain >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {formatCurrency(gain, user?.currency, true)}
                      </div>
                      <div className={`text-[11px] font-semibold ${gainPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {formatPercent(gainPct)}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => startEdit(pos)}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50"
                          title="Modifier la position"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteInvestmentPosition(pos.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10"
                          title="Retirer la position"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Educational Investment Insights Accordion */}
      <div className="p-6 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-emerald-400">
          <Info className="w-5 h-5" />
          <h2 className="text-base font-bold text-white">Guide & Principes Clés d'Investissement</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1.5">
            <h4 className="font-bold text-white">Diversification & Risque de concentration</h4>
            <p className="text-slate-400 leading-relaxed">
              Ne mettez jamais tous vos œufs dans le même panier. Un ETF large comme le MSCI World couvre plus de 1 400 entreprises dans 23 pays développés, éliminant le risque de faillite d'un seul titre.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1.5">
            <h4 className="font-bold text-white">Volatilité & Horizon temporel</h4>
            <p className="text-slate-400 leading-relaxed">
              Les marchés fluctuent à court terme. Un investissement en actions nécessite un horizon minimal de 5 à 8 ans pour lisser les cycles économiques et laisser agir les intérêts composés.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1.5">
            <h4 className="font-bold text-white">Impact destructeur des frais</h4>
            <p className="text-slate-400 leading-relaxed">
              Privilégiez les supports à faibles frais annuels (0,15% à 0,38% pour les ETF indiciels vs 1,5% à 2% pour les fonds gérés activement qui battent rarement leur indice de référence).
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 flex items-start gap-2.5 text-xs text-slate-400">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Avertissement légal :</strong> Finova Finance est un outil d'agrégation patrimoniale et ne fournit pas de conseil en investissement. Toute fonction de passation d'ordres réels est désactivée tant qu'un courtier agréé n'est pas connecté.
          </span>
        </div>
      </div>

      {/* Add / Edit Position Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#0F172A] border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100 space-y-4">
            <h4 className="text-base font-bold text-white">
              {editingPos ? 'Modifier la position' : 'Ajouter un actif au portefeuille'}
            </h4>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Nom de l'actif</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Amundi MSCI World, LVMH, Bitcoin..."
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Symbole boursier / Ticker</label>
                  <input
                    type="text"
                    required
                    placeholder="CW8, MC, BTC..."
                    value={symbol}
                    onChange={e => setSymbol(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white uppercase font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Type d'actif</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="etf">ETF Indiciel</option>
                    <option value="stock">Action vive</option>
                    <option value="crypto">Cryptomonnaie</option>
                    <option value="bond">Obligation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Quantité</label>
                  <input
                    type="number"
                    step="any"
                    required
                    min={0.0001}
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">PRU unitaire (€)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    min={0.01}
                    value={avgBuyPrice}
                    onChange={e => setAvgBuyPrice(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Cours actuel (€)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    min={0.01}
                    value={currentPrice}
                    onChange={e => setCurrentPrice(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Place de cotation / Échange</label>
                <input
                  type="text"
                  value={exchange}
                  onChange={e => setExchange(e.target.value)}
                  placeholder="Euronext Paris, NYSE, Cold Storage..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
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
                  {editingPos ? 'Enregistrer' : 'Ajouter au portefeuille'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
