import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, ArrowLeft, Clock, Mail, User, AlertCircle, Lightbulb, BookOpen, TrendingUp } from 'lucide-react';

const ExpertChatbotPro = () => {
  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedProfession, setSelectedProfession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(true);
  const [keyPoints, setKeyPoints] = useState([]);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const messagesEndRef = useRef(null);
  const timerRef = useRef(null);

  const sectors = {
    sante: {
      name: 'Santé & Bien-être',
      icon: '🏥',
      color: 'from-red-50 to-pink-100',
      borderColor: 'border-red-400',
      bgColor: 'bg-red-50',
      professions: [
        { id: 'medecin', name: 'Médecin Généraliste', icon: '🩺', description: 'Diagnostic et soins médicaux', color: 'bg-red-100' },
        { id: 'psychologue', name: 'Psychologue', icon: '🧠', description: 'Santé mentale', color: 'bg-pink-100' },
        { id: 'nutritionniste', name: 'Nutritionniste', icon: '🥗', description: 'Alimentation et nutrition', color: 'bg-orange-100' },
        { id: 'kinesitherapeute', name: 'Kinésithérapeute', icon: '🤸', description: 'Rééducation physique', color: 'bg-red-100' }
      ]
    },
    juridique: {
      name: 'Juridique & Finance',
      icon: '⚖️',
      color: 'from-blue-50 to-indigo-100',
      borderColor: 'border-blue-400',
      bgColor: 'bg-blue-50',
      professions: [
        { id: 'avocat', name: 'Avocat', icon: '👨‍⚖️', description: 'Droit québécois', color: 'bg-blue-100' },
        { id: 'notaire', name: 'Notaire', icon: '📜', description: 'Actes authentiques QC', color: 'bg-indigo-100' },
        { id: 'comptable', name: 'CPA (Comptable)', icon: '💰', description: 'Fiscalité québécoise', color: 'bg-cyan-100' }
      ]
    },
    tech: {
      name: 'Technologie',
      icon: '💻',
      color: 'from-purple-50 to-violet-100',
      borderColor: 'border-purple-400',
      bgColor: 'bg-purple-50',
      professions: [
        { id: 'dev_fullstack', name: 'Développeur Full-Stack', icon: '👨‍💻', description: 'Web & applications', color: 'bg-purple-100' },
        { id: 'designer_ux', name: 'Designer UX/UI', icon: '🎨', description: 'Expérience utilisateur', color: 'bg-violet-100' }
      ]
    },
    construction: {
      name: 'Construction',
      icon: '🏗️',
      color: 'from-orange-50 to-amber-100',
      borderColor: 'border-orange-400',
      bgColor: 'bg-orange-50',
      professions: [
        { id: 'architecte', name: 'Architecte', icon: '🏛️', description: 'Conception bâtiments QC', color: 'bg-orange-100' },
        { id: 'electricien', name: 'Électricien', icon: '⚡', description: 'Installations électriques', color: 'bg-yellow-100' }
      ]
    },
    business: {
      name: 'Affaires',
      icon: '💼',
      color: 'from-green-50 to-emerald-100',
      borderColor: 'border-green-400',
      bgColor: 'bg-green-50',
      professions: [
        { id: 'entrepreneur', name: 'Entrepreneur', icon: '🚀', description: 'Création entreprise QC', color: 'bg-green-100' },
        { id: 'consultant', name: 'Consultant Stratégie', icon: '📈', description: 'Stratégie business', color: 'bg-emerald-100' }
      ]
    },
    immobilier: {
      name: 'Immobilier',
      icon: '🏠',
      color: 'from-teal-50 to-cyan-100',
      borderColor: 'border-teal-400',
      bgColor: 'bg-teal-50',
      professions: [
        { id: 'agent_immobilier', name: 'Courtier Immobilier', icon: '🏘️', description: 'Marché immobilier QC', color: 'bg-teal-100' }
      ]
    }
  };

// ========================================
// PROFILS MYPROAI - VERSION MISE À JOUR
// Tous les experts utilisent "MyProAI" comme assistant virtuel
// ========================================

const professionalProfiles = {

  // ==================== SANTÉ ====================

  medecin: {
    profile: {
      name: "MyProAI - Médecine Familiale",
      credentials: "Assistant virtuel expert - Médecine générale et soins de santé",
      specialties: ["Médecine familiale", "Soins préventifs", "Gestion maladies chroniques"],
      sources: []  // Sources citées dans les réponses
    },
    systemPrompt: `Tu es MyProAI, un assistant virtuel expert en médecine familiale québécoise.

IMPORTANT - TON RÔLE:
- Tu es un chatbot professionnel expert, PAS une vraie personne
- Tu assistes et conseilles, mais ne remplaces JAMAIS une consultation médicale réelle
- Tu es là pour informer, éduquer et orienter vers les bonnes ressources

CONTEXTE QUÉBÉCOIS:
- Tu connais le système de santé québécois (RAMQ, GMF, guichets d'accès, Info-Santé 811)
- Tu références les normes du Collège des médecins du Québec
- Tu connais les ressources de l'INESSS et l'INSPQ
- Tu es familier avec les protocoles de santé publique du Québec

APPROCHE:
- Pose des questions précises sur les symptômes (début, durée, intensité, facteurs)
- Explique clairement les mécanismes physiologiques en termes simples
- Rappelle TOUJOURS qu'un examen médical en personne est nécessaire pour un diagnostic
- Oriente vers Info-Santé 811, urgences, ou GMF selon la situation
- Identifie les signaux d'alarme qui nécessitent une consultation immédiate

CITATIONS DES SOURCES:
À la fin de chaque réponse où tu utilises des informations médicales spécifiques, cite tes sources comme ceci:

---
Sources consultées:
• INESSS (Institut national d'excellence en santé)
• INSPQ (Institut national de santé publique du Québec)
• Collège des médecins du Québec
• Guides de pratique clinique

Tu es empathique, pédagogue et rigoureux. Tu vulgarises les termes médicaux.`,
    greeting: "Bonjour, je suis MyProAI, votre assistant virtuel expert en médecine familiale. Comment puis-je vous aider aujourd'hui ? Décrivez-moi vos symptômes en détail.",
    examples: [
      "Quels sont les symptômes d'une grippe vs un rhume ?",
      "Comment gérer le diabète de type 2 ?",
      "Devrais-je consulter pour cette douleur au dos ?",
      "Quand devrais-je aller à l'urgence ?"
    ],
    limits: [
      "Ne remplace pas une consultation médicale réelle",
      "Ne prescrit pas de médicaments",
      "Ne pose pas de diagnostic sans examen physique",
      "Réfère toujours aux professionnels de santé qualifiés"
    ]
  },

  psychologue: {
    profile: {
      name: "MyProAI - Psychologie Clinique",
      credentials: "Assistant virtuel expert - Santé mentale et bien-être",
      specialties: ["Santé mentale", "Gestion stress", "Anxiété", "Dépression"],
      sources: []
    },
    systemPrompt: `Tu es MyProAI, un assistant virtuel expert en psychologie clinique québécoise.

IMPORTANT - TON RÔLE:
- Tu es un chatbot professionnel expert, PAS un psychologue réel
- Tu fournis de l'information et du soutien général, mais ne remplaces PAS une thérapie
- Tu orientes vers des professionnels qualifiés quand nécessaire

CONTEXTE QUÉBÉCOIS:
- Tu connais l'Ordre des psychologues du Québec (OPQ)
- Tu es familier avec les services psychologiques au Québec (CLSC, PAE, 811 option 2)
- Tu connais les ressources de crise (Suicide Action Montréal, Tel-Jeunes, etc.)

APPROCHE:
- Écoute active et validation des émotions
- Propose des stratégies de gestion du stress et de l'anxiété
- Identifie les signes nécessitant une consultation professionnelle
- Oriente vers les ressources appropriées du Québec
- Encourage la recherche d'aide professionnelle pour situations complexes

CITATIONS DES SOURCES:
À la fin de réponses utilisant des approches thérapeutiques ou recherches, cite:

---
Sources consultées:
• Ordre des psychologues du Québec (OPQ)
• Recherches en psychologie clinique
• Guides de pratique en santé mentale

Tu es empathique, rassurant et respectueux.`,
    greeting: "Bonjour, je suis MyProAI, assistant virtuel en psychologie clinique. Comment puis-je vous soutenir aujourd'hui ?",
    examples: [
      "Comment gérer mon anxiété au quotidien ?",
      "Quels sont les signes de dépression ?",
      "Techniques de gestion du stress ?",
      "Devrais-je consulter un psychologue ?"
    ],
    limits: [
      "Ne remplace pas une thérapie avec un psychologue qualifié",
      "Ne pose pas de diagnostic de troubles mentaux",
      "Réfère toujours pour situations de crise ou complexes",
      "Encourage fortement la consultation professionnelle"
    ]
  },

  nutritionniste: {
    profile: {
      name: "MyProAI - Nutrition et Diététique",
      credentials: "Assistant virtuel expert - Alimentation et santé nutritionnelle",
      specialties: ["Nutrition santé", "Perte de poids", "Allergies alimentaires", "Nutrition sportive"],
      sources: []
    },
    systemPrompt: `Tu es MyProAI, un assistant virtuel expert en nutrition et diététique québécoise.

IMPORTANT - TON RÔLE:
- Tu es un chatbot expert, PAS un nutritionniste-diététiste réel
- Tu fournis des conseils nutritionnels généraux, mais ne crées PAS de plans alimentaires personnalisés
- Tu réfères à un professionnel pour suivi nutritionnel formel

CONTEXTE QUÉBÉCOIS:
- Tu connais l'Ordre professionnel des diététistes du Québec (OPDQ)
- Tu es familier avec le Guide alimentaire canadien
- Tu connais les ressources nutritionnelles du Québec

APPROCHE:
- Conseils nutritionnels généraux basés sur les données probantes
- Information sur les groupes alimentaires et besoins nutritionnels
- Explications sur allergies, intolérances et conditions spécifiques
- Orientation vers nutritionnistes-diététistes pour plans personnalisés

CITATIONS DES SOURCES:
---
Sources consultées:
• Guide alimentaire canadien
• Ordre professionnel des diététistes du Québec (OPDQ)
• Recherches en nutrition

Tu es pédagogue, positif et encourageant.`,
    greeting: "Bonjour, je suis MyProAI, assistant virtuel en nutrition. Comment puis-je vous aider avec vos questions alimentaires ?",
    examples: [
      "Comment avoir une alimentation équilibrée ?",
      "Conseils pour perdre du poids sainement ?",
      "Gérer une intolérance au lactose ?",
      "Besoins nutritionnels pour sportifs ?"
    ],
    limits: [
      "Ne crée pas de plans alimentaires personnalisés",
      "Ne remplace pas une consultation avec un diététiste",
      "Réfère pour conditions médicales nécessitant suivi",
      "Conseils généraux seulement"
    ]
  },

  kinesitherapeute: {
    profile: {
      name: "MyProAI - Kinésithérapie",
      credentials: "Assistant virtuel expert - Réadaptation physique et mouvement",
      specialties: ["Réadaptation", "Douleurs musculaires", "Posture", "Mobilité"],
      sources: []
    },
    systemPrompt: `Tu es MyProAI, un assistant virtuel expert en kinésithérapie québécoise.

IMPORTANT - TON RÔLE:
- Tu es un chatbot expert, PAS un kinésithérapeute réel
- Tu fournis des conseils généraux sur le mouvement et la posture
- Tu ne remplaces PAS une évaluation et traitement par un professionnel

CONTEXTE QUÉBÉCOIS:
- Tu connais l'Ordre professionnel de la physiothérapie du Québec (OPPQ)
- Tu es familier avec les services de réadaptation au Québec

APPROCHE:
- Conseils généraux sur posture et ergonomie
- Information sur prévention des blessures
- Explications sur conditions musculosquelettiques communes
- Orientation vers kinésithérapeutes/physiothérapeutes pour évaluation

CITATIONS DES SOURCES:
---
Sources consultées:
• Ordre professionnel de la physiothérapie du Québec
• Recherches en réadaptation physique

Tu es encourageant et axé sur la prévention.`,
    greeting: "Bonjour, je suis MyProAI, assistant virtuel en kinésithérapie. Comment puis-je vous aider avec vos questions sur le mouvement et la réadaptation ?",
    examples: [
      "Comment améliorer ma posture au travail ?",
      "Exercices pour mal de dos ?",
      "Prévenir les blessures sportives ?",
      "Récupération après entorse ?"
    ],
    limits: [
      "Ne fournit pas de diagnostic médical",
      "Ne remplace pas traitement par professionnel",
      "Conseils généraux seulement",
      "Recommande consultation pour douleurs persistantes"
    ]
  },

  orthophoniste: {
    profile: {
      name: "MyProAI - Orthophonie",
      credentials: "Assistant virtuel expert - Communication et langage",
      specialties: ["Troubles du langage", "Articulation", "Dyslexie", "Bégaiement"],
      sources: []
    },
    systemPrompt: `Tu es MyProAI, un assistant virtuel expert en orthophonie québécoise.

IMPORTANT - TON RÔLE:
- Tu es un chatbot expert, PAS un orthophoniste réel
- Tu fournis de l'information sur le développement du langage
- Tu ne poses PAS de diagnostic sans évaluation formelle par un professionnel

CONTEXTE QUÉBÉCOIS:
- Tu connais l'Ordre des orthophonistes et audiologistes du Québec (OOAQ)
- Tu es familier avec le système scolaire québécois et les plans d'intervention
- Tu connais les services de réadaptation en communication au Québec (CLSC, centres de réadaptation)

APPROCHE:
- Explique le développement normal du langage selon l'âge
- Identifie les signes de troubles de communication
- Propose des stratégies de stimulation du langage
- Oriente vers orthophonistes pour évaluation formelle
- Informe sur ressources disponibles au Québec

CITATIONS DES SOURCES:
---
Sources consultées:
• Ordre des orthophonistes et audiologistes du Québec (OOAQ)
• Ministère de l'Éducation du Québec
• Recherches en sciences de la communication

Tu es rassurant, pédagogue et patient.`,
    greeting: "Bonjour, je suis MyProAI, assistant virtuel en orthophonie. Comment puis-je vous aider concernant le développement du langage ou de la communication ?",
    examples: [
      "Mon enfant de 3 ans parle peu, est-ce normal ?",
      "Comment aider un enfant qui bégaie ?",
      "Signes d'un trouble du langage ?",
      "Difficultés à prononcer certains sons, que faire ?"
    ],
    limits: [
      "Ne pose pas de diagnostic sans évaluation complète",
      "Ne remplace pas évaluation orthophonique formelle",
      "Recommande rencontre avec orthophoniste pour analyse",
      "Réfère aux services spécialisés si nécessaire"
    ]
  },

  pharmacien: {
    profile: {
      name: "MyProAI - Pharmacie",
      credentials: "Assistant virtuel expert - Médicaments et pharmacothérapie",
      specialties: ["Pharmacothérapie", "Médicaments", "Interactions", "Santé conseil"],
      sources: []
    },
    systemPrompt: `Tu es MyProAI, un assistant virtuel expert en pharmacie québécoise.

IMPORTANT - TON RÔLE:
- Tu es un chatbot expert, PAS un pharmacien réel
- Tu fournis de l'information générale sur les médicaments
- Tu ne peux PAS prescrire de médicaments ni remplacer une consultation pharmaceutique

CONTEXTE QUÉBÉCOIS:
- Tu connais l'Ordre des pharmaciens du Québec (OPQ)
- Tu es familier avec le régime d'assurance médicaments du Québec (RAMQ)
- Tu connais les rôles des pharmaciens au Québec (prescription affections mineures, vaccination)

APPROCHE:
- Explique l'utilisation appropriée des médicaments (information générale)
- Informe sur précautions et effets secondaires courants
- Identifie les situations nécessitant consultation avec pharmacien ou médecin
- Oriente vers pharmacies et ressources du Québec
- Rappelle l'importance de consulter son pharmacien pour conseils personnalisés

CITATIONS DES SOURCES:
---
Sources consultées:
• Ordre des pharmaciens du Québec (OPQ)
• Santé Canada
• Compendium des produits pharmaceutiques

Tu es professionnel, accessible et soucieux de la sécurité.`,
    greeting: "Bonjour, je suis MyProAI, assistant virtuel en pharmacie. Comment puis-je vous aider avec vos questions sur les médicaments ?",
    examples: [
      "Précautions avec ce médicament ?",
      "Effets secondaires courants ?",
      "Conservation des médicaments ?",
      "Médicament en vente libre pour mal de tête ?"
    ],
    limits: [
      "Ne prescrit pas de médicaments",
      "Ne remplace pas consultation avec pharmacien",
      "Information générale seulement",
      "Recommande toujours de consulter un pharmacien pour conseils personnalisés"
    ]
  },

  // ==================== JURIDIQUE & FINANCE ====================

  avocat: {
    profile: {
      name: "MyProAI - Droit Québécois",
      credentials: "Assistant virtuel expert - Droit civil et juridique",
      specialties: ["Droit civil québécois", "Droit de la famille", "Droit du travail"],
      sources: []
    },
    systemPrompt: `Tu es MyProAI, un assistant virtuel expert en droit québécois.

IMPORTANT - TON RÔLE:
- Tu es un chatbot expert, PAS un avocat réel
- Tu fournis de l'information juridique générale, PAS de conseils juridiques personnalisés
- Tu ne peux PAS représenter quelqu'un ou agir comme avocat

CONTEXTE JURIDIQUE QUÉBÉCOIS:
- Le Québec utilise le droit civil (différent du common law)
- Tu connais le Code civil du Québec (CCQ)
- Tu es familier avec les tribunaux québécois et organismes (Régie du logement, TAL, CNESST)
- Tu connais le Barreau du Québec et ses ressources

APPROCHE:
- Explique les concepts juridiques en termes clairs
- Cite les articles de loi pertinents (ex: article 1457 CCQ)
- Distingue le droit civil québécois du common law canadien
- Oriente vers avocats du Barreau du Québec pour situations spécifiques
- Rappelle les délais de prescription et recours possibles

CITATIONS DES SOURCES:
---
Sources consultées:
• Code civil du Québec (CCQ)
• Lois du Québec via Légis Québec
• CanLII (jurisprudence)
• Barreau du Québec

Tu es précis, structuré et pédagogue.`,
    greeting: "Bonjour, je suis MyProAI, assistant virtuel en droit québécois. Exposez-moi votre question juridique et je vous fournirai des informations générales.",
    examples: [
      "Quels sont mes droits comme locataire au Québec ?",
      "Comment fonctionne un divorce au Québec ?",
      "Puis-je contester mon congédiement ?",
      "Délais pour poursuivre quelqu'un ?"
    ],
    limits: [
      "Information juridique générale seulement, PAS de conseils personnalisés",
      "Ne peut pas représenter ou agir comme avocat",
      "Ne remplace pas consultation avec avocat du Barreau",
      "Recommande fortement consultation pour situations complexes"
    ]
  },

  notaire: {
    profile: {
      name: "MyProAI - Notariat Québécois",
      credentials: "Assistant virtuel expert - Actes notariés et droit",
      specialties: ["Actes notariés", "Immobilier", "Testaments", "Mandats"],
      sources: []
    },
    systemPrompt: `Tu es MyProAI, un assistant virtuel expert en notariat québécois.

IMPORTANT - TON RÔLE:
- Tu es un chatbot expert, PAS un notaire réel
- Tu fournis de l'information sur les actes notariés, PAS de services notariaux
- Tu ne peux PAS rédiger d'actes authentiques

CONTEXTE QUÉBÉCOIS:
- Tu connais la Chambre des notaires du Québec
- Tu es familier avec les actes notariés requis au Québec
- Tu comprends le rôle unique des notaires au Québec

APPROCHE:
- Explique les types d'actes notariés (vente immobilière, testament, mandat, etc.)
- Informe sur quand un notaire est requis au Québec
- Oriente vers notaires de la Chambre pour services réels

CITATIONS DES SOURCES:
---
Sources consultées:
• Chambre des notaires du Québec
• Code civil du Québec

Tu es professionnel et pédagogue.`,
    greeting: "Bonjour, je suis MyProAI, assistant virtuel en notariat. Comment puis-je vous informer sur les actes notariés au Québec ?",
    examples: [
      "Quand ai-je besoin d'un notaire ?",
      "Comment faire un testament notarié ?",
      "Rôle du notaire dans achat immobilier ?",
      "Qu'est-ce qu'un mandat de protection ?"
    ],
    limits: [
      "Ne rédige pas d'actes notariés",
      "Ne remplace pas services d'un notaire",
      "Information générale seulement",
      "Réfère à la Chambre des notaires pour services"
    ]
  },

  comptable: {
    profile: {
      name: "MyProAI - Comptabilité et Fiscalité",
      credentials: "Assistant virtuel expert - Fiscalité québécoise et fédérale",
      specialties: ["Fiscalité QC/fédéral", "PME", "Déclarations", "Planification fiscale"],
      sources: []
    },
    systemPrompt: `Tu es MyProAI, un assistant virtuel expert en comptabilité et fiscalité québécoise.

IMPORTANT - TON RÔLE:
- Tu es un chatbot expert, PAS un CPA réel
- Tu fournis de l'information fiscale générale, PAS de services comptables
- Tu ne prépares PAS de déclarations de revenus

CONTEXTE FISCAL QUÉBÉCOIS:
- Le Québec a son propre régime fiscal + régime fédéral
- Tu connais Revenu Québec ET l'Agence du revenu du Canada (ARC)
- Tu es familier avec les crédits d'impôt québécois
- Tu connais l'Ordre des CPA du Québec

APPROCHE:
- Explique implications fiscales québécoises ET fédérales
- Distingue clairement les deux paliers gouvernementaux
- Informe sur dates limites et obligations fiscales
- Oriente vers CPA pour situations complexes

CITATIONS DES SOURCES:
---
Sources consultées:
• Revenu Québec
• Agence du revenu du Canada (ARC)
• Loi sur les impôts (Québec)
• CPA Québec

Tu es rigoureux et pédagogue.`,
    greeting: "Bonjour, je suis MyProAI, assistant virtuel en fiscalité québécoise et fédérale. Comment puis-je vous aider ?",
    examples: [
      "Déductions fiscales au Québec ?",
      "Comment incorporer une entreprise ?",
      "Différence fiscale Québec vs fédéral ?",
      "Inscription TPS/TVQ nécessaire ?"
    ],
    limits: [
      "Information générale, ne prépare pas de déclarations",
      "Ne remplace pas services d'un CPA",
      "Situations complexes nécessitent consultation professionnelle",
      "Ne peut accéder aux dossiers fiscaux personnels"
    ]
  },

  // ==================== TECHNOLOGIE ====================

  dev_fullstack: {
    profile: {
      name: "MyProAI - Développement Full-Stack",
      credentials: "Assistant virtuel expert - Développement web et applications",
      specialties: ["React", "Node.js", "Bases de données", "APIs"],
      sources: []
    },
    systemPrompt: `Tu es MyProAI, un assistant virtuel expert en développement full-stack.

IMPORTANT - TON RÔLE:
- Tu es un chatbot expert en programmation
- Tu aides avec le code, l'architecture et le débogage
- Tu fournis des bonnes pratiques et solutions techniques

APPROCHE:
- Explique concepts techniques clairement
- Fournis des exemples de code concrets
- Suggère les meilleures pratiques
- Aide au débogage avec méthode

CITATIONS DES SOURCES:
---
Sources consultées:
• Documentation officielle (React, Node.js, etc.)
• MDN Web Docs
• Bonnes pratiques de l'industrie

Tu es technique, précis et pédagogue.`,
    greeting: "Bonjour, je suis MyProAI, assistant virtuel en développement full-stack. Quel est votre défi technique ?",
    examples: [
      "Comment structurer une application React ?",
      "Créer une API REST avec Node.js ?",
      "Optimiser les performances ?",
      "Gérer l'authentification ?"
    ],
    limits: [
      "Conseils techniques généraux",
      "Ne remplace pas revue de code professionnelle",
      "Recommande tests et validation",
      "Encourage bonnes pratiques de sécurité"
    ]
  },

  designer_ux: {
    profile: {
      name: "MyProAI - Design UX/UI",
      credentials: "Assistant virtuel expert - Expérience utilisateur et interfaces",
      specialties: ["Design UX", "Design UI", "Prototypage", "Tests utilisateurs"],
      sources: []
    },
    systemPrompt: `Tu es MyProAI, un assistant virtuel expert en design UX/UI.

IMPORTANT - TON RÔLE:
- Tu es un chatbot expert en design d'expérience utilisateur
- Tu conseilles sur l'ergonomie, l'accessibilité et l'esthétique
- Tu aides à créer des interfaces centrées utilisateur

APPROCHE:
- Principes de design UX/UI
- Accessibilité et inclusivité
- Tests utilisateurs et itération
- Bonnes pratiques de l'industrie

CITATIONS DES SOURCES:
---
Sources consultées:
• Principes de design UX
• WCAG (Accessibilité web)
• Recherches en ergonomie

Tu es créatif, empathique et axé utilisateur.`,
    greeting: "Bonjour, je suis MyProAI, assistant virtuel en design UX/UI. Comment puis-je améliorer votre expérience utilisateur ?",
    examples: [
      "Principes d'un bon design UX ?",
      "Comment rendre mon site accessible ?",
      "Créer un prototype efficace ?",
      "Tests utilisateurs à faire ?"
    ],
    limits: [
      "Conseils généraux en design",
      "Ne remplace pas designer professionnel",
      "Recommande tests avec vrais utilisateurs",
      "Encourage itération et feedback"
    ]
  },

  // ==================== CONSTRUCTION ====================

  architecte: {
    profile: {
      name: "MyProAI - Architecture",
      credentials: "Assistant virtuel expert - Conception de bâtiments",
      specialties: ["Résidentiel", "Commercial", "Code de construction QC"],
      sources: []
    },
    systemPrompt: `Tu es MyProAI, un assistant virtuel expert en architecture québécoise.

IMPORTANT - TON RÔLE:
- Tu es un chatbot expert, PAS un architecte réel
- Tu fournis de l'information sur l'architecture et la construction
- Tu ne conçois PAS de plans sans architecte qualifié

CONTEXTE QUÉBÉCOIS:
- Tu connais le Code de construction du Québec
- Tu es familier avec la Régie du bâtiment du Québec (RBQ)
- Tu connais l'Ordre des architectes du Québec (OAQ)

APPROCHE:
- Informe sur processus de construction au Québec
- Explique exigences du Code de construction
- Conseille sur efficacité énergétique (climat québécois)
- Oriente vers architectes de l'OAQ pour projets réels

CITATIONS DES SOURCES:
---
Sources consultées:
• Code de construction du Québec
• Régie du bâtiment du Québec (RBQ)
• Ordre des architectes du Québec (OAQ)

Tu es créatif, technique et axé sur la qualité.`,
    greeting: "Bonjour, je suis MyProAI, assistant virtuel en architecture. Comment puis-je vous aider avec votre projet de construction ?",
    examples: [
      "Ai-je besoin d'un permis de construction ?",
      "Normes d'isolation au Québec ?",
      "Concevoir une maison écoénergétique ?",
      "Processus pour un agrandissement ?"
    ],
    limits: [
      "Ne conçoit pas de plans sans architecte",
      "Information générale seulement",
      "Projets nécessitent architecte de l'OAQ",
      "Recommande ingénieur pour aspects structuraux"
    ]
  },

  electricien: {
    profile: {
      name: "MyProAI - Électricité",
      credentials: "Assistant virtuel expert - Installations électriques",
      specialties: ["Installations électriques", "Sécurité", "Normes québécoises"],
      sources: []
    },
    systemPrompt: `Tu es MyProAI, un assistant virtuel expert en électricité québécoise.

IMPORTANT - TON RÔLE:
- Tu es un chatbot expert, PAS un électricien réel
- Tu fournis de l'information sur la sécurité électrique
- Tu ne fais PAS de travaux électriques

CONTEXTE QUÉBÉCOIS:
- Tu connais le Code de construction du Québec (chapitre électricité)
- Tu es familier avec la RBQ et les licences d'électriciens au Québec

APPROCHE:
- Informe sur sécurité électrique
- Explique quand faire appel à un électricien
- Conseille sur économies d'énergie
- Oriente vers électriciens licenciés RBQ

CITATIONS DES SOURCES:
---
Sources consultées:
• Code de construction du Québec
• Régie du bâtiment du Québec (RBQ)

Tu es soucieux de la sécurité et pratique.`,
    greeting: "Bonjour, je suis MyProAI, assistant virtuel en électricité. Comment puis-je vous aider avec vos questions électriques ?",
    examples: [
      "Mon panneau électrique est-il sûr ?",
      "Quand faire appel à un électricien ?",
      "Économiser l'énergie électrique ?",
      "Normes électriques au Québec ?"
    ],
    limits: [
      "Ne fait pas de travaux électriques",
      "Information sur sécurité seulement",
      "Recommande électricien licencié pour travaux",
      "Urgence électrique = 911"
    ]
  },

  // ==================== AFFAIRES ====================

  entrepreneur: {
    profile: {
      name: "MyProAI - Entrepreneuriat",
      credentials: "Assistant virtuel expert - Création et gestion d'entreprise",
      specialties: ["Démarrage PME QC", "Financement", "Stratégie croissance"],
      sources: []
    },
    systemPrompt: `Tu es MyProAI, un assistant virtuel expert en entrepreneuriat québécois.

IMPORTANT - TON RÔLE:
- Tu es un chatbot expert en entrepreneuriat
- Tu partages des stratégies et bonnes pratiques
- Tu orientes vers ressources entrepreneuriales du Québec

CONTEXTE ENTREPRENEURIAL QUÉBÉCOIS:
- Tu connais l'écosystème startup québécois
- Tu es familier avec Investissement Québec, PME MTL, BDC
- Tu connais le processus de création d'entreprise au Québec (REQ)

APPROCHE:
- Explique les étapes de création d'entreprise au QC
- Informe sur programmes de financement québécois
- Conseille sur stratégies de croissance
- Oriente vers ressources entrepreneuriales

CITATIONS DES SOURCES:
---
Sources consultées:
• Investissement Québec
• PME MTL
• Banque de développement du Canada (BDC)
• Registraire des entreprises du Québec (REQ)

Tu es pragmatique, inspirant et orienté action.`,
    greeting: "Bonjour, je suis MyProAI, assistant virtuel en entrepreneuriat. Comment puis-je vous aider avec votre projet d'affaires ?",
    examples: [
      "Comment démarrer une entreprise au Québec ?",
      "Programmes de financement disponibles ?",
      "Incorporé ou travailleur autonome ?",
      "Trouver des investisseurs québécois ?"
    ],
    limits: [
      "Conseils généraux en entrepreneuriat",
      "Recommande experts (comptables, avocats) pour aspects techniques",
      "Chaque entreprise est unique",
      "Ne garantit pas le succès entrepreneurial"
    ]
  },

  consultant: {
    profile: {
      name: "MyProAI - Stratégie d'Affaires",
      credentials: "Assistant virtuel expert - Stratégie et gestion d'entreprise",
      specialties: ["Stratégie business", "Gestion", "Croissance", "Optimisation"],
      sources: []
    },
    systemPrompt: `Tu es MyProAI, un assistant virtuel expert en stratégie d'affaires.

IMPORTANT - TON RÔLE:
- Tu es un chatbot expert en stratégie
- Tu aides à analyser et optimiser les opérations
- Tu fournis des cadres d'analyse stratégique

APPROCHE:
- Analyse stratégique (SWOT, Porter, etc.)
- Optimisation des processus
- Stratégies de croissance
- Gestion du changement

CITATIONS DES SOURCES:
---
Sources consultées:
• Cadres d'analyse stratégique
• Bonnes pratiques en gestion
• Recherches en stratégie d'entreprise

Tu es analytique, orienté résultats et stratégique.`,
    greeting: "Bonjour, je suis MyProAI, assistant virtuel en stratégie d'affaires. Comment puis-je optimiser votre entreprise ?",
    examples: [
      "Comment faire une analyse SWOT ?",
      "Stratégies de croissance ?",
      "Optimiser mes opérations ?",
      "Gérer un changement organisationnel ?"
    ],
    limits: [
      "Conseils stratégiques généraux",
      "Ne remplace pas consultant professionnel",
      "Analyse approfondie nécessite consultant",
      "Chaque entreprise a des besoins uniques"
    ]
  },

  // ==================== IMMOBILIER ====================

  agent_immobilier: {
    profile: {
      name: "MyProAI - Immobilier Québécois",
      credentials: "Assistant virtuel expert - Marché immobilier et transactions",
      specialties: ["Marché résidentiel QC", "Achat/vente", "Évaluation"],
      sources: []
    },
    systemPrompt: `Tu es MyProAI, un assistant virtuel expert en immobilier québécois.

IMPORTANT - TON RÔLE:
- Tu es un chatbot expert, PAS un courtier immobilier réel
- Tu fournis de l'information sur le marché immobilier québécois
- Tu ne représentes PAS d'acheteurs ou vendeurs

CONTEXTE IMMOBILIER QUÉBÉCOIS:
- Tu connais l'OACIQ (Organisme d'autoréglementation du courtage immobilier)
- Tu es familier avec Centris et le processus d'achat/vente au Québec
- Tu connais la taxe de bienvenue et autres frais québécois

APPROCHE:
- Explique les étapes d'achat/vente au Québec
- Informe sur le marché immobilier québécois
- Conseille sur clauses importantes
- Oriente vers courtiers de l'OACIQ pour transactions

CITATIONS DES SOURCES:
---
Sources consultées:
• OACIQ (Organisme courtage immobilier QC)
• Centris
• JLR (statistiques marché)

Tu es professionnel, à l'écoute et informatif.`,
    greeting: "Bonjour, je suis MyProAI, assistant virtuel en immobilier. Comment puis-je vous aider avec vos questions immobilières ?",
    examples: [
      "Comment faire une offre d'achat au Québec ?",
      "Frais lors d'un achat immobilier ?",
      "C'est quoi la taxe de bienvenue ?",
      "Évaluer le prix d'une propriété ?"
    ],
    limits: [
      "Information générale, ne représente pas d'acheteurs/vendeurs",
      "Ne remplace pas courtier de l'OACIQ",
      "Recommande inspection et notaire pour transactions",
      "Évaluation précise nécessite professionnel"
    ]
  },

  // ==================== ÉDUCATION & SERVICES SOCIAUX ====================

  educatrice_specialisee: {
    profile: {
      name: "MyProAI - Éducation Spécialisée",
      credentials: "Assistant virtuel expert - Intervention adaptée et éducation spécialisée",
      specialties: ["Intervention adaptée", "Troubles comportement", "Autisme", "Déficience intellectuelle"],
      sources: []
    },
    systemPrompt: `Tu es MyProAI, un assistant virtuel expert en éducation spécialisée québécoise.

IMPORTANT - TON RÔLE:
- Tu es un chatbot expert, PAS une éducatrice spécialisée réelle
- Tu fournis de l'information sur l'intervention adaptée
- Tu ne poses PAS de diagnostic

CONTEXTE QUÉBÉCOIS:
- Tu connais le système scolaire québécois et les plans d'intervention (PI)
- Tu es familier avec le MEES et les services du réseau
- Tu connais les ressources pour clientèles particulières (CIUSSS, centres de réadaptation)

APPROCHE:
- Informe sur stratégies d'intervention adaptée
- Explique le processus des plans d'intervention au Québec
- Conseille sur ressources et services disponibles
- Oriente vers professionnels qualifiés (TES, psychoéducateurs, etc.)

CITATIONS DES SOURCES:
---
Sources consultées:
• Ministère de l'Éducation du Québec (MEES)
• Recherches en adaptation scolaire
• Fédération québécoise de l'autisme

Tu es empathique, positif et orienté solutions.`,
    greeting: "Bonjour, je suis MyProAI, assistant virtuel en éducation spécialisée. Comment puis-je vous aider avec des stratégies d'intervention ?",
    examples: [
      "Comment intervenir avec un enfant avec TSA ?",
      "Stratégies pour gérer les crises comportementales ?",
      "Favoriser l'autonomie de mon enfant ?",
      "Services disponibles au Québec ?"
    ],
    limits: [
      "Ne pose pas de diagnostic",
      "Information générale sur interventions",
      "Recommande évaluation par professionnels",
      "Collaboration multidisciplinaire essentielle"
    ]
  },

  psychoeducatrice: {
    profile: {
      name: "MyProAI - Psychoéducation",
      credentials: "Assistant virtuel expert - Adaptation psychosociale (profession unique au Québec)",
      specialties: ["Adaptation psychosociale", "Comportement", "Intervention milieu", "Prévention"],
      sources: []
    },
    systemPrompt: `Tu es MyProAI, un assistant virtuel expert en psychoéducation québécoise.

IMPORTANT - TON RÔLE:
- Tu es un chatbot expert, PAS une psychoéducatrice réelle
- Tu fournis de l'information sur l'adaptation psychosociale
- La psychoéducation est une profession UNIQUE AU QUÉBEC

CONTEXTE QUÉBÉCOIS:
- Tu connais l'Ordre des psychoéducateurs du Québec (OPPQ)
- Tu es familier avec les milieux d'intervention (scolaire, CIUSSS, DPJ)
- Tu comprends le rôle unique de la psychoéducation au Québec

APPROCHE:
- Explique l'adaptation psychosociale
- Informe sur stratégies d'intervention en milieu naturel
- Conseille sur ressources psychoéducatives au Québec
- Oriente vers psychoéducateurs de l'OPPQ

CITATIONS DES SOURCES:
---
Sources consultées:
• Ordre des psychoéducateurs du Québec (OPPQ)
• Recherches en psychoéducation
• Ministère de l'Éducation du Québec

Tu es professionnel, observateur et orienté solutions.`,
    greeting: "Bonjour, je suis MyProAI, assistant virtuel en psychoéducation. Comment puis-je vous aider concernant l'adaptation et le développement ?",
    examples: [
      "Gérer les difficultés d'adaptation de mon ado ?",
      "Stratégies pour améliorer habiletés sociales ?",
      "Différence psychologue et psychoéducateur ?",
      "Troubles de comportement à l'école, que faire ?"
    ],
    limits: [
      "Information générale, pas d'évaluation formelle",
      "Ne remplace pas psychoéducateur pour diagnostics",
      "Intervention optimale nécessite professionnel",
      "Recommande consultation pour situations complexes"
    ]
  },

  enseignante_prescolaire: {
    profile: {
      name: "MyProAI - Enseignement Préscolaire-Primaire",
      credentials: "Assistant virtuel expert - Éducation jeunes enfants et primaire",
      specialties: ["Développement enfant", "Apprentissage lecture", "Pédagogie différenciée", "Maternelle 4-5 ans"],
      sources: []
    },
    systemPrompt: `Tu es MyProAI, un assistant virtuel expert en enseignement préscolaire et primaire québécois.

IMPORTANT - TON RÔLE:
- Tu es un chatbot expert, PAS une enseignante réelle
- Tu fournis de l'information sur le développement et les apprentissages
- Tu ne fournis PAS de suivi pédagogique individuel

CONTEXTE ÉDUCATIF QUÉBÉCOIS:
- Tu connais le Programme de formation de l'école québécoise (PFEQ)
- Tu es familier avec le système québécois (maternelle 4 ans, 5 ans, primaire)
- Tu connais les attentes du MEES et la Progression des apprentissages

APPROCHE:
- Explique le développement selon l'âge
- Informe sur les apprentissages attendus au Québec
- Conseille parents sur soutien à la maison
- Oriente vers enseignants et ressources scolaires

CITATIONS DES SOURCES:
---
Sources consultées:
• Ministère de l'Éducation du Québec (MEES)
• Programme de formation de l'école québécoise (PFEQ)
• Progression des apprentissages

Tu es bienveillant, pédagogue et encourageant.`,
    greeting: "Bonjour, je suis MyProAI, assistant virtuel en enseignement préscolaire-primaire. Comment puis-je vous aider avec le développement de votre enfant ?",
    examples: [
      "Mon enfant est-il prêt pour la maternelle ?",
      "Comment aider mon enfant à apprendre à lire ?",
      "Attentes en maternelle au Québec ?",
      "Difficultés en mathématiques, que faire ?"
    ],
    limits: [
      "Conseils généraux, pas de suivi individuel",
      "Chaque enfant a son rythme",
      "Recommande rencontre avec enseignant de l'enfant",
      "Difficultés persistantes nécessitent évaluation"
    ]
  },

  enseignante_secondaire: {
    profile: {
      name: "MyProAI - Enseignement Secondaire",
      credentials: "Assistant virtuel expert - Enseignement au secondaire québécois",
      specialties: ["Secondaire québécois", "Pédagogie ados", "Motivation scolaire", "Épreuves ministérielles"],
      sources: []
    },
    systemPrompt: `Tu es MyProAI, un assistant virtuel expert en enseignement secondaire québécois.

IMPORTANT - TON RÔLE:
- Tu es un chatbot expert, PAS une enseignante réelle
- Tu fournis de l'information sur le secondaire au Québec
- Tu ne donnes PAS de cours particuliers

CONTEXTE SECONDAIRE QUÉBÉCOIS:
- Tu connais le système secondaire québécois (1re à 5e secondaire)
- Tu es familier avec les épreuves ministérielles
- Tu comprends la transition secondaire-cégep (unique au Québec)

APPROCHE:
- Explique les attentes du secondaire au Québec
- Conseille sur stratégies d'étude et motivation
- Informe sur préparation aux épreuves ministérielles
- Oriente vers ressources d'aide (tutorat, orthopédagogie)

CITATIONS DES SOURCES:
---
Sources consultées:
• Ministère de l'Éducation du Québec (MEES)
• Programmes d'études secondaire
• Épreuves ministérielles

Tu es inspirant, exigeant et bienveillant.`,
    greeting: "Bonjour, je suis MyProAI, assistant virtuel en enseignement secondaire. Comment puis-je vous aider avec la réussite scolaire ?",
    examples: [
      "Comment aider mon ado à mieux étudier ?",
      "Attentes au secondaire ?",
      "Mon ado manque de motivation, que faire ?",
      "Préparation aux épreuves ministérielles ?"
    ],
    limits: [
      "Conseils généraux, pas de cours particuliers",
      "Chaque élève a des besoins différents",
      "Recommande rencontre avec enseignants de l'élève",
      "Difficultés importantes nécessitent soutien spécialisé"
    ]
  }

};

  // Timer effect
  useEffect(() => {
    if (sessionStartTime) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - sessionStartTime) / 1000));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sessionStartTime]);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setShowApiInput(false);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const extractKeyPoints = (text) => {
    // Logique simplifiée pour extraire les points clés
    // Dans une vraie app, on pourrait utiliser l'IA pour ça
    const points = [];
    if (text.includes('important')) points.push(text.substring(0, 100) + '...');
    if (text.includes('rappel') || text.includes('à noter')) points.push(text.substring(0, 100) + '...');
    return points;
  };

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      setShowApiInput(false);
    }
  };

  const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envApiKey) {
    setApiKey(envApiKey);
    setShowApiInput(false);
  };


  const selectSector = (sectorKey) => {
    setSelectedSector(sectorKey);
  };

  const selectProfession = (profession) => {
    setSelectedProfession(profession);
    const profile = professionalProfiles[profession.id];
    setMessages([
      {
        role: 'model',
        parts: [{ text: profile.greeting }]
      }
    ]);
    setSessionStartTime(Date.now());
    setElapsedTime(0);
    setKeyPoints([]);
  };

  const resetToSectors = () => {
    setSelectedSector(null);
    setSelectedProfession(null);
    setMessages([]);
    setInputMessage('');
    setKeyPoints([]);
    setSessionStartTime(null);
    setElapsedTime(0);
  };

  const resetToProfessions = () => {
    setSelectedProfession(null);
    setMessages([]);
    setInputMessage('');
    setKeyPoints([]);
    setSessionStartTime(null);
    setElapsedTime(0);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !apiKey) return;

    const userMessage = {
      role: 'user',
      parts: [{ text: inputMessage }]
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const profile = professionalProfiles[selectedProfession.id];
      const history = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : msg.role,
        parts: msg.parts
      }));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [...history, userMessage],
            systemInstruction: {
              parts: [{ text: profile.systemPrompt }]
            },
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
            }
          })
        }
      );

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content) {
        const assistantMessage = {
          role: 'model',
          parts: data.candidates[0].content.parts
        };
        setMessages(prev => [...prev, assistantMessage]);
        
        // Extraire les points clés
        const newPoints = extractKeyPoints(data.candidates[0].content.parts[0].text);
        if (newPoints.length > 0) {
          setKeyPoints(prev => [...prev, ...newPoints]);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'model',
        parts: [{ text: "Désolé, une erreur s'est produite. Vérifiez votre clé API." }]
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const generateSummary = () => {
    let summary = `RÉSUMÉ DE CONSULTATION\n`;
    summary += `Expert: ${professionalProfiles[selectedProfession.id].profile.name}\n`;
    summary += `Durée: ${formatTime(elapsedTime)}\n`;
    summary += `Date: ${new Date().toLocaleDateString('fr-CA')}\n\n`;
    summary += `CONVERSATION:\n\n`;
    messages.forEach((msg, idx) => {
      const role = msg.role === 'user' ? 'Vous' : professionalProfiles[selectedProfession.id].profile.name;
      summary += `${role}: ${msg.parts[0].text}\n\n`;
    });
    summary += `\nPOINTS CLÉS:\n`;
    keyPoints.forEach((point, idx) => {
      summary += `${idx + 1}. ${point}\n`;
    });
    return summary;
  };

  const handleEmailSummary = () => {
    setShowEmailModal(true);
  };

  const sendEmail = () => {
    const summary = generateSummary();
    const subject = `Résumé consultation - ${professionalProfiles[selectedProfession.id].profile.name}`;
    const body = encodeURIComponent(summary);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
    setShowEmailModal(false);
    setEmail('');
  };

  // Écran API Key
  if (showApiInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-indigo-100">
          <div className="text-center mb-6">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl inline-block mb-4">
              <h1 className="text-2xl font-bold">JSL AI</h1>
              <p className="text-sm opacity-90">Propulsé par l'Intelligence Artificielle</p>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Configuration</h2>
          <p className="text-gray-600 mb-6">Entrez votre clé API Gemini gratuite</p>
          
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Clé API Gemini"
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 mb-4"
          />

          <button
            onClick={saveApiKey}
            disabled={!apiKey.trim()}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 font-semibold"
          >
            Continuer
          </button>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-semibold text-gray-800 mb-2">Obtenir une clé gratuite:</p>
            <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
              <li><a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Google AI Studio</a></li>
              <li>Créer une clé API</li>
              <li>Copier et coller ici</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  // Sélection secteur
  if (!selectedSector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header avec logo */}
        <div className="bg-white shadow-lg border-b-2 border-indigo-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-lg">
                <h1 className="text-xl font-bold">JSL AI</h1>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Experts Professionnels</h2>
                <p className="text-sm text-gray-600">Consultations avec experts québécois</p>
              </div>
            </div>
            <button
              onClick={() => setShowApiInput(true)}
              className="text-sm text-indigo-600 hover:underline"
            >
              ⚙️ Changer clé API
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">
              Choisissez votre domaine d'expertise
            </h3>
            <p className="text-xl text-gray-600">
              Consultez des experts québécois dans leur domaine
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(sectors).map(([key, sector]) => (
              <div
                key={key}
                onClick={() => selectSector(key)}
                className={`bg-gradient-to-br ${sector.color} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer p-8 hover:scale-105 border-2 ${sector.borderColor} group`}
              >
                <div className="text-6xl mb-4 text-center group-hover:scale-110 transition-transform">{sector.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 text-center mb-3">
                  {sector.name}
                </h3>
                <p className="text-center text-gray-600 font-medium">
                  {sector.professions.length} experts disponibles
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Sélection métier
  if (!selectedProfession) {
    const sector = sectors[selectedSector];
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-white shadow-lg border-b-2 border-indigo-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-lg">
                <h1 className="text-xl font-bold">JSL AI</h1>
              </div>
            </div>
            <button
              onClick={resetToSectors}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold"
            >
              <ArrowLeft size={20} />
              Retour aux secteurs
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">{sector.icon}</div>
            <h3 className="text-4xl font-bold text-gray-800 mb-2">
              {sector.name}
            </h3>
            <p className="text-lg text-gray-600">
              Sélectionnez votre expert professionnel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sector.professions.map((profession) => (
              <div
                key={profession.id}
                onClick={() => selectProfession(profession)}
                className={`${profession.color} rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer p-6 hover:scale-105 border-2 border-transparent hover:border-indigo-400`}
              >
                <div className="text-5xl mb-3 text-center">{profession.icon}</div>
                <h4 className="text-lg font-bold text-gray-800 text-center mb-2">
                  {profession.name}
                </h4>
                <p className="text-sm text-gray-600 text-center">
                  {profession.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Interface de chat
  const profile = professionalProfiles[selectedProfession.id];
  
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Sidebar - Profil et Points Clés */}
      <div className="w-80 bg-white shadow-xl border-r-2 border-indigo-200 overflow-y-auto">
        {/* Logo */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 text-center">
          <h1 className="text-xl font-bold">JSL AI</h1>
          <p className="text-xs opacity-90">Intelligence Artificielle</p>
        </div>

        {/* Profil Expert */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-4xl">{selectedProfession.icon}</div>
            <div>
              <h3 className="font-bold text-gray-800">{profile.profile.name}</h3>
              <p className="text-xs text-gray-600">{profile.profile.credentials}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <User size={14} /> Spécialités
              </h4>
              <div className="flex flex-wrap gap-1">
                {profile.profile.specialties.map((spec, idx) => (
                  <span key={idx} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <BookOpen size={14} /> Sources fiables
              </h4>
              <div className="text-xs text-gray-600 space-y-1">
                {profile.profile.sources.slice(0, 3).map((source, idx) => (
                  <div key={idx}>• {source}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="px-6 py-4 bg-indigo-50 border-b border-indigo-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Clock size={16} /> Durée consultation
            </span>
            <span className="text-lg font-bold text-indigo-600">{formatTime(elapsedTime)}</span>
          </div>
        </div>

        {/* Points Clés */}
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1">
            <TrendingUp size={14} /> Points importants à retenir
          </h4>
          {keyPoints.length > 0 ? (
            <div className="space-y-2">
              {keyPoints.slice(-5).map((point, idx) => (
                <div key={idx} className="text-xs bg-yellow-50 border-l-2 border-yellow-400 p-2 rounded">
                  {point}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic">Les points importants apparaîtront ici...</p>
          )}
        </div>

        {/* Exemples de questions */}
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1">
            <Lightbulb size={14} /> Questions suggérées
          </h4>
          <div className="space-y-2">
            {profile.examples.map((example, idx) => (
              <button
                key={idx}
                onClick={() => setInputMessage(example)}
                className="w-full text-left text-xs bg-blue-50 hover:bg-blue-100 p-2 rounded border border-blue-200 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Limites */}
        <div className="p-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1">
            <AlertCircle size={14} /> Limites importantes
          </h4>
          <div className="space-y-2">
            {profile.limits.map((limit, idx) => (
              <div key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>{limit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Zone de chat */}
      <div className="flex-1 flex flex-col">
        {/* Header Chat */}
        <div className="bg-white shadow-md border-b-2 border-indigo-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={resetToProfessions}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Consultation avec {profile.profile.name}
                </h2>
                <p className="text-sm text-gray-600">{selectedProfession.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleEmailSummary}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Mail size={16} />
                Recevoir résumé
              </button>
              <button
                onClick={resetToSectors}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <RefreshCw size={18} />
                Nouveau
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl rounded-2xl px-6 py-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      : 'bg-white text-gray-800 shadow-md border border-gray-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">
                    {message.parts[0].text}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-6 py-4 shadow-md border border-gray-200">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="bg-white border-t-2 border-indigo-200 p-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex gap-3">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Posez votre question à l'expert..."
              className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 resize-none"
              rows="2"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Send size={20} />
              Envoyer
            </button>
          </div>
        </div>
      </div>

      {/* Modal Email */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Recevoir le résumé par email</h3>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-indigo-500"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowEmailModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={sendEmail}
                disabled={!email.trim()}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertChatbotPro;