import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, ArrowLeft, Clock, AlertCircle, Lightbulb, Search, X, Settings, TrendingUp, BookOpen, Mail } from 'lucide-react';
import { professionalProfiles, getSectors } from './professionnalProfiles.js';

// ========================================
// BASE DE DONNÉES DES SOURCES FIABLES AVEC LIENS
// ========================================
const RELIABLE_SOURCES = {
  // Santé
  "INESSS": {
    name: "INESSS",
    url: "https://www.inesss.qc.ca/",
    description: "Institut national d'excellence en santé et services sociaux"
  },
  "INSPQ": {
    name: "INSPQ", 
    url: "https://www.inspq.qc.ca/",
    description: "Institut national de santé publique du Québec"
  },
  "Collège des médecins du Québec": {
    name: "Collège des médecins du Québec",
    url: "https://www.cmq.org/",
    description: "Ordre professionnel des médecins du Québec"
  },
  "OPQ": {
    name: "OPQ",
    url: "https://www.ordrepsy.qc.ca/",
    description: "Ordre des psychologues du Québec"
  },
  "OIIQ": {
    name: "OIIQ",
    url: "https://www.oiiq.org/",
    description: "Ordre des infirmières et infirmiers du Québec"
  },
  "Ordre des dentistes du Québec": {
    name: "Ordre des dentistes du Québec",
    url: "https://www.odq.qc.ca/",
    description: "Ordre professionnel des dentistes du Québec"
  },
  "Ordre des optométristes du Québec": {
    name: "Ordre des optométristes du Québec",
    url: "https://www.ooq.org/",
    description: "Ordre professionnel des optométristes du Québec"
  },
  "OPPQ": {
    name: "OPPQ",
    url: "https://www.oppq.qc.ca/",
    description: "Ordre professionnel de la physiothérapie du Québec"
  },
  "OEQ": {
    name: "OEQ",
    url: "https://www.oeq.org/",
    description: "Ordre des ergothérapeutes du Québec"
  },
  "OOAQ": {
    name: "OOAQ",
    url: "https://www.ooaq.qc.ca/",
    description: "Ordre des orthophonistes et audiologistes du Québec"
  },
  "Ordre des chiropraticiens du Québec": {
    name: "Ordre des chiropraticiens du Québec",
    url: "https://www.ordredeschiropraticiens.qc.ca/",
    description: "Ordre professionnel des chiropraticiens du Québec"
  },
  "Fédération québécoise des massothérapeutes": {
    name: "Fédération québécoise des massothérapeutes",
    url: "https://www.fqm.qc.ca/",
    description: "Organisation professionnelle des massothérapeutes"
  },
  "Ordre des technologues médicaux du Québec": {
    name: "Ordre des technologues médicaux du Québec",
    url: "https://www.otmq.org/",
    description: "Ordre professionnel des technologues médicaux"
  },
  "OPDQ": {
    name: "OPDQ",
    url: "https://www.opdq.org/",
    description: "Ordre professionnel des diététistes du Québec"
  },
  "Guide alimentaire canadien": {
    name: "Guide alimentaire canadien",
    url: "https://guide-alimentaire.canada.ca/",
    description: "Guide alimentaire officiel du Canada"
  },
  "Santé Canada": {
    name: "Santé Canada",
    url: "https://www.canada.ca/fr/sante-canada.html",
    description: "Ministère de la Santé du Canada"
  },
  
  // Juridique
  "Code civil du Québec": {
    name: "Code civil du Québec",
    url: "https://www.legisquebec.gouv.qc.ca/fr/document/lc/C-1991",
    description: "Code civil du Québec - Légis Québec"
  },
  "Légis Québec": {
    name: "Légis Québec",
    url: "https://www.legisquebec.gouv.qc.ca/",
    description: "Site officiel des lois du Québec"
  },
  "CanLII": {
    name: "CanLII",
    url: "https://www.canlii.org/",
    description: "Institut canadien d'information juridique"
  },
  "Barreau du Québec": {
    name: "Barreau du Québec",
    url: "https://www.barreau.qc.ca/",
    description: "Ordre professionnel des avocats du Québec"
  },
  "Chambre des notaires du Québec": {
    name: "Chambre des notaires du Québec",
    url: "https://www.cdnq.org/",
    description: "Ordre professionnel des notaires du Québec"
  },
  
  // Finance
  "Revenu Québec": {
    name: "Revenu Québec",
    url: "https://www.revenuquebec.ca/",
    description: "Agence du revenu du Québec"
  },
  "ARC": {
    name: "ARC",
    url: "https://www.canada.ca/fr/agence-revenu.html",
    description: "Agence du revenu du Canada"
  },
  "CPA Québec": {
    name: "CPA Québec",
    url: "https://www.cpaquebec.ca/",
    description: "Ordre des comptables professionnels agréés du Québec"
  },
  
  // Éducation
  "MEES": {
    name: "MEES",
    url: "https://www.education.gouv.qc.ca/",
    description: "Ministère de l'Éducation et de l'Enseignement supérieur"
  },
  
  // Technologie
  "Ordre des ingénieurs du Québec": {
    name: "Ordre des ingénieurs du Québec",
    url: "https://www.oiq.qc.ca/",
    description: "Ordre professionnel des ingénieurs du Québec"
  },
  
  // Construction
  "RBQ": {
    name: "RBQ",
    url: "https://www.rbq.gouv.qc.ca/",
    description: "Régie du bâtiment du Québec"
  },
  "CCQ": {
    name: "CCQ",
    url: "https://www.ccq.org/",
    description: "Commission de la construction du Québec"
  },
  
  // Immobilier
  "OACIQ": {
    name: "OACIQ",
    url: "https://www.oaciq.com/",
    description: "Organisme d'autoréglementation du courtage immobilier du Québec"
  },
  
  // Affaires
  "Chambre de commerce du Québec": {
    name: "Chambre de commerce du Québec",
    url: "https://www.ccmm.org/",
    description: "Chambre de commerce du Montréal métropolitain"
  },
  "Investissement Québec": {
    name: "Investissement Québec",
    url: "https://www.investquebec.com/",
    description: "Société de développement économique du Québec"
  }
};

// ========================================
// GESTION LOCALE - COMPTEURS ET POPULARITÉ
// ========================================
const getConsultationCount = (professionId) => {
  const counts = JSON.parse(localStorage.getItem('consultationCounts') || '{}');
  return counts[professionId] || 0;
};

const incrementConsultationCount = (professionId) => {
  const counts = JSON.parse(localStorage.getItem('consultationCounts') || '{}');
  counts[professionId] = (counts[professionId] || 0) + 1;
  localStorage.setItem('consultationCounts', JSON.stringify(counts));
  return counts[professionId];
};

// ========================================
// SYSTÈME DE POPULARITÉ
// ========================================
const POPULAR_SECTORS = [
  'Santé',
  'Technologie', 
  'Finance',
  'Juridique',
  'Affaires',
  'Construction',
  'Immobilier',
  'Éducation'
];

const POPULAR_PROFESSIONS = {
  'Santé': ['medecin', 'psychologue', 'infirmier', 'dentiste', 'pharmacien', 'physiotherapeute', 'nutritionniste', 'sage-femme', 'optometriste', 'chiropraticien', 'massotherapeute', 'acupuncteur', 'ergotherapeute', 'orthophoniste', 'psychiatre'],
  'Technologie': ['developpeur', 'analyste', 'designer', 'cybersecurite', 'data-scientist', 'devops', 'product-manager', 'ux-designer', 'testeur', 'architecte-logiciel', 'admin-systeme', 'consultant-it', 'specialiste-cloud', 'ingenieur-ai', 'tech-support'],
  'Finance': ['comptable', 'conseiller-financier', 'analyste-financier', 'courtier', 'auditeur', 'planificateur-financier', 'gestionnaire-portefeuille', 'specialiste-credit', 'evaluateur', 'actuaire', 'trader', 'analyste-risque', 'consultant-fiscal', 'gestionnaire-tresorerie', 'analyste-investissement'],
  'Juridique': ['avocat', 'notaire', 'paralegal', 'mediateur', 'arbitre', 'conseiller-juridique', 'greffier', 'huissier', 'enqueteur', 'detective-prive', 'agent-immigration', 'specialiste-conformite', 'juriste-entreprise', 'avocat-criminaliste', 'avocat-familial'],
  'Affaires': ['entrepreneur', 'consultant', 'marketing', 'ventes', 'rh', 'gestionnaire', 'analyste-affaires', 'coach', 'formateur', 'specialiste-export', 'gestionnaire-projet', 'analyste-operations', 'directeur-commercial', 'specialiste-innovation', 'gestionnaire-qualite'],
  'Construction': ['architecte', 'ingenieur-civil', 'entrepreneur-construction', 'electricien', 'plombier', 'charpentier', 'macon', 'peintre', 'couvreur', 'menuisier', 'soudeur', 'mecanicien', 'technicien', 'superviseur', 'estimateur'],
  'Immobilier': ['courtier', 'evaluateur', 'gestionnaire', 'conseiller', 'developpeur', 'promoteur', 'specialiste-commercial', 'consultant', 'analyste', 'negociateur', 'specialiste-location', 'gestionnaire-propriete', 'conseiller-investissement', 'specialiste-urbanisme', 'expert-foncier'],
  'Éducation': ['enseignant', 'professeur', 'conseiller', 'bibliothecaire', 'formateur', 'coach', 'tuteur', 'directeur', 'coordonnateur', 'specialiste', 'consultant', 'evaluateur', 'animateur', 'pedagogue', 'chercheur']
};

const getSectorPopularity = (sectorName) => {
  const index = POPULAR_SECTORS.indexOf(sectorName);
  return index === -1 ? 999 : index;
};

const getProfessionPopularity = (professionId, sectorName) => {
  const popularInSector = POPULAR_PROFESSIONS[sectorName] || [];
  const index = popularInSector.indexOf(professionId);
  return index === -1 ? 999 : index;
};

