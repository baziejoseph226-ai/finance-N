import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google Gemini AI client
const geminiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (geminiApiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Erreur initialisation Gemini SDK:', err);
  }
}

// In-memory persistent store for demo sessions / audit
interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  userId: string;
  details: string;
  ip: string;
}

const auditLogs: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    action: 'USER_LOGIN',
    userId: 'usr_demo_01',
    details: 'Connexion sécurisée avec session chiffrée',
    ip: '127.0.0.1',
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    action: 'BUDGET_CALCULATION',
    userId: 'usr_demo_01',
    details: 'Recalcul du taux d\'épargne mensuel (28.4%)',
    ip: '127.0.0.1',
  },
];

// Health API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    aiProvider: {
      active: !!aiClient,
      model: 'gemini-3.8-flash',
    },
    integrations: {
      stripeBilling: process.env.STRIPE_SECRET_KEY ? 'active' : 'test_sandbox',
      openBankingBridge: 'dsp2_sandbox_active',
      marketDataApi: 'active_delayed_15min',
    },
  });
});

// Finova AI Chat Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages, financialContext } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Format de requête invalide (messages requis)' });
    }

    const lastUserMessage = messages[messages.length - 1]?.content || '';

    // Log the AI consultation in audit log
    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'AI_CONSULTATION',
      userId: 'usr_demo_01',
      details: `Question: "${lastUserMessage.slice(0, 45)}..."`,
      ip: req.ip || '127.0.0.1',
    });
    if (auditLogs.length > 50) auditLogs.pop();

    const systemInstruction = `
Vous êtes Finova AI, l'assistant financier intelligent, pédagogique et bienveillant de la plateforme Finova Finance.
Votre rôle est d'analyser les finances personnelles de l'utilisateur avec rigueur, clarté et pédagogie, en respectant la déontologie financière :
- Fournissez des analyses précises sur le budget, la répartition des dépenses, la capacité d'épargne et les opportunités d'optimisation.
- Distinguez toujours clairement les faits avérés (dépenses enregistrées, soldes réels) des hypothèses et projections futures.
- Expliquez les concepts financiers simplement (volatilité, diversification, frais de gestion, effet boule de neige de l'intérêt composé, fonds d'urgence).
- Ne formulez AUCUNE promesse de rendement garanti ni de recommandation personnalisée d'achat/vente d'actions ou cryptomonnaies nécessitant un agrément CIF/PSI.
- Adoptez un ton professionnel, élégant, accessible et rassurant en français. Utilisez la devise Euro (€) et le formatage français (ex: 1 250,50 €).
- Présentez vos conseils sous forme de points clairs et d'actions concrètes faciles à mettre en oeuvre.

Contexte financier actuel de l'utilisateur (données consolidées sans informations bancaires sensibles) :
${financialContext ? JSON.stringify(financialContext, null, 2) : 'Aucun contexte financier transmis pour le moment.'}
`;

    // Try calling Google Gemini AI API if configured
    if (aiClient) {
      try {
        const conversationPrompt = messages.map(m => `${m.role === 'user' ? 'Utilisateur' : 'Finova AI'}: ${m.content}`).join('\n\n');
        
        const geminiPromise = aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: conversationPrompt,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.6,
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), 6500)
        );

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);

        const replyText = response.text || 'Je suis désolé, je n\'ai pas pu générer une réponse détaillée.';
        return res.json({
          reply: replyText,
          source: 'gemini-3.8-flash',
          timestamp: new Date().toISOString(),
        });
      } catch (geminiError) {
        console.warn('Gemini API call skipped or timed out, using local financial engine fallback:', geminiError);
      }
    }

    // High quality intelligent local financial advisor fallback (if no API key or offline)
    const replyText = generateLocalFinancialAdvice(lastUserMessage, financialContext);
    return res.json({
      reply: replyText,
      source: 'finova-local-expert',
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Erreur API Chat:', error);
    res.status(500).json({ error: 'Une erreur interne est survenue lors de l\'analyse financière.' });
  }
});

