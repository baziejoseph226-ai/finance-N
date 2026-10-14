import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { Logo } from '../common/Logo';
import { formatCurrency } from '../../utils/formatters';
import {
  TrendingUp,
  ShieldCheck,
  Sparkles,
  PieChart,
  Target,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Lock,
  ChevronDown,
  Building2,
  Cpu,
  BarChart3,
  Moon,
  Sun,
  Layers,
  ArrowUpRight,
  Eye,
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenLegalModal: (modal: 'mentions' | 'privacy' | 'terms') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, onOpenLegalModal }) => {
  const { setCurrentView, theme, toggleTheme } = useFinancial();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Qu\'est-ce que Finova Finance et comment fonctionne la plateforme ?',
      a: 'Finova Finance est une plateforme premium de gestion financière personnelle. Elle vous permet d\'agréger vos comptes bancaires via des protocoles sécurisés DSP2, de piloter vos plafonds budgétaires, d\'analyser votre portefeuille d\'investissements et de bénéficier d\'analyses objectives grâce à Finova AI.',
    },
    {
      q: 'Comment mes données bancaires et personnelles sont-elles protégées ?',
      a: 'Nous appliquons les principes de minimisation des données et de sécurité dès la conception : chiffrement fort TLS 1.3 en transit et AES-256 au repos, conformité stricte au RGPD (Règlement UE 2016/679). Nous n\'avons jamais accès à vos identifiants bancaires, qui transitent exclusivement par les interfaces agréées des établissements bancaires.',
    },
    {
      q: 'Finova AI fournit-elle des conseils financiers personnalisés ?',
      a: 'Non. Finova AI est un outil d\'assistance pédagogique et d\'analyse budgétaire. Elle identifie vos postes de dépenses récurrents, simule des trajectoires d\'épargne et vous explique les mécanismes financiers (diversification, volatilité, frais). Elle ne délivre aucun conseil personnalisé en investissement (au sens de l\'AMF / Directive MIFID II) et ne formule aucune recommandation d\'achat ou de vente.',
    },
    {
      q: 'Puis-je exporter mes données ou supprimer mon compte ?',
      a: 'Absolument. Conformément au RGPD (Droit à la portabilité et droit à l\'oubli), vous pouvez à tout moment télécharger l\'intégralité de vos données au format JSON ou CSV depuis vos paramètres, ou procéder à la suppression irréversible de votre compte.',
    },
    {
      q: 'Comment s\'articulent les offres Gratuite, Premium et Famille ?',
      a: 'L\'offre Gratuite permet de gérer manuellement vos comptes, budgets et objectifs. L\'offre Premium débloque l\'agrégation bancaire automatique, les analyses prédictives avancées et l\'accès élargi à Finova AI. L\'offre Famille permet de partager des budgets communs avec plusieurs profils.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100 flex flex-col selection:bg-emerald-500/30">
      {/* 1. Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0B1220]/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Logo size="md" showSlogan={false} />

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#accueil" className="hover:text-emerald-400 transition-colors">
              Accueil
            </a>
            <a href="#fonctionnalites" className="hover:text-emerald-400 transition-colors">
              Fonctionnalités
            </a>
            <a href="#budget" className="hover:text-emerald-400 transition-colors">
              Budget & Épargne
            </a>
            <a href="#investissements" className="hover:text-emerald-400 transition-colors">
              Investissements
            </a>
            <a href="#securite" className="hover:text-emerald-400 transition-colors">
              Notre approche
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
              title="Changer de thème"
              aria-label="Changer de thème"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
            </button>

            <button
              type="button"
              onClick={() => onOpenAuth('login')}
              className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Connexion
            </button>

            <button
              type="button"
              onClick={() => onOpenAuth('register')}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 flex items-center gap-1.5"
            >
              <span>Créer mon compte</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section id="accueil" className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Subtle radial glow background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>La fintech nouvelle génération</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Reprenez le contrôle de votre{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  avenir financier.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
                Centralisez vos finances, pilotez votre budget, suivez vos investissements et prenez de meilleures décisions grâce à une intelligence artificielle conçue pour vous aider à comprendre votre argent.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-2">
                <button
                  type="button"
                  onClick={() => onOpenAuth('register')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 group"
                >
                  <span>Créer mon compte gratuitement</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentView('dashboard')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-base transition-all flex items-center justify-center gap-2 hover:border-slate-600"
                >
                  <Eye className="w-5 h-5 text-emerald-400" />
                  <span>Découvrir le tableau de bord</span>
                </button>
              </div>

              {/* Guarantees pills */}
              <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Chiffrement bancaire AES-256</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Conforme DSP2 & RGPD</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Aucune revente de données</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Dashboard Preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Floating label clearly identifying example preview as required */}
                <div className="absolute -top-3.5 right-4 z-20 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-[11px] font-bold tracking-wide uppercase shadow-lg backdrop-blur-sm">
                  Exemple de portefeuille simulé
                </div>

                {/* Glassmorphic dashboard mockup */}
                <div className="bg-[#111C2E]/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-6 ring-1 ring-white/5">
                  {/* Top card: Net worth */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                        Patrimoine financier estimé
                      </div>
                      <div className="text-3xl font-black text-white font-mono mt-1">
                        52 480,50 €
                      </div>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
                      +4,8% ce mois
                    </div>
                  </div>

                  {/* Mini visual curve */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Progression sur 6 mois</span>
                      <span className="text-slate-200 font-semibold">+18,4% global</span>
                    </div>
                    <div className="h-20 w-full relative">
                      <svg viewBox="0 0 300 80" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 0 65 Q 60 55, 100 45 T 180 35 T 240 25 T 300 10 L 300 80 L 0 80 Z"
                          fill="url(#heroGrad)"
                        />
                        <path
                          d="M 0 65 Q 60 55, 100 45 T 180 35 T 240 25 T 300 10"
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="2.5"
                        />
                        <circle cx="300" cy="10" r="4" fill="#34D399" stroke="#0B1220" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>

                  {/* Monthly cash flow quick snapshot */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                      <div className="text-[11px] text-slate-400">Revenus mensuels</div>
                      <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">3 450,00 €</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                      <div className="text-[11px] text-slate-400">Dépenses engagées</div>
                      <div className="text-base font-bold text-rose-400 font-mono mt-0.5">2 180,00 €</div>
                    </div>
                  </div>

                  {/* Savings indicator & Finova AI Badge */}
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Capacité d'épargne : 36,8%</div>
                        <div className="text-[11px] text-emerald-300">Objectif de sécurité à portée de main</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">+1 270 €</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentView('dashboard')}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Lancer la visite interactive</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Pillars Section */}
      <section id="fonctionnalites" className="py-20 bg-[#0E1626] border-t border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Une infrastructure complète
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Tout ce dont vous avez besoin pour maîtriser vos finances
            </h3>
            <p className="text-slate-400 text-base">
              Conçu avec la rigueur d'un cabinet de gestion patrimoniale et la simplicité d'une application moderne.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: 'Vue 360° du patrimoine',
                desc: 'Consolidez vos comptes courants, livrets d\'épargne, portefeuilles d\'actions et crypto-actifs en temps réel sur un tableau de bord unique.',
                color: 'text-blue-400',
                bg: 'bg-blue-500/10 border-blue-500/20',
              },
              {
                icon: PieChart,
                title: 'Budgétisation intelligente',
                desc: 'Fixez des plafonds par catégorie de dépenses, anticipez les charges récurrentes et soyez alerté avant tout dépassement.',
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10 border-emerald-500/20',
              },
              {
                icon: Target,
                title: 'Objectifs d\'épargne ciblés',
                desc: 'Projetez vos projets de vie (apport immobilier, fonds d\'urgence, voyages) avec calcul automatisé des dates d\'atteinte estimées.',
                color: 'text-purple-400',
                bg: 'bg-purple-500/10 border-purple-500/20',
              },
              {
                icon: TrendingUp,
                title: 'Suivi multi-actifs',
                desc: 'Analysez vos actions, ETF et cryptomonnaies avec calcul automatique des prix de revient (PRU) et des plus-values latentes.',
                color: 'text-amber-400',
                bg: 'bg-amber-500/10 border-amber-500/20',
              },
              {
                icon: Cpu,
                title: 'Finova AI : Analyse objective',
                desc: 'Un assistant financier qui vulgarise vos flux, identifie les gaspillages sans jamais formuler de promesse hasardeuse.',
                color: 'text-cyan-400',
                bg: 'bg-cyan-500/10 border-cyan-500/20',
              },
              {
                icon: ShieldCheck,
                title: 'Sécurité & Souveraineté',
                desc: 'Aucune revente de données. Authentification sécurisée, export RGPD en un clic et protocoles bancaires ouverts certifiés DSP2.',
                color: 'text-rose-400',
                bg: 'bg-rose-500/10 border-rose-500/20',
              },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="p-8 rounded-2xl bg-[#111C2E] border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1 group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${f.bg} ${f.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                    {f.title}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Deep Dive Sections: Budget & Investments */}
      <section id="budget" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {/* Section 1: Budget */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Maîtrise budgétaire
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Dites adieu aux mauvaises surprises en fin de mois.
              </h3>
              <p className="text-slate-300 text-base leading-relaxed">
                Visualisez chaque euro qui entre et sort de vos comptes. Nos algorithmes ventilent automatiquement vos transactions par catégorie (Logement, Alimentation, Loisirs, Abonnements) et comparent en continu vos dépenses réelles à vos prévisions.
              </p>
              <ul className="space-y-3 text-sm text-slate-300">
                {[
                  'Alertes visuelles dès 80% du plafond atteint',
                  'Gestion différenciée des charges fixes et variables',
                  'Export comptable en un clic au format CSV standard',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setCurrentView('budgets')}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-sm transition-all inline-flex items-center gap-2"
              >
                <span>Explorer le module Budget</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
            </div>

            <div className="lg:col-span-6 bg-[#111C2E] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex justify-between items-center">
                <span>Plafonds du mois en cours</span>
                <span className="text-xs text-slate-400">Période : Octobre 2026</span>
              </div>
              {[
                { cat: 'Logement', spent: 880, limit: 950, color: 'bg-blue-500', percent: 92 },
                { cat: 'Alimentation', spent: 340, limit: 480, color: 'bg-emerald-500', percent: 70 },
                { cat: 'Loisirs & Sorties', spent: 220, limit: 250, color: 'bg-amber-500', percent: 88 },
                { cat: 'Abonnements', spent: 64.9, limit: 70, color: 'bg-purple-500', percent: 93 },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-semibold">{item.cat}</span>
                    <span className="text-slate-400 font-mono">
                      {item.spent} € / {item.limit} € ({item.percent}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Investments */}
          <div id="investissements" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1 bg-[#111C2E] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex justify-between items-center">
                <span>Positions sélectionnées (Exemple)</span>
                <span className="text-xs text-emerald-400 font-mono font-semibold">+14,8% P&L global</span>
              </div>
              <div className="space-y-2.5">
                {[
                  { name: 'Amundi MSCI World (CW8)', type: 'ETF', val: '19 471,20 €', pl: '+10,8%', pos: true },
                  { name: 'Air Liquide S.A.', type: 'Action', val: '4 492,80 €', pl: '+12,1%', pos: true },
                  { name: 'Bitcoin Spot (Cold Storage)', type: 'Crypto', val: '3 079,20 €', pl: '+18,4%', pos: true },
                ].map((pos, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-white">{pos.name}</div>
                      <div className="text-slate-400 text-[11px]">{pos.type}</div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="font-bold text-slate-200">{pos.val}</div>
                      <div className="text-emerald-400 font-semibold">{pos.pl}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Portefeuille patrimonial
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Suivez vos investissements sans jargon inutile.
              </h3>
              <p className="text-slate-300 text-base leading-relaxed">
                Centralisez vos actifs cotés, vos parts d'ETF indiciels, vos obligations et vos crypto-monnaies. Bénéficiez d'une lecture claire de votre diversification géographique et par classe d'actifs.
              </p>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs text-slate-300 space-y-2">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  <span>Avertissement pédagogique réglementaire</span>
                </div>
                <p>
                  Finova Finance est un outil d'agrégation et de visualisation d'informations financières. Les performances passées ne préjugent pas des performances futures.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Finova AI Assistant Spotlight */}
      <section className="py-20 bg-gradient-to-b from-[#0B1220] via-[#0E1726] to-[#0B1220] border-t border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase">
            <Cpu className="w-4 h-4" />
            <span>Intelligence Artificielle Responsable</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            « Finova AI » : votre allié pour comprendre où va votre argent
          </h2>

          <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg">
            Posez vos questions en langage naturel. Finova AI analyse vos données agrégées pour vous expliquer vos flux, simuler des scénarios d'épargne et identifier des pistes d'économies réalistes.
          </p>

          {/* Sample prompts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto pt-2">
            {[
              '« Où est passé mon argent ce mois-ci ? »',
              '« Quelles dépenses pourrais-je réduire ? »',
              '« Explique-moi la différence entre Action et ETF. »',
            ].map((prompt, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-[#111C2E] border border-slate-800 text-xs font-medium text-slate-300 text-left"
              >
                <span className="text-emerald-400 block mb-1">💬 Question fréquente</span>
                {prompt}
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button
              type="button"
              onClick={() => setCurrentView('ai')}
              className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 inline-flex items-center gap-2"
            >
              <span>Tester Finova AI dans l'application</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. Security and Compliance */}
      <section id="securite" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Sécurité & Conformité
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              Votre confiance est notre actif le plus précieux
            </h3>
            <p className="text-slate-400 text-base">
              Nos protocoles respectent les standards bancaires les plus stricts en vigueur dans l'Union Européenne.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="text-lg font-bold text-white">Chiffrement de bout en bout</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Toutes les communications transitent par TLS 1.3 avec chiffrement des données stockées en AES-256 bits. Les clés secrètes ne sont jamais exposées au navigateur.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="text-lg font-bold text-white">Directive DSP2 / Open Banking</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Les connexions bancaires utilisent des API agréées en mode lecture seule. Finova ne peut en aucun cas initier de virement ni disposer de vos fonds.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#111C2E] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                3
              </div>
              <h4 className="text-lg font-bold text-white">Respect absolu du RGPD</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Vos données vous appartiennent. Vous disposez d'un bouton d'export intégral en JSON / CSV et de la suppression définitive en un clic sans rétention cachée.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="py-20 bg-[#0E1626] border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h3 className="text-3xl font-extrabold text-white">Questions fréquentes</h3>
            <p className="text-slate-400 text-sm">Tout ce que vous devez savoir en toute transparence.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-[#111C2E] border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-white hover:text-emerald-400 transition-colors"
                >
                  <span className="text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-emerald-400' : ''}`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-slate-300 text-sm leading-relaxed border-t border-slate-800/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Conversion CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Prêt à transformer votre rapport à l'argent ?
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-base">
            Rejoignez Finova Finance dès aujourd'hui. Commencez gratuitement, sans carte bancaire requise.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={() => onOpenAuth('register')}
              className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base transition-all shadow-xl shadow-emerald-500/20"
            >
              Créer mon compte gratuitement
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('dashboard')}
              className="px-8 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-base transition-all"
            >
              Voir la démo en direct
            </button>
          </div>
        </div>
      </section>

      {/* 9. Footer with Legal Mentions */}
      <footer className="mt-auto bg-[#070C16] border-t border-slate-800/80 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo size="sm" showSlogan={true} />
            <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
              <button
                type="button"
                onClick={() => onOpenLegalModal('mentions')}
                className="hover:text-emerald-400 transition-colors"
              >
                Mentions légales
              </button>
              <button
                type="button"
                onClick={() => onOpenLegalModal('privacy')}
                className="hover:text-emerald-400 transition-colors"
              >
                Politique de confidentialité (RGPD)
              </button>
              <button
                type="button"
                onClick={() => onOpenLegalModal('terms')}
                className="hover:text-emerald-400 transition-colors"
              >
                Conditions Générales d'Utilisation
              </button>
              <button
                type="button"
                onClick={() => setCurrentView('admin')}
                className="hover:text-amber-400 transition-colors"
              >
                Espace Administration
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/60 text-center text-[11px] text-slate-400 space-y-2">
            <p>
              © {new Date().getFullYear()} Finova Finance SAS. Tous droits réservés. Finova Finance est une plateforme d'information et d'agrégation budgétaire personnelle. Elle n'exerce pas d'activité de conseil en investissements financiers (CIF) et ne fournit aucune recommandation personnalisée.
            </p>
            <p>
              Les devises et calculs présentés respectent les normes comptables applicables aux personnes physiques en France.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
