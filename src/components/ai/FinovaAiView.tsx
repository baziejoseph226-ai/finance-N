import React, { useState, useRef, useEffect } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { formatDateTime } from '../../utils/formatters';
import {
  Cpu,
  Send,
  Sparkles,
  Trash2,
  HelpCircle,
  ShieldCheck,
  Bot,
  User,
  ArrowRight,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';

export const FinovaAiView: React.FC = () => {
  const { chatMessages, isAiThinking, sendAiMessage, clearAiChat, user } = useFinancial();
  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiThinking]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isAiThinking) return;
    setInputText('');
    await sendAiMessage(text);
  };

  const suggestedQuestions = [
    'Où est passé mon argent ce mois-ci ?',
    'Quelles dépenses pourrais-je réduire ?',
    'Aide-moi à atteindre mon objectif d\'épargne.',
    'Explique-moi mon budget.',
    'Quel est le niveau de diversification de mon portefeuille ?',
    'Explique-moi la différence entre une action et un ETF.',
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 flex-shrink-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Cpu className="w-7 h-7 text-emerald-400" />
            <span>Finova AI : Assistant Financier Responsable</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Analyse budgétaire objective, simulation de trajectoires et pédagogie financière.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Modèle : Google Gemini 3.8 Flash</span>
          </span>

          <button
            type="button"
            onClick={clearAiChat}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700"
            title="Effacer la conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Messages Card */}
      <div className="flex-1 bg-[#111C2E] border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-xl">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {chatMessages.map(msg => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 flex-shrink-0 shadow-md shadow-emerald-500/20 mt-1">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-none shadow-md shadow-emerald-500/15'
                      : 'bg-slate-800/80 border border-slate-700/70 text-slate-200 rounded-tl-none shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap space-y-2">
                    {msg.content}
                  </div>

                  <div
                    className={`mt-2 pt-2 border-t flex items-center justify-between text-[10px] ${
                      isUser
                        ? 'border-emerald-600/40 text-emerald-950'
                        : 'border-slate-700 text-slate-400'
                    }`}
                  >
                    <span>{formatDateTime(msg.timestamp)}</span>
                    {!isUser && <span>{msg.source || 'Finova Engine'}</span>}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-700 border border-slate-600 flex items-center justify-center text-white flex-shrink-0 mt-1 font-bold text-xs">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
            );
          })}

          {/* AI Thinking Animation */}
          {isAiThinking && (
            <div className="flex gap-3 items-center text-xs text-slate-400">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <div className="flex items-center gap-1.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Finova AI consulte vos données consolidées et formule une réponse...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggested Prompts Shelf */}
        <div className="p-3 bg-slate-900/60 border-t border-slate-800/80 overflow-x-auto flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1 flex-shrink-0 pl-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            Suggestions :
          </span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-medium text-slate-300 hover:text-white transition-colors flex-shrink-0 whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-3"
        >
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Posez votre question financière à Finova AI..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isAiThinking}
            className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 disabled:opacity-40"
          >
            <span>Envoyer</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Regulatory Disclaimers Bottom Bar */}
      <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/60 flex items-start gap-2.5 text-[11px] text-slate-400 flex-shrink-0">
        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Confidentialité & Déontologie :</strong> Finova AI n'a accès qu'à des totaux consolidés anonymisés. Aucune information bancaire secrète n'est transmise. Finova AI ne délivre aucun conseil personnalisé en investissement soumis à agrément AMF.
        </div>
      </div>
    </div>
  );
};