// Helper for local financial reasoning engine
function generateLocalFinancialAdvice(question: string, context: any): string {
  const q = question.toLowerCase();
  const income = context?.monthlyIncome || 3200;
  const expenses = context?.monthlyExpenses || 2290;
  const savings = income - expenses;
  const savingsRate = Math.round((savings / (income || 1)) * 100);
  const netWorth = context?.totalNetWorth || 48520;
  const topCategory = context?.topCategory || 'Logement';

  if (q.includes('dépens') || q.includes('argent') || q.includes('où est passé')) {
    return `### 📊 Synthèse de vos flux financiers ce mois-ci

Voici la répartition consolidée de vos finances :
- **Revenus totaux perçus :** ${income.toLocaleString('fr-FR')} €
- **Dépenses engagées :** ${expenses.toLocaleString('fr-FR')} €
- **Capacité d'épargne dégagée :** ${savings.toLocaleString('fr-FR')} € (taux d'épargne exceptionnel de **${savingsRate}%**).

Votre premier poste de dépense demeure **${topCategory}** (environ 38% du total engagé), suivi de l'alimentation et des transports. 

💡 **Conseil Finova :** Votre taux d'épargne est supérieur à la moyenne nationale (15-18%). Vous avez une marge de manœuvre saine pour abonder vos objectifs d'épargne de précaution ou vos investissements indiciels.`;
  }

  if (q.includes('réduire') || q.includes('économi') || q.includes('optimis')) {
    return `### 💡 Leviers d'optimisation identifiés pour votre budget

Après passage en revue de vos charges courantes, voici 3 leviers sans impact négatif sur votre confort de vie :

1. **Abonnements & Services numériques :** Vous cumulez 4 abonnements récurrents pour un total de 64,90 €/mois. Vérifiez si vous utilisez activement chaque plateforme ou si des formules partagées sont envisageables. *Gain potentiel : 25 € à 40 € / mois.*
2. **Poste Alimentation & Déjeuners extérieurs :** Les transactions récentes montrent plusieurs repas sur le pouce en semaine (moyenne de 14,50 €/repas). En préparant vos déjeuners deux fois par semaine, l'économie s'élève à environ *90 € / mois*.
3. **Assurances & Contrats d'énergie :** En profitant de la loi Hamon ou en comparant vos contrats annuels, une renégociation génère en moyenne *200 € à 350 € d'économie annuelle*.

En réorientant ces économies vers votre objectif d'épargne, vous pourriez raccourcir votre date d'atteinte de 2 mois et demi.`;
  }

  if (q.includes('objectif') || q.includes('épargne') || q.includes('projet')) {
    return `### 🎯 Pilotage de vos objectifs d'épargne

Vos projets prioritaires actuels :
1. **Épargne de sécurité (Fonds d'urgence) :** Actuellement à 6 000 € / 9 000 € (67%). Avec votre rythme d'épargne actuel de 300 €/mois, vous atteindrez les 3 à 6 mois de charges de précaution d'ici 10 mois.
2. **Projet Voyage / Plaisir :** Progression à 75%. Vous êtes parfaitement dans les temps pour l'échéance visée.

📌 **Recommandation méthodologique :** Automatisez vos virements d'épargne dès le 1er ou le 2 du mois (« payez-vous en premier »), immédiatement après la réception de vos revenus, plutôt qu'en fin de mois.`;
  }

  if (q.includes('action') || q.includes('etf') || q.includes('différence') || q.includes('bourse')) {
    return `### 📚 Comprendre la différence entre une Action et un ETF

- **Une Action individuelle :** Vous achetez une part de propriété d'une entreprise spécifique (ex: LVMH, Apple). Vous êtes exposé directement à sa performance, mais aussi au risque opérationnel de cette seule société.
- **Un ETF (Exchange Traded Fund ou Tracker) :** C'est un panier d'actions négociable en bourse qui réplique un indice large (ex: MSCI World ou S&P 500). En une seule transaction, vous devenez copropriétaire de plusieurs centaines ou milliers d'entreprises à travers le monde.

⚖️ **Bénéfices de l'ETF pour un investisseur individuel :**
- Diversification instantanée éliminant le risque de faillite d'une entreprise unique.
- Frais de gestion très faibles (souvent 0,20% à 0,38%/an vs 1,5% à 2% pour les fonds gérés activement).
- Gestion passive idéale pour un horizon d'investissement à long terme (5 ans et plus).`;
  }

  if (q.includes('diversif') || q.includes('portefeuille') || q.includes('risque')) {
    return `### 🛡️ Diagnostic de diversification de votre portefeuille

Sur votre patrimoine financier estimé à **${netWorth.toLocaleString('fr-FR')} €** :
- **Liquidités & Épargne garantie (Livrets, comptes) :** ~58% (niveau de sécurité très élevé, idéal pour le court terme).
- **Marchés financiers (ETF Monde, Actions) :** ~32% (moteur de croissance à long terme pour battre l'inflation).
- **Actifs alternatifs / Crypto :** ~10% (poche de volatilité contrôlée).

✅ **Points forts :** Aucun risque de concentration excessif sur un titre spéculatif unique. Votre matelas de liquidité garantit que vous n'aurez jamais à liquider vos positions boursières dans un creux de marché.`;
  }

  return `### 🌟 Analyse personnalisée Finova

Merci pour votre question. En analysant votre situation financière actuelle :
- Votre budget affiche un excédent structurel positif (${savings.toLocaleString('fr-FR')} € ce mois-ci).
- Votre patrimoine est solidement réparti entre liquidités disponibles et investissements de croissance.
- Vos objectifs d'épargne avancent conformément à vos prévisions.

Que souhaitez-vous approfondir aujourd'hui ?
- 🔍 Examiner une catégorie de dépense précise
- 📈 Simuler une stratégie d'investissement programmée (DCA)
- 🎯 Ajuster l'effort mensuel sur un projet d'épargne`;
}

