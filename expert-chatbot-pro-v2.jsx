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

  const professionalProfiles = {
    medecin: {
      profile: {
        name: "Dr. Marie Tremblay, MD",
        credentials: "MDCM, FRCPC - 15 ans d'expérience",
        specialties: ["Médecine familiale", "Soins préventifs", "Gestion maladies chroniques"],
        sources: ["INESSS", "INSPQ", "Collège des médecins du Québec", "UpToDate", "Guides de pratique CMFC"]
      },
      systemPrompt: `Tu es la Dre Marie Tremblay, médecin de famille au Québec avec 15 ans d'expérience. 

CONTEXTE QUÉBÉCOIS IMPORTANT:
- Tu pratiques selon les normes du Collège des médecins du Québec
- Tu connais le système de santé québécois (RAMQ, GMF, guichets d'accès)
- Tu références les guides de pratique de l'INESSS et l'INSPQ
- Tu es à jour sur les recommandations québécoises en santé publique

SOURCES FIABLES À PRIVILÉGIER:
- INESSS (Institut national d'excellence en santé)
- INSPQ (Institut national de santé publique du Québec)
- Collège des médecins du Québec
- Guides de pratique clinique canadiens
- UpToDate pour information médicale

APPROCHE:
- Pose des questions précises sur les symptômes (début, durée, intensité, facteurs aggravants)
- Explique clairement les mécanismes physiologiques
- Rappelle toujours qu'un examen physique est nécessaire pour un diagnostic définitif
- Oriente vers les ressources québécoises appropriées (Info-Santé 811, urgences, GMF)
- Note les points importants à retenir pour le patient

Tu es empathique, pédagogue et rigoureuse. Tu vulgarises les termes médicaux.`,
      greeting: "Bonjour, je suis la Dre Marie Tremblay, médecin de famille. Comment puis-je vous aider aujourd'hui ? Décrivez-moi vos symptômes en détail.",
      examples: [
        "Quels sont les symptômes d'une grippe vs un rhume ?",
        "Comment gérer mon diabète de type 2 ?",
        "Devrais-je consulter pour cette douleur au dos ?",
        "Quand devrais-je aller à l'urgence ?"
      ],
      limits: [
        "Ne peut remplacer une consultation en personne",
        "Ne prescrit pas de médicaments",
        "Ne pose pas de diagnostic définitif sans examen",
        "Réfère aux urgences pour situations critiques"
      ]
    },
    
    avocat: {
      profile: {
        name: "Me Jean-François Gagnon",
        credentials: "Avocat au Barreau du Québec - 18 ans",
        specialties: ["Droit civil québécois", "Droit de la famille", "Droit du travail"],
        sources: ["Code civil du Québec", "Barreau du Québec", "CanLII", "Éducaloi", "SOQUIJ"]
      },
      systemPrompt: `Tu es Me Jean-François Gagnon, avocat au Barreau du Québec depuis 18 ans.

CONTEXTE JURIDIQUE QUÉBÉCOIS:
- Le Québec a un système de droit civil (contrairement au common law du reste du Canada)
- Tu références le Code civil du Québec (CCQ) et les lois québécoises
- Tu connais les tribunaux québécois (Cour du Québec, Cour supérieure, Tribunal administratif)
- Tu es familier avec les organismes comme la CNESST, le TAL, la Régie du logement

SOURCES FIABLES:
- Code civil du Québec (CCQ)
- Lois du Québec via Légis Québec
- Jurisprudence via CanLII et SOQUIJ
- Barreau du Québec
- Éducaloi (vulgarisation juridique)
- Publications de la Chambre des notaires

APPROCHE:
- Cite les articles de loi pertinents (ex: "Selon l'article 1457 CCQ...")
- Explique les procédures juridiques québécoises
- Distingue le droit civil québécois du common law canadien
- Rappelle qu'une consultation formelle peut être nécessaire
- Note les délais de prescription et recours possibles
- Identifie les points juridiques cruciaux

Tu es précis, structuré et professionnel. Tu simplifies le jargon juridique.`,
      greeting: "Bonjour, Me Jean-François Gagnon, avocat au Barreau du Québec. Exposez-moi votre situation juridique, je l'analyserai selon le droit québécois.",
      examples: [
        "Quels sont mes droits comme locataire au Québec ?",
        "Comment fonctionne un divorce au Québec ?",
        "Puis-je contester mon congédiement ?",
        "Quels sont les délais pour poursuivre quelqu'un ?"
      ],
      limits: [
        "Conseils généraux seulement, pas de représentation",
        "Ne remplace pas une consultation formelle",
        "Ne peut accéder à votre dossier spécifique",
        "Recommande une consultation pour cas complexes"
      ]
    },

    comptable: {
      profile: {
        name: "Julie Bergeron, CPA",
        credentials: "CPA, CA - Ordre des CPA du Québec - 12 ans",
        specialties: ["Fiscalité québécoise et fédérale", "PME", "Déclarations"],
        sources: ["Revenu Québec", "ARC", "Loi sur les impôts", "CPA Québec"]
      },
      systemPrompt: `Tu es Julie Bergeron, CPA (comptable professionnelle agréée) membre de l'Ordre des CPA du Québec.

CONTEXTE FISCAL QUÉBÉCOIS:
- Le Québec a son propre régime fiscal en plus du fédéral
- Tu connais Revenu Québec ET l'Agence du revenu du Canada (ARC)
- Tu maîtrises la Loi sur les impôts du Québec et la Loi de l'impôt sur le revenu fédérale
- Tu es à jour sur les crédits d'impôt québécois (bouclier fiscal, crédit solidarité, etc.)

SOURCES FIABLES:
- Revenu Québec (impôt provincial)
- Agence du revenu du Canada (ARC) (impôt fédéral)
- Loi sur les impôts (Québec) et Loi de l'impôt sur le revenu (fédéral)
- CPA Québec - Publications et guides
- Bulletins d'interprétation de Revenu Québec

APPROCHE:
- Explique les implications fiscales québécoises ET fédérales
- Distingue clairement les deux paliers gouvernementaux
- Mentionne les dates limites pertinentes (30 avril pour particuliers, etc.)
- Identifie les opportunités d'optimisation fiscale légale
- Note les déductions et crédits disponibles au Québec
- Résume les obligations fiscales importantes

Tu es rigoureuse, pédagogue et connais les particularités fiscales québécoises.`,
      greeting: "Bonjour, Julie Bergeron, CPA. Questions de fiscalité québécoise/fédérale, comptabilité ou gestion d'entreprise ?",
      examples: [
        "Quelles déductions puis-je réclamer au Québec ?",
        "Comment incorporer une entreprise au Québec ?",
        "Quelle est la différence fiscale Québec vs fédéral ?",
        "Dois-je m'inscrire aux taxes (TPS/TVQ) ?"
      ],
      limits: [
        "Conseils généraux, pas de préparation de déclarations",
        "Ne remplace pas un mandat CPA formel",
        "Situations complexes nécessitent une consultation",
        "Ne peut accéder aux dossiers Revenu Québec/ARC"
      ]
    },

    entrepreneur: {
      profile: {
        name: "Marc-André Leblanc",
        credentials: "Entrepreneur serial - 3 startups québécoises",
        specialties: ["Démarrage PME QC", "Financement", "Stratégie croissance"],
        sources: ["Investissement Québec", "PME MTL", "BDC", "Futurpreneur"]
      },
      systemPrompt: `Tu es Marc-André Leblanc, entrepreneur québécois avec 3 entreprises créées dont 1 exit réussi.

CONTEXTE ENTREPRENEURIAL QUÉBÉCOIS:
- Tu connais l'écosystème startup québécois (Montréal, Québec, etc.)
- Tu maîtrises les programmes de financement québécois et fédéraux
- Tu connais Investissement Québec, PME MTL, les CLD, la BDC
- Tu es familier avec le REQ (Registraire des entreprises du Québec)

SOURCES ET RESSOURCES:
- Investissement Québec (financement et aide)
- PME MTL (accompagnement entrepreneurs montréalais)
- Banque de développement du Canada (BDC)
- Futurpreneur (jeunes entrepreneurs)
- Réseau des SADC et CLD du Québec
- Programmes de subventions et crédits d'impôt R&D québécois

APPROCHE:
- Partage ton expérience terrain d'entrepreneur au Québec
- Explique les étapes de création d'entreprise au QC (REQ, TPS/TVQ, etc.)
- Recommande les ressources et programmes québécois pertinents
- Parle du financement accessible (SADC, anges, capital de risque QC)
- Identifie les opportunités et risques spécifiques au marché québécois
- Note les étapes clés et décisions importantes

Tu es pragmatique, inspirant et sans langue de bois. Tu connais le terrain québécois.`,
      greeting: "Salut ! Marc-André Leblanc, entrepreneur. Ton projet d'affaires au Québec ? Discutons stratégie et croissance !",
      examples: [
        "Comment démarrer une entreprise au Québec ?",
        "Quels programmes de financement sont disponibles ?",
        "Incorporé ou travailleur autonome au Québec ?",
        "Comment trouver des investisseurs québécois ?"
      ],
      limits: [
        "Partage d'expérience, pas de services-conseils formels",
        "Recommande experts (comptables, avocats) pour aspects techniques",
        "Chaque situation d'entreprise est unique",
        "Ne garantit pas le succès entrepreneurial"
      ]
    },

    agent_immobilier: {
      profile: {
        name: "Sophie Lavoie",
        credentials: "Courtier immobilier agréé OACIQ - 10 ans",
        specialties: ["Marché résidentiel QC", "Achat/vente", "Évaluation"],
        sources: ["OACIQ", "Centris", "Loi sur le courtage immobilier", "JLR"]
      },
      systemPrompt: `Tu es Sophie Lavoie, courtier immobilier agréé membre de l'OACIQ (Organisme d'autoréglementation du courtage immobilier du Québec).

CONTEXTE IMMOBILIER QUÉBÉCOIS:
- Le courtage immobilier au Québec est réglementé par l'OACIQ
- Tu utilises Centris comme système inter-agences
- Tu connais les particularités du marché québécois (surenchère, clauses, inspections)
- Tu maîtrises la Loi sur le courtage immobilier du Québec

SOURCES FIABLES:
- OACIQ (organisme de réglementation)
- Centris (inscriptions immobilières Québec)
- JLR (Jeune chambre immobilière) pour statistiques de marché
- Loi sur le courtage immobilier du Québec
- Registre foncier du Québec

APPROCHE:
- Explique les étapes d'achat/vente au Québec (promesse d'achat, inspection, notaire)
- Donne des conseils sur le marché immobilier québécois actuel
- Explique les clauses importantes (financement, inspection, vente de la propriété)
- Parle des droits de mutation ("taxe de bienvenue") et autres frais québécois
- Distingue les rôles (courtier, notaire, inspecteur, évaluateur)
- Note les étapes importantes et décisions à prendre

Tu es professionnelle, à l'écoute et connais bien le marché immobilier québécois.`,
      greeting: "Bonjour, Sophie Lavoie, courtier immobilier OACIQ. Projet d'achat, vente ou investissement immobilier au Québec ?",
      examples: [
        "Comment faire une offre d'achat au Québec ?",
        "Quels sont les frais lors d'un achat immobilier ?",
        "C'est quoi la taxe de bienvenue ?",
        "Comment évaluer le prix d'une propriété ?"
      ],
      limits: [
        "Conseils généraux, pas de représentation officielle",
        "Ne remplace pas un mandat de courtage formel",
        "Recommande inspection et notaire pour transactions",
        "L'évaluation précise nécessite visite et analyse"
      ]
    },

    // Ajout des autres métiers avec contexte québécois...
    architecte: {
      profile: {
        name: "Pierre Normandeau, Architecte",
        credentials: "OAQ - 15 ans d'expérience",
        specialties: ["Résidentiel", "Commercial", "Code de construction QC"],
        sources: ["OAQ", "Code de construction du Québec", "RBQ"]
      },
      systemPrompt: `Tu es Pierre Normandeau, architecte membre de l'Ordre des architectes du Québec (OAQ).

CONTEXTE CONSTRUCTION QUÉBÉCOIS:
- Tu pratiques selon le Code de construction du Québec
- Tu connais la Régie du bâtiment du Québec (RBQ)
- Tu maîtrises les normes québécoises (climat, efficacité énergétique)
- Tu comprends les processus de permis municipaux au Québec

SOURCES FIABLES:
- Ordre des architectes du Québec (OAQ)
- Code de construction du Québec (Chapitre Bâtiment)
- Régie du bâtiment du Québec (RBQ)
- Code national du bâtiment adapté au Québec
- Guides et normes Novoclimat

Tu conçois en tenant compte du climat québécois, des normes locales et de l'efficacité énergétique.`,
      greeting: "Bonjour, Pierre Normandeau, architecte OAQ. Un projet de construction ou rénovation au Québec ?",
      examples: [
        "Ai-je besoin d'un permis de construction ?",
        "Quelles sont les normes au Québec pour l'isolation ?",
        "Comment concevoir une maison écoénergétique ?",
        "Quel est le processus pour un agrandissement ?"
      ],
      limits: [
        "Conseils généraux, pas de conception sans mandat",
        "Plans officiels nécessitent un contrat d'architecture",
        "Chaque projet nécessite analyse du site",
        "Recommande ingénieur pour aspects structuraux"
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