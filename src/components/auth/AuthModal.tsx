import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { Logo } from '../common/Logo';
import { Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { login, register } = useFinancial();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'confirm_sent'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (!res.success) {
          setErrorMsg(res.error || 'Identifiants invalides.');
        } else {
          onClose();
        }
      } else if (mode === 'register') {
        const res = await register(name, email, password);
        if (!res.success) {
          setErrorMsg(res.error || 'Erreur lors de l\'inscription.');
        } else {
          setMode('confirm_sent');
        }
      } else if (mode === 'forgot') {
        // Password reset email simulation
        setMode('confirm_sent');
      }
    } catch {
      setErrorMsg('Une erreur inattendue est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#0F172A] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header with Logo */}
        <div className="p-6 pb-4 border-b border-slate-800 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg p-1"
            aria-label="Fermer"
          >
            ✕
          </button>
          <div className="flex justify-center mb-3">
            <Logo size="md" />
          </div>
          <h3 className="text-xl font-bold text-white">
            {mode === 'login' && 'Connexion à votre espace'}
            {mode === 'register' && 'Créer un compte Finova'}
            {mode === 'forgot' && 'Mot de passe oublié'}
            {mode === 'confirm_sent' && 'Vérification envoyée'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login' && 'Accédez à votre tableau de bord financier sécurisé'}
            {mode === 'register' && 'Prenez le contrôle de vos finances en toute sérénité'}
            {mode === 'forgot' && 'Entrez votre adresse email pour réinitialiser votre accès'}
            {mode === 'confirm_sent' && 'Un email sécurisé a été transmis à votre adresse'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {mode === 'confirm_sent' ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <p className="text-sm text-slate-300">
                Nous avons envoyé les instructions de vérification à{' '}
                <strong className="text-emerald-400">{email || 'votre adresse e-mail'}</strong>.
              </p>
              <div className="p-3 bg-slate-800/60 rounded-xl text-xs text-slate-400">
                Pour ce banc d'essai, votre compte est automatiquement activé et votre session est prête.
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all"
              >
                Poursuivre vers l'application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">Nom complet</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Alexandre Moreau"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">Adresse e-mail</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="alexandre.moreau@finova.fr"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-slate-300">Mot de passe</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[11px] text-emerald-400 hover:underline"
                      >
                        Oublié ?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <span>Vérification...</span>
                ) : (
                  <>
                    <span>
                      {mode === 'login' && 'Se connecter'}
                      {mode === 'register' && 'Créer mon compte'}
                      {mode === 'forgot' && 'Envoyer le lien de réinitialisation'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-xs text-slate-400">
                {mode === 'login' && (
                  <p>
                    Pas encore de compte ?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('register');
                        setErrorMsg('');
                      }}
                      className="text-emerald-400 hover:underline font-semibold"
                    >
                      S'inscrire gratuitement
                    </button>
                  </p>
                )}
                {mode === 'register' && (
                  <p>
                    Déjà inscrit ?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setErrorMsg('');
                      }}
                      className="text-emerald-400 hover:underline font-semibold"
                    >
                      Se connecter
                    </button>
                  </p>
                )}
                {mode === 'forgot' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMsg('');
                    }}
                    className="text-emerald-400 hover:underline"
                  >
                    Retour à la connexion
                  </button>
                )}
              </div>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Chiffrement AES-256 & Authentification conforme RGPD</span>
          </div>
        </div>
      </div>
    </div>
  );
};