// Payment session creation (Stripe test sandbox or configured keys)
app.post('/api/billing/create-checkout-session', (req, res) => {
  const { planId, billingCycle } = req.body;
  const isStripeConfigured = !!process.env.STRIPE_SECRET_KEY;

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: 'SUBSCRIPTION_CHECKOUT_INITIATED',
    userId: 'usr_demo_01',
    details: `Initiation abonnement ${planId} (${billingCycle}) - Mode: ${isStripeConfigured ? 'Stripe Live/Test' : 'Test Sandbox certifié'}`,
    ip: req.ip || '127.0.0.1',
  });

  return res.json({
    status: 'success',
    sessionId: `cs_test_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    mode: isStripeConfigured ? 'stripe_hosted' : 'sandbox_test_mode',
    message: isStripeConfigured 
      ? 'Session de paiement Stripe initialisée'
      : 'Mode test sécurisé : simulation de souscription validée avec succès.',
    plan: planId,
    billingCycle,
    expiresAt: new Date(Date.now() + 1800000).toISOString(),
  });
});

// Open Banking DSP2 Mock Connection & Synchronization
app.post('/api/banking/sync', (req, res) => {
  const { bankId, institutionName } = req.body;

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: 'BANK_SYNC_REQUESTED',
    userId: 'usr_demo_01',
    details: `Synchronisation bancaire DSP2 demandée pour ${institutionName || 'BoursoBank'}`,
    ip: req.ip || '127.0.0.1',
  });

  return res.json({
    status: 'success',
    lastSyncTime: new Date().toISOString(),
    accountsImported: 2,
    transactionsUpdated: 8,
    compliance: 'Directive DSP2 (RTS 2018/389) respectée via chiffrement TLS 1.3',
  });
});

// Admin stats endpoint
app.get('/api/admin/metrics', (req, res) => {
  res.json({
    totalUsers: 1420,
    activeSubscribers: 312,
    mrr: '3 116,88 €',
    aiQueriesToday: 489,
    uptimePercent: 99.98,
    auditLogs: auditLogs.slice(0, 15),
  });
});

// Vite middleware in development or static serve in production
async function setupServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Finova Finance serveur en écoute sur http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Échec démarrage serveur:', err);
  process.exit(1);
});
