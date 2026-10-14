import React from 'react';

export type LegalModalType = 'mentions' | 'privacy' | 'terms' | null;

interface LegalModalProps {
  type: LegalModalType;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-[#0F172A] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">
            {type === 'mentions' && 'Mentions Légales'}
            {type === 'privacy' && 'Politique de Confidentialité & RGPD'}
            {type === 'terms' && 'Conditions Générales d\'Utilisation (CGU)'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white text-lg rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {type === 'mentions' && (
            <>
              <h4 className="text-sm font-bold text-white">1. Éditeur de la plateforme</h4>
              <p>
                Finova Finance est un service édité par la société <strong>Finova Technologies SAS</strong>, société par actions simplifiée au capital de 50 000 €, immatriculée au Registre du Commerce et des Sociétés de Paris sous le numéro RCS Paris B 982 410 120.
              </p>
              <p>
                Siège social : 14, Rue de la Paix, 75002 Paris, France.<br />
                Directeur de la publication : Équipe de direction Finova Finance.<br />
                Contact : contact@finova.fr
              </p>

              <h4 className="text-sm font-bold text-white pt-2">2. Hébergement</h4>
              <p>
                L'infrastructure logicielle et les bases de données sont hébergées au sein de l'Union Européenne sur des centres de données certifiés ISO 27001, SOC 2 Type II et conformes aux directives de l'ANSSI.
              </p>

              <h4 className="text-sm font-bold text-white pt-2">3. Nature des services</h4>
              <p>
                Finova Finance est un outil d'agrégation d'informations financières et d'aide à la gestion budgétaire. Elle n'agit ni en qualité d'établissement de crédit, ni de prestataire de services d'investissement (PSI), ni de conseiller en investissements financiers (CIF). Aucune information diffusée ne constitue un conseil en investissement.
              </p>
            </>
          )}

          {type === 'privacy' && (
            <>
              <h4 className="text-sm font-bold text-white">1. Engagement de protection des données (RGPD)</h4>
              <p>
                Finova Finance applique strictement le Règlement Général sur la Protection des Données (RGPD 2016/679). Nous adhérons au principe de <em>Privacy by Design</em> et de minimisation des données.
              </p>

              <h4 className="text-sm font-bold text-white pt-2">2. Données collectées et finalités</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Données de compte : email et mot de passe chiffré (pour l'authentification).</li>
                <li>Données budgétaires : montants de transactions, libellés et plafonds (pour afficher vos bilans).</li>
                <li>Aucun mot de passe bancaire n'est jamais demandé ni stocké par Finova.</li>
              </ul>

              <h4 className="text-sm font-bold text-white pt-2">3. Droits des utilisateurs</h4>
              <p>
                Vous bénéficiez à tout moment d'un droit d'accès, de rectification, de portabilité (export complet au format JSON/CSV) et d'effacement de vos données personnelles (droit à l'oubli). Vous pouvez exercer ces droits directement depuis votre onglet Paramètres.
              </p>

              <h4 className="text-sm font-bold text-white pt-2">4. Absence de monétisation de vos données</h4>
              <p>
                Vos données financières ne sont ni vendues, ni louées, ni cédées à des courtiers ou annonceurs tiers. Notre modèle économique repose exclusivement sur nos formules d'abonnement transparentes.
              </p>
            </>
          )}

          {type === 'terms' && (
            <>
              <h4 className="text-sm font-bold text-white">1. Objet et acceptation</h4>
              <p>
                Les présentes Conditions Générales d'Utilisation régissent l'accès et l'utilisation de Finova Finance. En accédant au service, l'utilisateur accepte sans réserve les présentes conditions.
              </p>

              <h4 className="text-sm font-bold text-white pt-2">2. Responsabilité de l'utilisateur</h4>
              <p>
                L'utilisateur est seul responsable du maintien de la confidentialité de ses identifiants et de l'exactitude des informations budgétaires qu'il saisit ou importe.
              </p>

              <h4 className="text-sm font-bold text-white pt-2">3. Limite de responsabilité financière</h4>
              <p>
                Les estimations, graphiques de valorisation et réponses générées par Finova AI sont fournis à titre strictement indicatif et pédagogique. L'utilisateur demeure seul décisionnaire de ses arbitrages patrimoniaux et budgétaires. Finova décline toute responsabilité quant aux fluctuations des marchés financiers.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            Fermer le document
          </button>
        </div>
      </div>
    </div>
  );
};