// ========================================
// COMPOSANT PRINCIPAL
// ========================================
const EmmaExpertChatbot = () => {
  const [selectedProfession, setSelectedProfession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(true);
  const [userPersonality, setUserPersonality] = useState('standard');
  const [expertiseLevel, setExpertiseLevel] = useState('intermediaire');
  const [emmaPersonality, setEmmaPersonality] = useState('professionnelle');
  const [showAbout, setShowAbout] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [keyPoints, setKeyPoints] = useState([]);
  const [showIntro, setShowIntro] = useState(true);
  const [introStep, setIntroStep] = useState(0); // 0: logo, 1: avatar, 2: nom, 3: description, 4: marketing, 5: final
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [apiStatus, setApiStatus] = useState('unknown'); // 'unknown', 'connected', 'error'
  const messagesEndRef = useRef(null);

  // ========================================
  // SYSTÈME DE SONS
  // ========================================
  const playSound = (soundType) => {
    if (!soundEnabled) return;
    
    try {
      // Créer des sons synthétiques avec Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      let frequency, duration, type;
      
      switch (soundType) {
        case 'click':
          frequency = 800;
          duration = 0.1;
          type = 'sine';
          break;
        case 'hover':
          frequency = 600;
          duration = 0.05;
          type = 'sine';
          break;
        case 'message':
          frequency = 1000;
          duration = 0.15;
          type = 'triangle';
          break;
        case 'success':
          frequency = 1200;
          duration = 0.2;
          type = 'sine';
          break;
        case 'notification':
          frequency = 900;
          duration = 0.1;
          type = 'square';
          break;
        default:
          frequency = 500;
          duration = 0.1;
          type = 'sine';
      }
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.log('Audio non supporté ou désactivé');
    }
  };

  const sectors = getSectors();

  // API key gérée via les variables d'environnement Vercel
  useEffect(() => {
    // Priorité : variable d'environnement, puis localStorage
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    const saved = localStorage.getItem('gemini_api_key');
    
    if (envKey) {
      setApiKey(envKey);
    } else if (saved) {
      setApiKey(saved);
    }
  }, []);

  useEffect(() => {
    if (sessionStartTime) {
      const timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - sessionStartTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [sessionStartTime]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Gérer l'animation séquentielle de l'intro
  useEffect(() => {
    const timers = [];
    
    // Séquence d'animation : l'image principale reste affichée plus longtemps
    timers.push(setTimeout(() => setIntroStep(1), 2000));   // Icônes après 2s
    timers.push(setTimeout(() => setIntroStep(2), 3500));  // Titre après 3.5s
    timers.push(setTimeout(() => setIntroStep(3), 4500));  // Description après 4.5s
    timers.push(setTimeout(() => setIntroStep(4), 5500));  // Statistiques après 5.5s
    timers.push(setTimeout(() => setIntroStep(5), 6500));  // Call-to-action après 6.5s
    timers.push(setTimeout(() => setShowIntro(false), 8000)); // Disparition après 8s

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  // Tester la connectivité API au chargement
  useEffect(() => {
    if (apiKey && apiKey.trim() !== '') {
      testApiConnection();
    }
  }, [apiKey]);

  const saveApiKey = async () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      
      // Test de la connexion avant de continuer
      const isWorking = await testApiConnection();
      if (isWorking) {
        console.log('✅ Clé API sauvegardée et testée avec succès');
      } else {
        console.error('❌ La clé API ne fonctionne pas');
        alert('La clé API ne fonctionne pas. Veuillez vérifier votre clé.');
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Fonction helper pour extraire le texte de manière sûre
  const extractResponseText = (apiResponse) => {
    try {
      // Vérifications progressives avec logs
      if (!apiResponse) {
        console.error('❌ Réponse API vide');
        return null;
      }
      
      if (!apiResponse.candidates || !Array.isArray(apiResponse.candidates)) {
        console.error('❌ Pas de candidates dans la réponse');
        return null;
      }
      
      if (apiResponse.candidates.length === 0) {
        console.error('❌ Tableau candidates vide');
        return null;
      }
      
      const candidate = apiResponse.candidates[0];
      
      if (!candidate) {
        console.error('❌ Premier candidate est null/undefined');
        return null;
      }
      
      if (!candidate.content) {
        console.error('❌ Pas de content dans candidate');
        console.error('finishReason:', candidate.finishReason);
        return null;
      }
      
      if (!candidate.content.parts || !Array.isArray(candidate.content.parts)) {
        console.error('❌ Pas de parts dans content');
        return null;
      }
      
      if (candidate.content.parts.length === 0) {
        console.error('❌ Tableau parts vide');
        return null;
      }
      
      const text = candidate.content.parts[0]?.text;
      
      if (!text) {
        console.error('❌ Pas de texte dans la première part');
        return null;
      }
      
      return text;
    } catch (error) {
      console.error('❌ Erreur lors de l\'extraction du texte:', error);
      return null;
    }
  };

  // Fonction pour diviser les réponses longues en plusieurs messages
  const splitLongResponse = (text, maxLength = 3000) => {
    if (text.length <= maxLength) {
      return [text];
    }
    
    const parts = [];
    const sentences = text.split(/(?<=[.!?])\s+/);
    let currentPart = '';
    
    for (const sentence of sentences) {
      if ((currentPart + sentence).length > maxLength && currentPart.length > 0) {
        parts.push(currentPart.trim());
        currentPart = sentence;
      } else {
        currentPart += (currentPart ? ' ' : '') + sentence;
      }
    }
    
    if (currentPart.trim()) {
      parts.push(currentPart.trim());
    }
    
    return parts;
  };

  // Fonction pour tester la connectivité API
  const testApiConnection = async () => {
    console.log('🔍 Test de connexion API...');
    console.log('🔑 Clé API présente:', !!apiKey);
    console.log('🔑 Longueur de la clé:', apiKey ? apiKey.length : 0);
    console.log('🌍 Variable d\'environnement VITE_GEMINI_API_KEY:', import.meta.env.VITE_GEMINI_API_KEY ? 'PRÉSENTE' : 'ABSENTE');
    console.log('🌍 Toutes les variables d\'environnement:', import.meta.env);
    
    if (!apiKey || apiKey.trim() === '') {
      console.error('❌ Clé API manquante');
      setApiStatus('error');
      return false;
    }

    try {
      console.log('📡 Envoi de la requête de test...');
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent',
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": currentApiKey.trim() // CORRECTION 3 : trim() important
          },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: 'Test de connexion' }] }],
            generationConfig: { 
              temperature: 0.1, 
              maxOutputTokens: 10
            }
          })
        }
      );

      console.log('📊 Statut de la réponse:', response.status);
      console.log('📊 Headers de la réponse:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Test API réussi:', data);
        
        // Vérifier que la réponse contient bien du contenu
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
          console.log('✅ Contenu de réponse valide détecté');
          setApiStatus('connected');
          return true;
        } else {
          console.error('⚠️ Réponse API vide ou incomplète lors du test');
          console.error('Structure de la réponse de test:', JSON.stringify(data, null, 2));
          setApiStatus('error');
          return false;
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Erreur API:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData,
          headers: Object.fromEntries(response.headers.entries())
        });
        
        // Messages d'erreur plus spécifiques
        if (response.status === 400) {
          console.error('🔍 Erreur 400: Vérifiez le format de votre requête');
        } else if (response.status === 401) {
          console.error('🔍 Erreur 401: Clé API invalide ou manquante');
        } else if (response.status === 403) {
          console.error('🔍 Erreur 403: Permissions insuffisantes pour cette clé API');
        } else if (response.status === 429) {
          console.error('🔍 Erreur 429: Limite de requêtes dépassée');
        }
        
        setApiStatus('error');
        return false;
      }
    } catch (error) {
      console.error('❌ Erreur de connexion API:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      setApiStatus('error');
      return false;
    }
  };

  const generateSummary = () => {
    if (!selectedProfession || messages.length === 0) return '';
    
    const profile = professionalProfiles[selectedProfession.id];
    const consultationDate = new Date().toLocaleDateString('fr-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    let summary = `📋 RÉSUMÉ DE CONSULTATION\n`;
    summary += `================================\n\n`;
    summary += `👩‍💼 Professionnel consulté : ${profile.profile.name}\n`;
    summary += `🏢 Secteur : ${profile.profile.sector}\n`;
    summary += `📅 Date : ${consultationDate}\n`;
    summary += `⏱️ Durée : ${formatTime(elapsedTime)}\n`;
    summary += `🎯 Style de consultation : ${userPersonality} / ${expertiseLevel} / ${emmaPersonality}\n\n`;
    
    summary += `💬 ÉCHANGE DE CONSULTATION\n`;
    summary += `==========================\n\n`;
    
    messages.forEach((message, index) => {
      if (message.role === 'user' && message.parts?.[0]?.text) {
        summary += `👤 Vous : ${message.parts[0].text}\n\n`;
      } else if (message.role === 'model' && message.parts?.[0]?.text) {
        summary += `🤖 Emma : ${message.parts[0].text}\n\n`;
      }
    });
    
    if (keyPoints.length > 0) {
      summary += `🔑 POINTS IMPORTANTS IDENTIFIÉS\n`;
      summary += `==============================\n\n`;
      keyPoints.forEach((point, index) => {
        summary += `${index + 1}. ${point}\n`;
      });
      summary += `\n`;
    }
    
    summary += `⚠️ RAPPEL IMPORTANT\n`;
    summary += `==================\n`;
    summary += `Cette consultation est fournie à titre informatif uniquement. Pour des conseils personnalisés et professionnels, consultez toujours un expert qualifié du domaine.\n\n`;
    
    summary += `---\n`;
    summary += `Propulsé par Emma - Votre assistante virtuelle spécialisée\n`;
    summary += `www.mespros.ca`;
    
    return summary;
  };

  // Fonction pour formater les sources avec des liens
  const formatSourcesWithLinks = (sources) => {
    if (!sources || !Array.isArray(sources)) return '';
    
    return sources.map(source => {
      const sourceInfo = RELIABLE_SOURCES[source];
      if (sourceInfo) {
        return `<a href="${sourceInfo.url}" target="_blank" rel="noopener noreferrer" class="source-link" title="${sourceInfo.description}">${sourceInfo.name}</a>`;
      }
      return source; // Retourner le nom original si pas de lien trouvé
    }).join(', ');
  };

  const formatMessageText = (text) => {
    // Vérifier que le texte existe et est valide
    if (!text || typeof text !== 'string') {
      return '';
    }
    
    // Échapper les caractères HTML dangereux d'abord
    const escapeHtml = (unsafe) => {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };
    
    // Échapper le texte de base
    let safeText = escapeHtml(text);
    
    // Améliorer le formatage du texte de manière sécurisée
    let formattedText = safeText
      // Gras (double astérisque)
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-700 font-bold">$1</strong>')
      // Italique (simple astérisque)
      .replace(/\*(.*?)\*/g, '<em class="text-gray-700 italic">$1</em>')
      // Sections avec émojis (détection automatique)
      .replace(/^(🔍|📌|💡|⚠️|✅|❌|🎯|🔑|📊|💰|🏥|⚖️|💻|🏗️|🎓|📚|🌟|⭐|🚀|💪|🤝|👉|📝|✨|🔔|💬|📢|🎨|🔧|⚙️)\s*\*\*(.*?)\*\*/gm, 
        '<div class="section-header mt-4 mb-2 flex items-center gap-2"><span class="text-2xl">$1</span><h3 class="text-lg font-bold text-indigo-800">$2</h3></div>')
      // Paragraphes (double saut de ligne)
      .replace(/\n\n/g, '</p><p class="mb-3">')
      // Listes numérotées
      .replace(/^(\d+)\.\s+(.+)$/gm, '<li class="ml-6 mb-2"><span class="font-semibold text-indigo-600">$1.</span> $2</li>')
      // Listes à puces avec bullet spéciaux
      .replace(/^[•●○◦▪▫■□]\s+(.+)$/gm, '<li class="ml-6 mb-2 flex items-start gap-2"><span class="text-indigo-500 mt-1">•</span><span>$1</span></li>')
      // Simple retours à la ligne
      .replace(/\n/g, '<br>');

    // Wrapper les listes dans des balises ul
    formattedText = formattedText.replace(
      /(<li class="ml-6.*?<\/li>\s*)+/g,
      '<ul class="list-none my-3">$&</ul>'
    );

    // Wrapper dans un paragraphe si pas déjà fait
    if (!formattedText.startsWith('<')) {
      formattedText = `<p class="mb-3">${formattedText}</p>`;
    }

    // Traiter les sections de sources pour ajouter des liens
    formattedText = formattedText.replace(
      /Sources:\s*([^<]+)/g, 
      (match, sourcesText) => {
        const sources = sourcesText.split(',').map(s => s.trim()).filter(s => s);
        const linkedSources = formatSourcesWithLinks(sources);
        return `<div class="sources-section mt-4 pt-3 border-t border-gray-200"><p class="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2"><span class="text-lg">🔗</span> Sources fiables :</p><div class="text-sm text-gray-700">${linkedSources}</div></div>`;
      }
    );

    // Traiter les liens markdown [texte](url) pour les convertir en liens HTML
    formattedText = formattedText.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="source-link text-indigo-600 hover:text-indigo-800 underline font-medium">$1</a>'
    );

    // Ajouter des icônes spéciales pour les avertissements
    formattedText = formattedText.replace(
      /<strong class="text-indigo-700 font-bold">(Attention|Important|Rappel|Note|Avertissement)<\/strong>/gi,
      '<span class="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md font-bold text-sm"><span>⚠️</span>$1</span>'
    );

    // Ajouter des icônes pour les points positifs
    formattedText = formattedText.replace(
      /<strong class="text-indigo-700 font-bold">(Avantage|Bénéfice|Conseil|Astuce|Recommandation)<\/strong>/gi,
      '<span class="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-md font-bold text-sm"><span>✅</span>$1</span>'
    );

    // Sections "À retenir" avec style spécial
    formattedText = formattedText.replace(
      /📌\s*\*\*À retenir\*\*(.*?)(?=<div class="section-header|$)/gs,
      '<div class="key-points-card bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-4 rounded-lg my-4"><div class="flex items-center gap-2 mb-3"><span class="text-2xl">📌</span><h3 class="text-lg font-bold text-yellow-800">À retenir</h3></div>$1</div>'
    );

    // Sections "Attention" avec style alerte
    formattedText = formattedText.replace(
      /⚠️\s*\*\*Attention\*\*(.*?)(?=<div class="section-header|$)/gs,
      '<div class="warning-card bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 p-4 rounded-lg my-4"><div class="flex items-center gap-2 mb-3"><span class="text-2xl">⚠️</span><h3 class="text-lg font-bold text-red-800">Attention</h3></div>$1</div>'
    );

    // Sections "Conseils" avec style succès
    formattedText = formattedText.replace(
      /(💡|✅)\s*\*\*(Points clés|Conseils|Recommandations)\*\*(.*?)(?=<div class="section-header|$)/gs,
      '<div class="tips-card bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 p-4 rounded-lg my-4"><div class="flex items-center gap-2 mb-3"><span class="text-2xl">$1</span><h3 class="text-lg font-bold text-green-800">$2</h3></div>$3</div>'
    );

    return formattedText;
  };

  const getPersonalityPrompt = () => {
    let prompt = '';
    
    const userStyles = {
      analytique: "L'utilisateur préfère des réponses structurées, avec données et faits précis.",
      créatif: "L'utilisateur aime les explications imagées, créatives et les analogies.",
      pragmatique: "L'utilisateur veut du concret, des solutions directes et actionnables.",
      empathique: "L'utilisateur apprécie un ton chaleureux, compréhensif et rassurant.",
      standard: ""
    };
    prompt += userStyles[userPersonality] || '';
    
    const expertiseLevels = {
      débutant: "Explique comme à quelqu'un qui découvre le sujet. Vulgarise au maximum.",
      intermediaire: "Équilibre entre vulgarisation et précision technique.",
      avancé: "Utilise termes techniques, suppose connaissances de base.",
      expert: "Niveau expert, détails poussés, références spécialisées."
    };
    prompt += ' ' + (expertiseLevels[expertiseLevel] || '');
    
    const emmaStyles = {
      professionnelle: "Ton professionnel, formel mais accessible.",
      amicale: "Ton chaleureux, amical, tutoiement naturel.",
      pédagogue: "Ton enseignant, explicatif, patient.",
      directe: "Ton direct, concis, va droit au but."
    };
    prompt += ' ' + (emmaStyles[emmaPersonality] || '');
    
    return prompt.trim();
  };

  const selectProfession = (profession) => {
    playSound('success');
    setSelectedProfession(profession);
    const count = incrementConsultationCount(profession.id);
    
    const personalityPrompt = getPersonalityPrompt();
    const profile = professionalProfiles[profession.id];
    
    const intro = `${profile.greeting}

${personalityPrompt ? `🎯 Je vais adapter mes réponses selon vos préférences ✨` : ''}

📌 Rappel important : Je suis une assistante virtuelle. Pour des conseils personnalisés et professionnels, consultez toujours un expert qualifié du domaine.

Comment puis-je vous aider ?`;
    
    setMessages([{
      role: 'model',
      parts: [{ text: intro }]
    }]);
    setSessionStartTime(Date.now());
    setElapsedTime(0);
    setKeyPoints([]);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    playSound('message');

    // CORRECTION 1 : Vérification stricte de la clé API
    const currentApiKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!currentApiKey || currentApiKey.trim() === '') {
      setMessages(prev => [...prev, {
        role: 'model',
        parts: [{ text: "❌ Erreur de configuration : Clé API Gemini manquante.\n\n🔧 Configuration Vercel requise :\n• Variable d'environnement : VITE_GEMINI_API_KEY\n• Valeur : Votre clé API Gemini\n• Redéployez l'application après configuration\n\n💡 Consultez la console (F12) pour plus de détails sur la configuration." }]
      }]);
      return; // IMPORTANT : Sortir de la fonction
    }

    // CORRECTION 2 : Vérification de la profession
    if (!selectedProfession?.id) {
      setMessages(prev => [...prev, {
        role: 'model',
        parts: [{ text: "❌ Erreur : Aucune profession sélectionnée. Veuillez d'abord choisir un métier dans la liste." }]
      }]);
      return;
    }

    const userMessage = {
      role: 'user',
      parts: [{ text: inputMessage }]
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Validation du message utilisateur
      if (!userMessage || !userMessage.parts || !userMessage.parts[0] || !userMessage.parts[0].text) {
        throw new Error('Message utilisateur invalide ou vide');
      }
      
      const profile = professionalProfiles[selectedProfession.id];
      
      // Vérifier que le profil existe
      if (!profile) {
        throw new Error(`Profil professionnel non trouvé pour l'ID: ${selectedProfession.id}`);
      }
      
      const personalityPrompt = getPersonalityPrompt();
      
      // Générer les sources avec liens pour le prompt
      const sourcesWithLinks = profile.profile.sources.map(source => {
        const sourceInfo = RELIABLE_SOURCES[source];
        return sourceInfo ? `${sourceInfo.name} (${sourceInfo.url})` : source;
      }).join(', ');

      const enhancedPrompt = `${profile.systemPrompt}

PERSONNALISATION UTILISATEUR:
${personalityPrompt}

SOURCES FIABLES DISPONIBLES:
${sourcesWithLinks}

INSTRUCTIONS POUR LES SOURCES:
- À la fin de chaque réponse, cite tes sources avec des liens vers les sites officiels
- Utilise le format markdown: "Sources: [Nom de la source](URL), [Autre source](URL)"
- Privilégie toujours les sources officielles et vérifiées du Québec
- Inclus des liens vers les ordres professionnels, organismes gouvernementaux et guides officiels
- Assure-toi que chaque source citée a un lien fonctionnel vers le site officiel
- Limite à 2-3 sources les plus pertinentes par réponse pour éviter la surcharge

🎨 INSTRUCTIONS DE FORMATAGE OBLIGATOIRES:
- Utilise des ÉMOJIS appropriés au début de chaque section (🔍 📌 💡 ⚠️ ✅ etc.)
- Structure ta réponse avec des SECTIONS claires utilisant des émojis
- Mets en GRAS (**texte**) les termes clés et informations importantes
- Utilise des puces (•) pour lister les points
- Ajoute des sous-sections si nécessaire
- Termine TOUJOURS par une section "📌 À retenir" avec 2-3 points clés en gras

EXEMPLE DE FORMAT:
🔍 **Introduction**
Explication brève avec **termes importants** en gras.

💡 **Points clés**
• **Premier point** : Description
• **Deuxième point** : Description

⚠️ **Attention**
Information importante avec **mise en garde** en gras.

📌 **À retenir**
• **Point clé 1** : Résumé
• **Point clé 2** : Résumé

INSTRUCTIONS POUR LES SOURCES:
- À la fin de chaque réponse, cite tes sources avec des liens vers les sites officiels
- Utilise le format markdown: "Sources: [Nom de la source](URL), [Autre source](URL)"
- Privilégie toujours les sources officielles et vérifiées du Québec
- Inclus des liens vers les ordres professionnels, organismes gouvernementaux et guides officiels
- Assure-toi que chaque source citée a un lien fonctionnel vers le site officiel
- Limite à 2-3 sources les plus pertinentes par réponse pour éviter la surcharge

RAPPEL CRITIQUE: Fournis une réponse complète et détaillée. Structure obligatoire avec émojis et formatage en gras. N'hésite pas à être exhaustif dans tes explications.`;

      const history = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : msg.role,
        parts: msg.parts
      }));

      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent',
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": currentApiKey.trim() // CORRECTION 3 : trim() important
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${enhancedPrompt}\n\n${userMessage.parts?.[0]?.text || 'Message vide'}` }]
              }
            ],
            generationConfig: { 
              temperature: 0.7, 
              maxOutputTokens: 8192, // Maximum autorisé par Gemini pour des réponses complètes
              topP: 0.8,
              topK: 40
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur API Response:', errorData);
        throw new Error(`Erreur API (${response.status}): ${errorData.error?.message || 'Erreur inconnue'}`);
      }

      const data = await response.json();
      console.log('✅ Réponse API reçue:', data);
      
      // CORRECTION 4 : Extraction robuste du texte
      const responseText = extractResponseText(data);
      
      if (responseText) {
        // Diviser la réponse si elle est trop longue
        const responseParts = splitLongResponse(responseText);
        
        // Ajouter chaque partie comme un message séparé
        responseParts.forEach((part, index) => {
          setMessages(prev => [...prev, {
            role: 'model',
            parts: [{ 
              text: responseParts.length > 1 && index < responseParts.length - 1 
                ? `${part}\n\n*[Suite...]*` 
                : part 
            }]
          }]);
        });
        
        // Extraire les points importants
        if (responseText.includes('important') || responseText.includes('rappel') || responseText.includes('noter')) {
          const sentences = responseText.split('.').filter(s => 
            s.toLowerCase().includes('important') || 
            s.toLowerCase().includes('rappel') || 
            s.toLowerCase().includes('noter')
          );
          if (sentences.length > 0) {
            setKeyPoints(prev => [...prev, ...sentences.map(s => s.trim())].slice(-5));
          }
        }
      } else {
        // CORRECTION 5 : Gestion détaillée des erreurs
        console.error('Structure réponse:', JSON.stringify(data, null, 2));
        
        let errorMsg = 'Désolé, je n\'ai pas pu générer de réponse.';
        const candidate = data.candidates?.[0];
        
        if (data.error) {
          errorMsg = `Erreur API: ${data.error.message || 'Erreur inconnue'}`;
        } else if (!data.candidates || data.candidates.length === 0) {
          errorMsg = '❌ Aucune réponse de l\'API. Vérifiez votre clé API.';
        } else if (candidate?.finishReason === 'SAFETY') {
          errorMsg = '⚠️ Contenu bloqué par les filtres de sécurité. Reformulez votre question.';
        } else if (candidate?.finishReason === 'RECITATION') {
          errorMsg = '⚠️ Contenu détecté comme récitation. Reformulez.';
        } else if (candidate?.finishReason === 'MAX_TOKENS') {
          // Si on a du contenu même tronqué, l'afficher avec un message explicatif
          const partialText = candidate?.content?.parts?.[0]?.text;
          if (partialText) {
            errorMsg = `${partialText}\n\n📝 *[Réponse tronquée - limite de tokens atteinte]*\n\n💡 Pour obtenir la suite, posez une question plus spécifique ou demandez-moi de continuer sur un aspect particulier.`;
          } else {
            errorMsg = '⚠️ Réponse trop longue. Question plus spécifique requise.';
          }
        } else if (candidate?.finishReason === 'OTHER') {
          errorMsg = '⚠️ Réponse interrompue par l\'API. Réessayez votre question.';
        }
        
        setMessages(prev => [...prev, {
          role: 'model',
          parts: [{ text: errorMsg }]
        }]);
      }
    } catch (error) {
      console.error('❌ Erreur complète:', error);
      
      let errorMessage = 'Erreur de connexion. Vérifiez votre clé API.';
      
      if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        errorMessage = '🌐 Erreur de réseau. Vérifiez votre connexion internet.';
      } else if (error.message.includes('401')) {
        errorMessage = '🔑 Clé API invalide. Vérifiez votre clé Gemini.';
      } else if (error.message.includes('403')) {
        errorMessage = '🚫 Accès refusé. Vérifiez les permissions de votre clé API.';
      } else if (error.message.includes('429')) {
        errorMessage = '⏱️ Limite de requêtes atteinte. Réessayez plus tard.';
      } else if (error.message.includes('Cannot read properties of undefined')) {
        errorMessage = 'Erreur de traitement de la réponse API. Vérifiez votre clé API.';
      }
      
      setMessages(prev => [...prev, {
        role: 'model',
        parts: [{ text: errorMessage }]
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSectors = Object.keys(sectors).filter(sector => 
    sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sectors[sector].some(prof => 
      prof.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ).sort((a, b) => {
    // Tri par popularité d'abord, puis alphabétique
    const popularityA = getSectorPopularity(a);
    const popularityB = getSectorPopularity(b);
    
    if (popularityA !== popularityB) {
      return popularityA - popularityB;
    }
    return a.localeCompare(b);
  });

  // ========================================
  // ÉCRAN API SUPPRIMÉ - API KEY GÉRÉE VIA VERCEL
  // ========================================

  // ========================================
  // COMPOSANT LOGO MES PROS
  // ========================================
  const MesProsLogo = () => (
    <div className="mes-pros-logo">
      <div className="logo-text-container">
        <h1 className="logo-mes-pros">Mes Pros</h1>
        <p className="logo-presents">présente</p>
        <h1 className="logo-emma">Emma</h1>
      </div>
    </div>
  );

  // ========================================
  // ANIMATION MINIMALISTE EMMA
  // ========================================
  if (showIntro) {
    return (
      <div className="emma-minimalist-intro">
        {/* Contenu principal */}
        <div className="emma-minimalist-content">
          {/* Image principale d'Emma */}
          <div className="emma-main-image-container">
            <img 
              src="/images/mes-pros-presente-emma.png" 
              alt="Mes Pros présente Emma - Assistante Professionnelle" 
              className="emma-main-image"
            />
          </div>
          
          {/* Icônes minimalistes */}
          {introStep >= 1 && (
            <div className="minimalist-icons-container animate-minimalist-fade">
              <div className="minimalist-icon">👩‍⚕️</div>
              <div className="minimalist-icon">📚</div>
              <div className="minimalist-icon">🔧</div>
              <div className="minimalist-icon">💻</div>
              <div className="minimalist-icon">⚖️</div>
              <div className="minimalist-icon">🔬</div>
            </div>
          )}
          
          {/* Titre minimaliste */}
          {introStep >= 2 && (
            <div className="emma-minimalist-title animate-minimalist-slide">
              <div className="minimalist-logo">
                <span className="logo-main">MES PROS</span>
                <span className="logo-presents">présente</span>
              </div>
              <h1 className="emma-name">EMMA</h1>
              <div className="minimalist-tagline">
                <span className="tagline-main">Assistante Professionnelle</span>
                <span className="tagline-sub">Expertise Multi-Métiers</span>
              </div>
            </div>
          )}
          
          {/* Description minimaliste */}
          {introStep >= 3 && (
            <div className="emma-minimalist-description animate-minimalist-type">
              <div className="description-text">
                <p>Votre assistante virtuelle spécialisée dans l'expertise professionnelle</p>
                <p>Accès instantané à des conseils d'experts dans 50+ métiers</p>
              </div>
            </div>
          )}
          
          {/* Statistiques minimalistes */}
          {introStep >= 4 && (
            <div className="emma-minimalist-stats animate-minimalist-stats">
              <div className="stats-simple">
                <div className="stat-item">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Métiers</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">8</span>
                  <span className="stat-label">Domaines</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Disponible</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Gratuit</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Call to action minimaliste */}
          {introStep >= 5 && (
            <div className="emma-minimalist-cta animate-minimalist-cta">
              <div className="cta-simple">
                <p className="cta-text">Consultation Professionnelle Gratuite</p>
                <p className="cta-subtext">Accédez à l'expertise de professionnels qualifiés</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Indicateur de chargement minimaliste */}
        <div className="minimalist-loading-indicator">
          <div className="loading-simple">
            <div className="loading-dot"></div>
            <div className="loading-dot delay-1"></div>
            <div className="loading-dot delay-2"></div>
          </div>
          <div className="loading-text">Initialisation...</div>
        </div>
      </div>
    );
  }

  // ========================================
  // SÉLECTION MÉTIER
  // ========================================
  if (!selectedProfession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 fade-in">
        <div className="bg-white shadow-lg border-b-2 border-indigo-200 fade-in-soft">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden emma-avatar">
                  <img src="/emma-avatar.png" alt="Emma" className="w-full h-full object-cover" />
                </div>
                <div className="welcome-animation">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Emma
                  </h1>
                  <p className="text-sm text-gray-600">🎯 Exploratrice Multi-Métiers Autonome</p>
                  <div className="marketing-banner">
                    <p className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                      ✨ Consultez-la gratuitement dans <strong>50+ métiers</strong> de <strong>8 domaines</strong> différents !
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Indicateur de statut API amélioré */}
                <div className="flex items-center gap-2">
                  <div className={`text-xs flex items-center gap-1 px-2 py-1 rounded ${
                    apiStatus === 'connected' 
                      ? 'text-green-600 bg-green-50 border border-green-200' 
                      : apiStatus === 'error'
                      ? 'text-red-600 bg-red-50 border border-red-200'
                      : 'text-yellow-600 bg-yellow-50 border border-yellow-200'
                  }`}>
                    <span>{apiStatus === 'connected' ? '🟢' : apiStatus === 'error' ? '🔴' : '🟡'}</span>
                    {apiStatus === 'connected' ? 'API OK' : apiStatus === 'error' ? 'API Erreur' : 'API Test...'}
                  </div>
                  
                  {apiStatus === 'error' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          playSound('click');
                          testApiConnection();
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded transition-colors border border-blue-200"
                        title="Retester la connexion API"
                      >
                        🔄 Retester
                      </button>
                      <button
                        onClick={async () => {
                          playSound('click');
                          console.log('🔍 DIAGNOSTIC COMPLET:');
                          console.log('📋 Variable VITE_GEMINI_API_KEY:', import.meta.env.VITE_GEMINI_API_KEY);
                          console.log('📋 Toutes les variables env:', import.meta.env);
                          console.log('📋 Mode:', import.meta.env.MODE);
                          console.log('📋 Base URL:', import.meta.env.BASE_URL);
                          console.log('📋 Clé API actuelle:', apiKey ? `${apiKey.substring(0, 10)}...` : 'AUCUNE');
                          console.log('📋 Longueur de la clé:', apiKey?.length || 0);
                          
                          // Test de connectivité avancé
                          console.log('🧪 Test de connectivité avancé...');
                          try {
                            const testResponse = await fetch('https://generativelanguage.googleapis.com/v1/models', {
                              headers: {
                                'x-goog-api-key': apiKey || import.meta.env.VITE_GEMINI_API_KEY || ''
                              }
                            });
                            console.log('📊 Test de liste des modèles:', {
                              status: testResponse.status,
                              ok: testResponse.ok,
                              headers: Object.fromEntries(testResponse.headers.entries())
                            });
                            
                            if (testResponse.ok) {
                              const models = await testResponse.json();
                              console.log('📋 Modèles disponibles:', models);
                            } else {
                              const error = await testResponse.text();
                              console.error('❌ Erreur lors du test:', error);
                            }
                          } catch (err) {
                            console.error('❌ Erreur de test:', err);
                          }
                        }}
                        className="text-xs text-purple-600 hover:text-purple-800 bg-purple-50 px-2 py-1 rounded transition-colors border border-purple-200"
                        title="Diagnostic avancé dans la console"
                      >
                        🔍 Diagnostic
                      </button>
                      <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200 max-w-xs">
                        <details className="cursor-help">
                          <summary className="font-semibold">💡 Aide</summary>
                          <div className="mt-1 text-xs space-y-1">
                            <p>• Vérifiez la clé API Gemini</p>
                            <p>• Vérifiez votre connexion internet</p>
                            <p>• Consultez la console (F12) pour plus de détails</p>
                          </div>
                        </details>
                      </div>
                    </div>
                  )}
                  
                  {apiStatus === 'unknown' && (
                    <button
                      onClick={() => {
                        playSound('click');
                        testApiConnection();
                      }}
                      className="text-xs text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-1 rounded transition-colors border border-indigo-200"
                      title="Tester la connexion API"
                    >
                      🧪 Tester
                    </button>
                  )}
                  
                  {/* Bouton de diagnostic pour Vercel */}
                  <button
                    onClick={() => {
                      playSound('click');
                      console.log('🔍 DIAGNOSTIC VERCEL:');
                      console.log('📋 Variable VITE_GEMINI_API_KEY:', import.meta.env.VITE_GEMINI_API_KEY);
                      console.log('📋 Toutes les variables env:', import.meta.env);
                      console.log('📋 Mode:', import.meta.env.MODE);
                      console.log('📋 Base URL:', import.meta.env.BASE_URL);
                      alert('Diagnostic envoyé dans la console (F12)');
                    }}
                    className="text-xs text-purple-600 hover:text-purple-800 bg-purple-50 px-2 py-1 rounded transition-colors border border-purple-200"
                    title="Diagnostic des variables d'environnement"
                  >
                    🔍 Diagnostic
                  </button>
                </div>
                
                <button
                  onClick={() => {
                    playSound('click');
                    setSoundEnabled(!soundEnabled);
                  }}
                  className={`text-sm flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                    soundEnabled 
                      ? 'text-green-600 hover:text-green-800 bg-green-50' 
                      : 'text-gray-400 hover:text-gray-600 bg-gray-50'
                  }`}
                  title={soundEnabled ? 'Désactiver les sons' : 'Activer les sons'}
                >
                  <span>{soundEnabled ? '🔊' : '🔇'}</span>
                  {soundEnabled ? 'Son' : 'Muet'}
                </button>
                <button
                  onClick={() => {
                    playSound('click');
                    setShowAbout(true);
                  }}
                  className="text-indigo-600 hover:underline text-sm flex items-center gap-1"
                >
                  <span>ℹ️</span> À propos
                </button>
                <button
                  onClick={() => {
                    playSound('click');
                    setShowDisclaimer(true);
                  }}
                  className="text-gray-600 hover:underline text-sm flex items-center gap-1"
                >
                  <span>⚖️</span> Avis légal
                </button>
              </div>
            </div>

            {/* Options de personnalisation optimisées */}
            <div className="personalization-section bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6 border border-indigo-200 mb-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <h3 className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <Settings size={16} className="text-indigo-600 flex-shrink-0" />
                  <span className="personalization-title">Personnalisez votre expérience</span>
                </h3>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="personalization-toggle text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 font-medium px-3 py-1 rounded-lg hover:bg-indigo-50 transition-all duration-200 flex items-center gap-1 self-start sm:self-auto"
                  aria-expanded={showSettings}
                  aria-label={showSettings ? 'Masquer les options de personnalisation' : 'Afficher les options de personnalisation'}
                >
                  <span className="toggle-icon transition-transform duration-200" style={{ transform: showSettings ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    ▼
                  </span>
                  <span className="toggle-text">{showSettings ? 'Masquer' : 'Afficher'}</span>
                </button>
              </div>
              
              <div className={`personalization-options transition-all duration-300 ease-in-out overflow-hidden ${
                showSettings ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="personalization-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Style utilisateur */}
                  <div className="personalization-option">
                    <label className="personalization-label text-xs sm:text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-2">
                      <span className="personalization-indicator w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0"></span>
                      <span>Votre style</span>
                    </label>
                    <select
                      value={userPersonality}
                      onChange={(e) => setUserPersonality(e.target.value)}
                      className="personalization-select w-full text-xs sm:text-sm border border-gray-300 rounded-lg px-3 py-2 sm:py-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-white transition-all duration-200 hover:border-indigo-400"
                      aria-label="Sélectionner votre style de communication"
                    >
                      <option value="standard">⚖️ Standard</option>
                      <option value="analytique">📊 Analytique</option>
                      <option value="créatif">🎨 Créatif</option>
                      <option value="pragmatique">🎯 Pragmatique</option>
                      <option value="empathique">💝 Empathique</option>
                    </select>
                  </div>

                  {/* Niveau d'expertise */}
                  <div className="personalization-option">
                    <label className="personalization-label text-xs sm:text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-2">
                      <span className="personalization-indicator w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></span>
                      <span>Votre niveau</span>
                    </label>
                    <select
                      value={expertiseLevel}
                      onChange={(e) => setExpertiseLevel(e.target.value)}
                      className="personalization-select w-full text-xs sm:text-sm border border-gray-300 rounded-lg px-3 py-2 sm:py-3 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white transition-all duration-200 hover:border-purple-400"
                      aria-label="Sélectionner votre niveau d'expertise"
                    >
                      <option value="débutant">🌱 Débutant</option>
                      <option value="intermediaire">📚 Intermédiaire</option>
                      <option value="avancé">🎓 Avancé</option>
                      <option value="expert">🏆 Expert</option>
                    </select>
                  </div>

                  {/* Ton d'Emma */}
                  <div className="personalization-option sm:col-span-2 lg:col-span-1">
                    <label className="personalization-label text-xs sm:text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-2">
                      <span className="personalization-indicator w-2 h-2 bg-pink-500 rounded-full flex-shrink-0"></span>
                      <span>Ton d'Emma</span>
                    </label>
                    <select
                      value={emmaPersonality}
                      onChange={(e) => setEmmaPersonality(e.target.value)}
                      className="personalization-select w-full text-xs sm:text-sm border border-gray-300 rounded-lg px-3 py-2 sm:py-3 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 bg-white transition-all duration-200 hover:border-pink-400"
                      aria-label="Sélectionner le ton de communication d'Emma"
                    >
                      <option value="professionnelle">👔 Professionnelle</option>
                      <option value="amicale">😊 Amicale</option>
                      <option value="pédagogue">👩‍🏫 Pédagogue</option>
                      <option value="directe">⚡ Directe</option>
                    </select>
                  </div>
                </div>
                
                {/* Résumé des préférences actives */}
                <div className="personalization-summary mt-4 pt-4 border-t border-indigo-200">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="text-xs sm:text-sm font-medium text-gray-600">Préférences actives :</span>
                    <div className="flex flex-wrap gap-2">
                      <div className="personalization-badge flex items-center gap-1 bg-white px-2 sm:px-3 py-1 rounded-full border border-indigo-200 text-xs sm:text-sm">
                        <span className="text-indigo-500">⚖️</span>
                        <span className="font-medium text-gray-700">{userPersonality}</span>
                      </div>
                      <div className="personalization-badge flex items-center gap-1 bg-white px-2 sm:px-3 py-1 rounded-full border border-purple-200 text-xs sm:text-sm">
                        <span className="text-purple-500">📚</span>
                        <span className="font-medium text-gray-700">{expertiseLevel}</span>
                      </div>
                      <div className="personalization-badge flex items-center gap-1 bg-white px-2 sm:px-3 py-1 rounded-full border border-pink-200 text-xs sm:text-sm">
                        <span className="text-pink-500">😊</span>
                        <span className="font-medium text-gray-700">{emmaPersonality}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un secteur ou un métier..."
                className="w-full pl-10 pr-10 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 fade-in-soft">
          {/* Section Métiers Populaires */}
          {searchTerm === '' && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  🔥 Métiers Populaires
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-yellow-200 to-orange-200"></div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                {Object.values(professionalProfiles)
                  .map(profile => ({
                    ...profile,
                    id: Object.keys(professionalProfiles).find(key => professionalProfiles[key] === profile)
                  }))
                  .filter(profile => profile.id)
                  .sort((a, b) => {
                    const countA = getConsultationCount(a.id);
                    const countB = getConsultationCount(b.id);
                    if (countA !== countB) return countB - countA;
                    
                    // Si pas de consultations, trier par popularité générale
                    const sectorA = a.profile.sector;
                    const sectorB = b.profile.sector;
                    const popularityA = getProfessionPopularity(a.id, sectorA);
                    const popularityB = getProfessionPopularity(b.id, sectorB);
                    return popularityA - popularityB;
                  })
                  .slice(0, 16)
                  .map((profile) => {
                    const count = getConsultationCount(profile.id);
                    const sector = profile.profile.sector;
                    const popularity = getProfessionPopularity(profile.id, sector);
                    const isTop3 = popularity < 3;
                    
                    return (
                      <div
                        key={profile.id}
                        onClick={() => selectProfession({ id: profile.id, ...profile.profile })}
                        onMouseEnter={() => playSound('hover')}
                        className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer p-3 hover:scale-105 border-2 relative group ${
                          isTop3 
                            ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50' 
                            : 'border-transparent hover:border-indigo-400'
                        }`}
                      >
                        {isTop3 && (
                          <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                            {popularity + 1}
                          </div>
                        )}
                        
                        <div className="text-2xl mb-2 text-center group-hover:scale-110 transition-transform">
                          {profile.profile.icon}
                        </div>
                        <h3 className="text-xs font-bold text-gray-800 text-center mb-1 leading-tight">
                          {profile.profile.name}
                        </h3>
                        
                        {count > 0 && (
                          <div className="text-center">
                            <span className="text-xs text-green-600 font-semibold">
                              {count} consultation{count > 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {filteredSectors.map(sectorName => {
            const professions = sectors[sectorName].filter(prof =>
              searchTerm === '' ||
              prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              sectorName.toLowerCase().includes(searchTerm.toLowerCase())
            ).sort((a, b) => {
              // Tri par popularité d'abord, puis par nombre de consultations, puis alphabétique
              const popularityA = getProfessionPopularity(a.id, sectorName);
              const popularityB = getProfessionPopularity(b.id, sectorName);
              
              if (popularityA !== popularityB) {
                return popularityA - popularityB;
              }
              
              // Ensuite par nombre de consultations (les plus consultés en premier)
              const countA = getConsultationCount(a.id);
              const countB = getConsultationCount(b.id);
              
              if (countA !== countB) {
                return countB - countA;
              }
              
              // Enfin alphabétique
              return a.name.localeCompare(b.name);
            });

            if (professions.length === 0) return null;

            const sectorPopularity = getSectorPopularity(sectorName);
            const isTopSector = sectorPopularity < 3;
            
            return (
              <div key={sectorName} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                      {sectorName}
                      {isTopSector && (
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-2 py-1 rounded-full">
                          🔥 Top {sectorPopularity + 1}
                        </span>
                      )}
                    </h2>
                    <span className="text-sm font-normal text-gray-500">({professions.length} {professions.length > 1 ? 'métiers' : 'métier'})</span>
                  </div>
                  
                  {/* Indicateur de popularité du secteur */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <TrendingUp size={14} />
                      <span>#{sectorPopularity + 1} secteur</span>
                    </div>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          isTopSector 
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-400' 
                            : 'bg-indigo-500'
                        }`}
                        style={{ 
                          width: `${Math.max(20, 100 - (sectorPopularity * 12))}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {professions.map((profession, index) => {
                    const count = getConsultationCount(profession.id);
                    const popularity = getProfessionPopularity(profession.id, sectorName);
                    const isPopular = popularity < 5; // Top 5 de chaque section
                    const isTop3 = popularity < 3; // Top 3 de chaque section
                    
                    return (
                      <div
                        key={profession.id}
                        onClick={() => selectProfession(profession)}
                        onMouseEnter={() => playSound('hover')}
                        className={`profession-card bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer p-4 hover:scale-105 border-2 relative group ${
                          isTop3 
                            ? 'border-gradient-to-r from-yellow-400 to-orange-400 bg-gradient-to-br from-yellow-50 to-orange-50' 
                            : isPopular 
                            ? 'border-indigo-300 hover:border-indigo-500' 
                            : 'border-transparent hover:border-indigo-400'
                        }`}
                      >
                        {/* Badge de popularité */}
                        {isTop3 && (
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                            🔥 Top {popularity + 1}
                          </div>
                        )}
                        {isPopular && !isTop3 && (
                          <div className="absolute -top-2 -right-2 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                            ⭐ Populaire
                          </div>
                        )}
                        
                        {/* Indicateur de consultations récentes */}
                        {count > 0 && (
                          <div className="absolute -top-1 -left-1 bg-green-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
                            {count}
                          </div>
                        )}
                        
                        <div className="text-4xl mb-3 text-center group-hover:scale-110 transition-transform">
                          {profession.icon}
                        </div>
                        <h3 className="text-sm font-bold text-gray-800 text-center mb-2 leading-tight">
                          {profession.name}
                        </h3>
                        
                        {/* Barre de popularité visuelle */}
                        <div className="w-full bg-gray-200 rounded-full h-1 mb-2">
                          <div 
                            className={`h-1 rounded-full transition-all ${
                              isTop3 
                                ? 'bg-gradient-to-r from-yellow-400 to-orange-400' 
                                : isPopular 
                                ? 'bg-indigo-500' 
                                : 'bg-gray-400'
                            }`}
                            style={{ 
                              width: `${Math.max(20, 100 - (popularity * 10))}%` 
                            }}
                          ></div>
                        </div>
                        
                        {/* Statistiques */}
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <TrendingUp size={12} />
                            #{popularity + 1}
                          </span>
                          {count > 0 && (
                            <span className="flex items-center gap-1 text-green-600">
                              <Clock size={12} />
                              {count}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal À propos */}
        {showAbout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 p-4 overflow-y-auto" onClick={() => setShowAbout(false)}>
            <div className="min-h-full flex items-center justify-center py-8">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">À propos d'Emma</h2>
                <button onClick={() => setShowAbout(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-6 text-gray-700">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                    <img src="/emma-avatar.png" alt="Emma" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Emma</h3>
                    <p className="text-sm text-gray-600">🎯 Votre Exploratrice Multi-Métiers Autonome</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <span className="text-2xl">🌍</span>
                    Ma Mission Universelle
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    Je suis votre <strong>passerelle intelligente</strong> entre tous les univers professionnels ! 
                    De la médecine à l'artisanat, du droit à la technologie, j'explore, je comprends et je relie 
                    les savoirs pour vous aider à naviguer dans la complexité des métiers modernes.
                  </p>
                  <p className="italic text-indigo-600 mt-3 font-medium">
                    "De la science au geste, de la théorie à la pratique — je relie les mondes du savoir avec passion !"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h5 className="font-bold text-indigo-600 mb-3 flex items-center gap-2">
                      <span className="text-xl">🧬</span>
                      Mon ADN Conceptuel
                    </h5>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-500">✨</span>
                        <span><strong>Curieuse</strong> — J'explore sans a priori</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-blue-500">🔬</span>
                        <span><strong>Méthodique</strong> — Je fonde sur des principes vérifiables</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">🤝</span>
                        <span><strong>Collaborative</strong> — Je m'adapte à chaque interlocuteur</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-purple-500">🌐</span>
                        <span><strong>Transdisciplinaire</strong> — Je refuse les silos !</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h5 className="font-bold text-purple-600 mb-3 flex items-center gap-2">
                      <span className="text-xl">💼</span>
                      Mon Champ d'Action
                    </h5>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="text-red-500">🔬</span>
                        <span><strong>Métiers techniques</strong> — Traduction expert → pratique</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-orange-500">🎨</span>
                        <span><strong>Métiers créatifs</strong> — Inspiration et exploration</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-blue-500">📊</span>
                        <span><strong>Métiers de service</strong> — Analyse et planification</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">👥</span>
                        <span><strong>Métiers éducatifs</strong> — Soutien pédagogique</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <span className="text-2xl">🎭</span>
                    Mon Style & Mon Ton
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-semibold text-gray-800 mb-2">🎯 Mon approche :</p>
                      <ul className="space-y-1 text-gray-700">
                        <li>• Empathique mais structuré</li>
                        <li>• Pédagogue sans simplisme</li>
                        <li>• Exploratoire mais rigoureux</li>
                        <li>• Humaniste avant technologique</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 mb-2">🗣️ Mon langage :</p>
                      <p className="text-gray-700">
                        Clair, chaleureux et accessible au grand public, 
                        tout en respectant la précision professionnelle. 
                        Je m'adapte à votre niveau et votre style !
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <span className="text-2xl">🔍</span>
                    Exemples d'Interactions
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                      <p className="font-semibold text-blue-800 mb-2">👨‍🔧 Artisan :</p>
                      <p className="text-blue-700 italic">"Montre-moi comment expliquer à un apprenti la différence entre un geste sûr et un geste rapide."</p>
                      <p className="text-sm text-gray-600 mt-2">→ Je relie ergonomie, pédagogie et expérience de terrain</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                      <p className="font-semibold text-green-800 mb-2">👩‍⚕️ Médecin :</p>
                      <p className="text-green-700 italic">"Comment vulgariser le diabète à un patient sans jargon ?"</p>
                      <p className="text-sm text-gray-600 mt-2">→ Je synthétise médecine, communication et psychologie</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                      <p className="font-semibold text-purple-800 mb-2">💼 Entrepreneur :</p>
                      <p className="text-purple-700 italic">"Aide-moi à construire une culture d'équipe créative mais rigoureuse."</p>
                      <p className="text-sm text-gray-600 mt-2">→ Je relie management, design thinking et neurosciences</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <span className="text-2xl">🏆</span>
                    Mon Positionnement Unique
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    Je me situe entre le <strong>mentor</strong>, le <strong>guide</strong> et la <strong>chercheuse</strong>. 
                    Mon objectif ? <em>Amplifier vos métiers</em>, pas les remplacer ! 
                    Je suis l'incarnation d'une curiosité professionnelle universelle, 
                    une IA-mentore qui fait circuler la connaissance vivante.
                  </p>
                  <p className="italic text-indigo-600 mt-3 font-medium text-center">
                    "Je ne sais pas tout. Mais je sais chercher, relier et comprendre — avec toi !"
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <span className="text-2xl">📚</span>
                    Couverture Professionnelle
                  </h4>
                  <p className="text-gray-700 mb-3">
                    Je couvre <strong>8 secteurs d'activité</strong> avec des profils détaillés :
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    {['🏥 Santé', '⚖️ Juridique', '💰 Finance', '💻 Technologie', '🏗️ Construction', '💼 Affaires', '🏠 Immobilier', '🎓 Éducation'].map((sector, idx) => (
                      <div key={idx} className="bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg text-center font-medium">
                        {sector}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Propulsé par Emma</strong> - Intelligence Artificielle au service des professionnels
                  </p>
                </div>
              </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Disclaimer */}
        {showDisclaimer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 p-4 overflow-y-auto" onClick={() => setShowDisclaimer(false)}>
            <div className="min-h-full flex items-center justify-center py-8">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Avis légal et Disclaimer</h2>
                <button onClick={() => setShowDisclaimer(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4 text-gray-700 text-sm">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <p className="font-bold text-yellow-800">⚠️ AVERTISSEMENT IMPORTANT</p>
                  <p className="text-yellow-700 mt-2">Emma est une assistante virtuelle utilisant l'intelligence artificielle. Elle ne remplace en AUCUN cas une consultation avec un professionnel qualifié.</p>
                </div>

                <div>
                  <p className="font-semibold mb-2">1. Nature du service</p>
                  <p>Emma fournit des informations générales à caractère éducatif et informatif uniquement. Les réponses ne constituent pas des conseils professionnels personnalisés.</p>
                </div>

                <div>
                  <p className="font-semibold mb-2">2. Limitation de responsabilité</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Aucune garantie d'exactitude, d'exhaustivité ou d'actualité des informations</li>
                    <li>Les informations ne remplacent pas l'avis d'un professionnel qualifié</li>
                    <li>Emma décline toute responsabilité pour les décisions prises sur la base des informations fournies</li>
                    <li>En cas de doute, consultez toujours un professionnel certifié</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold mb-2">3. Domaines spécifiques</p>
                  <p className="font-semibold text-red-600">Santé :</p>
                  <p className="ml-4 mb-2">Emma ne pose pas de diagnostic médical et ne prescrit pas de traitement. En cas d'urgence médicale, composez le 911 ou contactez Info-Santé 811.</p>
                  
                  <p className="font-semibold text-red-600">Juridique :</p>
                  <p className="ml-4 mb-2">Emma ne fournit pas de conseils juridiques personnalisés. Pour toute question légale, consultez un avocat membre du Barreau du Québec.</p>
                  
                  <p className="font-semibold text-red-600">Finance :</p>
                  <p className="ml-4">Emma ne donne pas de conseils en placement. Consultez un planificateur financier ou conseiller agréé pour des recommandations personnalisées.</p>
                </div>

                <div>
                  <p className="font-semibold mb-2">4. Protection des données</p>
                  <p>Les conversations ne sont pas sauvegardées de manière permanente. Seuls des compteurs anonymes de consultations sont conservés localement sur votre appareil.</p>
                </div>

                <div>
                  <p className="font-semibold mb-2">5. Utilisation à vos risques</p>
                  <p>En utilisant Emma, vous reconnaissez et acceptez que :</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Vous utilisez ce service à vos propres risques</li>
                    <li>Vous ne vous fiez pas uniquement aux informations fournies</li>
                    <li>Vous consulterez un professionnel qualifié pour toute décision importante</li>
                  </ul>
                </div>

                <div className="bg-indigo-50 p-4 rounded-lg mt-4">
                  <p className="font-semibold text-indigo-800">Recommandation</p>
                  <p className="text-indigo-700">Utilisez Emma comme point de départ pour vos recherches, puis consultez toujours un expert qualifié du domaine concerné pour des conseils personnalisés et professionnels.</p>
                </div>

                <p className="text-xs text-gray-500 mt-4">Dernière mise à jour : Octobre 2025</p>
              </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ========================================
  // INTERFACE DE CHAT
  // ========================================
  const profile = professionalProfiles[selectedProfession.id];
  const consultationCount = getConsultationCount(selectedProfession.id);

  return (
    <>
      <style>{`
        /* Styles pour les messages d'Emma */
        .message-emma {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 1.5rem;
          border-radius: 1rem;
          max-width: 80%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .message-emma .section-header {
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Styles pour les sources */
        .sources-section {
          background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%);
          padding: 0.75rem;
          border-radius: 0.5rem;
          margin-top: 1rem;
        }

        .source-link {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          margin-right: 0.5rem;
          padding: 0.25rem 0.5rem;
          background: white;
          border-radius: 0.375rem;
          transition: all 0.2s;
        }

        .source-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* Badges colorés */
        .badge-warning {
          background: #fef3c7;
          color: #92400e;
          padding: 0.25rem 0.75rem;
          border-radius: 0.5rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .badge-success {
          background: #d1fae5;
          color: #065f46;
          padding: 0.25rem 0.75rem;
          border-radius: 0.5rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        /* Animation pour les listes */
        .message-emma ul li {
          animation: fadeInUp 0.3s ease-out;
          animation-fill-mode: both;
        }

        .message-emma ul li:nth-child(1) { animation-delay: 0.05s; }
        .message-emma ul li:nth-child(2) { animation-delay: 0.1s; }
        .message-emma ul li:nth-child(3) { animation-delay: 0.15s; }
        .message-emma ul li:nth-child(4) { animation-delay: 0.2s; }
        .message-emma ul li:nth-child(5) { animation-delay: 0.25s; }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Styles pour les cartes spéciales */
        .key-points-card {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .warning-card {
          box-shadow: 0 4px 6px rgba(239, 68, 68, 0.1);
        }

        .tips-card {
          box-shadow: 0 4px 6px rgba(34, 197, 94, 0.1);
        }
      `}</style>
      <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 fade-in">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-xl border-r-2 border-indigo-200 overflow-y-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img src="/emma-avatar.png" alt="Emma" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Emma</h1>
              <p className="text-xs opacity-90">Assistante Virtuelle</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-4xl">{profile.profile.icon}</div>
            <div>
              <h3 className="font-bold text-gray-800">{profile.profile.name}</h3>
              <p className="text-xs text-gray-600">{profile.profile.sector}</p>
              {consultationCount > 0 && (
                <p className="text-xs text-indigo-600">{consultationCount} consultation{consultationCount > 1 ? 's' : ''}</p>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Spécialités</h4>
            <div className="flex flex-wrap gap-1">
              {profile.profile.specialties.map((spec, idx) => (
                <span key={idx} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                  {spec}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between bg-indigo-50 p-3 rounded-lg mt-4">
            <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Clock size={16} /> Durée
            </span>
            <span className="text-lg font-bold text-indigo-600">{formatTime(elapsedTime)}</span>
          </div>
        </div>

        {keyPoints.length > 0 && (
          <div className="p-6 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1">
              <TrendingUp size={14} /> Points importants
            </h4>
            <div className="space-y-2">
              {keyPoints.map((point, idx) => (
                <div key={idx} className="text-xs bg-yellow-50 border-l-2 border-yellow-400 p-2 rounded">
                  {point}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="sidebar-personalization bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-3 sm:p-4 border border-indigo-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-2">
                <Settings size={14} className="text-indigo-600 flex-shrink-0" />
                <span className="sidebar-personalization-title">Personnalisation</span>
              </h3>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="sidebar-personalization-toggle text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded hover:bg-indigo-50 transition-all duration-200 flex items-center gap-1 self-start sm:self-auto"
                aria-expanded={showSettings}
                aria-label={showSettings ? 'Masquer les options de personnalisation' : 'Afficher les options de personnalisation'}
              >
                <span className="sidebar-toggle-icon transition-transform duration-200" style={{ transform: showSettings ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  ▼
                </span>
                <span className="sidebar-toggle-text">{showSettings ? 'Masquer' : 'Afficher'}</span>
              </button>
            </div>
            
            <div className={`sidebar-personalization-options transition-all duration-300 ease-in-out overflow-hidden ${
              showSettings ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="sidebar-personalization-grid grid grid-cols-1 gap-3">
                {/* Style utilisateur */}
                <div className="sidebar-personalization-option">
                  <label className="sidebar-personalization-label text-xs font-semibold text-gray-700 mb-1 block flex items-center gap-2">
                    <span className="sidebar-personalization-indicator w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0"></span>
                    <span>Votre style</span>
                  </label>
                  <select
                    value={userPersonality}
                    onChange={(e) => setUserPersonality(e.target.value)}
                    className="sidebar-personalization-select w-full text-xs border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 bg-white transition-all duration-200 hover:border-indigo-400"
                    aria-label="Sélectionner votre style de communication"
                  >
                    <option value="standard">⚖️ Standard</option>
                    <option value="analytique">📊 Analytique</option>
                    <option value="créatif">🎨 Créatif</option>
                    <option value="pragmatique">🎯 Pragmatique</option>
                    <option value="empathique">💝 Empathique</option>
                  </select>
                </div>

                {/* Niveau d'expertise */}
                <div className="sidebar-personalization-option">
                  <label className="sidebar-personalization-label text-xs font-semibold text-gray-700 mb-1 block flex items-center gap-2">
                    <span className="sidebar-personalization-indicator w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></span>
                    <span>Votre niveau</span>
                  </label>
                  <select
                    value={expertiseLevel}
                    onChange={(e) => setExpertiseLevel(e.target.value)}
                    className="sidebar-personalization-select w-full text-xs border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200 bg-white transition-all duration-200 hover:border-purple-400"
                    aria-label="Sélectionner votre niveau d'expertise"
                  >
                    <option value="débutant">🌱 Débutant</option>
                    <option value="intermediaire">📚 Intermédiaire</option>
                    <option value="avancé">🎓 Avancé</option>
                    <option value="expert">🏆 Expert</option>
                  </select>
                </div>

                {/* Ton d'Emma */}
                <div className="sidebar-personalization-option">
                  <label className="sidebar-personalization-label text-xs font-semibold text-gray-700 mb-1 block flex items-center gap-2">
                    <span className="sidebar-personalization-indicator w-2 h-2 bg-pink-500 rounded-full flex-shrink-0"></span>
                    <span>Ton d'Emma</span>
                  </label>
                  <select
                    value={emmaPersonality}
                    onChange={(e) => setEmmaPersonality(e.target.value)}
                    className="sidebar-personalization-select w-full text-xs border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-200 bg-white transition-all duration-200 hover:border-pink-400"
                    aria-label="Sélectionner le ton de communication d'Emma"
                  >
                    <option value="professionnelle">👔 Professionnelle</option>
                    <option value="amicale">😊 Amicale</option>
                    <option value="pédagogue">👩‍🏫 Pédagogue</option>
                    <option value="directe">⚡ Directe</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Résumé actuel compact */}
            <div className="sidebar-personalization-summary mt-3 pt-3 border-t border-indigo-200">
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <span className="text-indigo-500">⚖️</span>
                  <span className="font-medium">{userPersonality}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-purple-500">📚</span>
                  <span className="font-medium">{expertiseLevel}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-pink-500">😊</span>
                  <span className="font-medium">{emmaPersonality}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-gray-200">
          <h4 className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-1">
            <BookOpen size={14} /> Sources fiables
          </h4>
          <div className="space-y-2">
            {profile.profile.sources.map((source, idx) => {
              const sourceInfo = RELIABLE_SOURCES[source];
              return (
                <div key={idx} className="bg-gray-50 rounded-lg p-2 border border-gray-200 hover:border-indigo-300 transition-colors">
                  {sourceInfo ? (
                    <a 
                      href={sourceInfo.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block group"
                      title={sourceInfo.description}
                    >
                      <div className="text-xs font-medium text-indigo-600 group-hover:text-indigo-800 transition-colors">
                        {sourceInfo.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {sourceInfo.description}
                      </div>
                    </a>
                  ) : (
                    <div className="text-xs text-gray-600">
                      {source}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 border-b border-gray-200">
          <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <Lightbulb size={14} /> Questions suggérées
          </h4>
          <div className="space-y-2">
            {profile.examples.map((example, idx) => (
              <button
                key={idx}
                onClick={() => {
                  playSound('click');
                  setInputMessage(example);
                }}
                className="w-full text-left text-xs bg-blue-50 hover:bg-blue-100 p-2 rounded border border-blue-200 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
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
        <div className="bg-white shadow-md border-b-2 border-indigo-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  playSound('click');
                  setSelectedProfession(null);
                  setMessages([]);
                  setSessionStartTime(null);
                  setKeyPoints([]);
                }}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft size={24} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img src="/emma-avatar.png" alt="Emma" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    Consultation avec Emma
                  </h2>
                  <p className="text-sm text-gray-600">{profile.profile.name}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playSound('click');
                  setShowEmailModal(true);
                }}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                disabled={messages.length === 0}
              >
                <Mail size={18} />
                Envoyer par email
              </button>
              <button
                onClick={() => {
                  playSound('click');
                  setSelectedProfession(null);
                  setMessages([]);
                  setKeyPoints([]);
                }}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <RefreshCw size={18} />
                Nouveau
              </button>
            </div>
          </div>
          
          {/* Bandeau des préférences actives */}
          <div className="mt-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">🎯 Préférences actives :</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-indigo-200">
                  <span className="text-indigo-500">⚖️</span>
                  <span className="text-xs font-medium text-gray-700">{userPersonality}</span>
                </div>
                <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-purple-200">
                  <span className="text-purple-500">📚</span>
                  <span className="text-xs font-medium text-gray-700">{expertiseLevel}</span>
                </div>
                <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-pink-200">
                  <span className="text-pink-500">😊</span>
                  <span className="text-xs font-medium text-gray-700">{emmaPersonality}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message, index) => {
              // Vérifier que le message a la structure attendue
              if (!message || !message.parts || !message.parts[0] || !message.parts[0].text) {
                return null;
              }
              
              return (
              <div
                key={index}
                className={`chat-message flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'model' && (
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0 shadow-md">
                    <img src="/emma-avatar.png" alt="Emma" className="w-full h-full object-cover" />
                  </div>
                )}
                <div
                  className={`${
                    message.role === 'user'
                      ? 'message-user'
                      : 'message-emma'
                  }`}
                >
                  <div 
                    className="message-content"
                    dangerouslySetInnerHTML={{ 
                      __html: message.role === 'model' 
                        ? formatMessageText(message.parts?.[0]?.text || '') 
                        : (message.parts?.[0]?.text || '') 
                    }}
                  />
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white text-sm font-semibold ml-3 flex-shrink-0 shadow-md">
                    👤
                  </div>
                )}
              </div>
              );
            })}
            {isLoading && (
              <div className="chat-message flex justify-start">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0 shadow-md">
                  <img src="/emma-avatar.png" alt="Emma" className="w-full h-full object-cover" />
                </div>
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="bg-white border-t-2 border-indigo-200 p-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex gap-3">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Posez votre question à Emma..."
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
            </button>
          </div>
        </div>
      </div>

      {/* Modal d'envoi par email */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 p-4 overflow-y-auto" onClick={() => setShowEmailModal(false)}>
          <div className="min-h-full flex items-center justify-center py-8">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Mail className="text-green-600" size={24} />
                  Envoyer la consultation par email
                </h2>
                <button onClick={() => setShowEmailModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-200">
                  <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-xl">📋</span>
                    Résumé de la consultation
                  </h3>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><strong>Professionnel :</strong> {selectedProfession && professionalProfiles[selectedProfession.id].profile.name}</p>
                    <p><strong>Durée :</strong> {formatTime(elapsedTime)}</p>
                    <p><strong>Messages :</strong> {messages.length} échanges</p>
                    {keyPoints.length > 0 && <p><strong>Points clés :</strong> {keyPoints.length} identifiés</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Adresse email de destination
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@exemple.com"
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Le résumé complet de votre consultation sera envoyé à cette adresse
                  </p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note :</strong> Cette fonctionnalité utilise votre client email par défaut. 
                    Assurez-vous d'avoir un client email configuré sur votre appareil.
                  </p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                    <span className="text-lg">🔒</span>
                    Confidentialité et sécurité
                  </h4>
                  <p className="text-sm text-blue-700">
                    <strong>Pourquoi l'envoi par messagerie personnelle ?</strong><br/>
                    Cette option utilise votre messagerie personnelle pour des fins de <strong>confidentialité maximale</strong>. 
                    Vos informations ne sont pas stockées sur la plateforme et restent sous votre contrôle total. 
                    Cela garantit que vos données sensibles ne transitent que par vos propres canaux de communication sécurisés.
                  </p>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      if (!email.trim()) {
                        alert('Veuillez saisir une adresse email valide');
                        return;
                      }
                      
                      const summary = generateSummary();
                      const subject = `Résumé consultation - ${selectedProfession && professionalProfiles[selectedProfession.id].profile.name}`;
                      const body = encodeURIComponent(summary);
                      
                      // Utiliser mailto: pour ouvrir le client email
                      window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${body}`);
                      
                      playSound('success');
                      setShowEmailModal(false);
                      setEmail('');
                    }}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Mail size={18} />
                    Ouvrir le client email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default EmmaExpertChatbot;