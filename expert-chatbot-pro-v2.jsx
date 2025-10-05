import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, ArrowLeft, Clock, AlertCircle, Lightbulb, Search, X, Settings, TrendingUp, BookOpen, Mail } from 'lucide-react';
import { professionalProfiles, getSectors } from './professionnalProfiles.js';

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
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [userPersonality, setUserPersonality] = useState('standard');
  const [expertiseLevel, setExpertiseLevel] = useState('intermediaire');
  const [emmaPersonality, setEmmaPersonality] = useState('professionnelle');
  const [showAbout, setShowAbout] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [keyPoints, setKeyPoints] = useState([]);
  const [showIntro, setShowIntro] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const messagesEndRef = useRef(null);

  const sectors = getSectors();

  // API key est maintenant gérée via les variables d'environnement Vercel

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

  // Gérer la disparition de l'intro
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  // Fonction saveApiKey supprimée - API key gérée via Vercel

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
      if (message.role === 'user') {
        summary += `👤 Vous : ${message.parts[0].text}\n\n`;
      } else if (message.role === 'model') {
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
    summary += `Propulsé par JSL AI - Emma, votre assistante virtuelle spécialisée\n`;
    summary += `www.mespros.ca`;
    
    return summary;
  };

  const formatMessageText = (text) => {
    // Vérifier que le texte existe
    if (!text || typeof text !== 'string') {
      return '';
    }
    
    // Améliorer le formatage du texte
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Gras
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italique
      .replace(/\n\n/g, '<br><br>') // Paragraphes
      .replace(/\n/g, '<br>') // Retours à la ligne
      .replace(/^(\d+\.\s)/gm, '<br>$1') // Listes numérotées
      .replace(/^[-•]\s/gm, '<br>• ') // Listes à puces
      .replace(/^(\d+\.\s.*)$/gm, '<div class="list-item">$1</div>') // Items de liste
      .replace(/^•\s(.*)$/gm, '<div class="list-item">• $1</div>'); // Items à puces
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

    // Vérifier la clé API
    if (!apiKey || apiKey.trim() === '') {
      setMessages(prev => [...prev, {
        role: 'model',
        parts: [{ text: "Erreur: Clé API Gemini manquante ou invalide. Veuillez vérifier la configuration de votre environnement." }]
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
      const profile = professionalProfiles[selectedProfession.id];
      const personalityPrompt = getPersonalityPrompt();
      
      const enhancedPrompt = `${profile.systemPrompt}

PERSONNALISATION UTILISATEUR:
${personalityPrompt}

RAPPEL CRITIQUE: Réponds en MAX 150 mots. Structure obligatoire: 1) Intro brève 2) Infos principales 3) Appel à consulter professionnel réel.`;

      const history = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : msg.role,
        parts: msg.parts
      }));

      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey
          },
          body: JSON.stringify({
            contents: [...history, userMessage],
            systemInstruction: { parts: [{ text: enhancedPrompt }] },
            generationConfig: { 
              temperature: 0.7, 
              maxOutputTokens: 500,
              topP: 0.8,
              topK: 40
            }
          })
        }
      );

      const data = await response.json();
      console.log('Gemini Response:', data); // Debug log
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${data.error?.message || 'Unknown error'}`);
      }
      
      // Vérification robuste de la structure de la réponse
      if (data.candidates && 
          data.candidates.length > 0 && 
          data.candidates[0] && 
          data.candidates[0].content && 
          data.candidates[0].content.parts && 
          data.candidates[0].content.parts.length > 0 && 
          data.candidates[0].content.parts[0] && 
          data.candidates[0].content.parts[0].text) {
        
        const responseText = data.candidates[0].content.parts[0].text;
        console.log('Response text:', responseText); // Debug log
        
        setMessages(prev => [...prev, {
          role: 'model',
          parts: [{ text: responseText }]
        }]);
        
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
        console.error('Invalid response structure:', data);
        console.error('Candidates:', data.candidates);
        console.error('First candidate:', data.candidates?.[0]);
        console.error('Content:', data.candidates?.[0]?.content);
        console.error('Parts:', data.candidates?.[0]?.content?.parts);
        
        setMessages(prev => [...prev, {
          role: 'model',
          parts: [{ text: "Désolée, je n'ai pas pu générer de réponse valide. La structure de la réponse API est inattendue. Veuillez réessayer." }]
        }]);
      }
    } catch (error) {
      console.error('Error details:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      let errorMessage = "Désolée, une erreur s'est produite. ";
      
      if (error.message.includes('API Error')) {
        errorMessage += "Problème avec l'API Gemini. ";
      } else if (error.message.includes('fetch')) {
        errorMessage += "Problème de connexion réseau. ";
      } else if (error.message.includes('JSON')) {
        errorMessage += "Erreur de format de données. ";
      } else {
        errorMessage += "Erreur inattendue. ";
      }
      
      errorMessage += "Veuillez vérifier votre connexion et réessayer.";
      
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
  // ANIMATION DE PRÉSENTATION EMMA
  // ========================================
  if (showIntro) {
    return (
      <div className="emma-intro">
        <div className="emma-intro-sparkles">
          <div className="sparkle"></div>
          <div className="sparkle"></div>
          <div className="sparkle"></div>
          <div className="sparkle"></div>
          <div className="sparkle"></div>
          <div className="sparkle"></div>
        </div>
        
        <div className="emma-intro-avatar">
          <img src="/emma-avatar.png" alt="Emma" className="w-full h-full object-cover" />
        </div>
        
        <h1 className="emma-intro-name">Emma</h1>
        
        <p className="emma-intro-subtitle">
          Votre assistante virtuelle spécialisée<br />
          en expertise professionnelle
        </p>
        
        <p className="emma-intro-introduction">
          Mes Pros Propulsé par l'IA vous présente Emma !
        </p>
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
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAbout(true)}
                  className="text-indigo-600 hover:underline text-sm flex items-center gap-1"
                >
                  <span>ℹ️</span> À propos
                </button>
                <button
                  onClick={() => setShowDisclaimer(true)}
                  className="text-gray-600 hover:underline text-sm flex items-center gap-1"
                >
                  <span>⚖️</span> Avis légal
                </button>
              </div>
            </div>

            {/* Options de personnalisation épurées */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Settings size={16} className="text-indigo-600" />
                  Personnalisez votre expérience
                </h3>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  {showSettings ? 'Masquer ▼' : 'Afficher ▶'}
                </button>
              </div>
              
              {showSettings && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Style utilisateur */}
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-2 block flex items-center gap-1">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                      Votre style
                    </label>
                    <select
                      value={userPersonality}
                      onChange={(e) => setUserPersonality(e.target.value)}
                      className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 bg-white"
                    >
                      <option value="standard">⚖️ Standard</option>
                      <option value="analytique">📊 Analytique</option>
                      <option value="créatif">🎨 Créatif</option>
                      <option value="pragmatique">🎯 Pragmatique</option>
                      <option value="empathique">💝 Empathique</option>
                    </select>
                  </div>

                  {/* Niveau d'expertise */}
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-2 block flex items-center gap-1">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Votre niveau
                    </label>
                    <select
                      value={expertiseLevel}
                      onChange={(e) => setExpertiseLevel(e.target.value)}
                      className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 bg-white"
                    >
                      <option value="débutant">🌱 Débutant</option>
                      <option value="intermediaire">📚 Intermédiaire</option>
                      <option value="avancé">🎓 Avancé</option>
                      <option value="expert">🏆 Expert</option>
                    </select>
                  </div>

                  {/* Ton d'Emma */}
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-2 block flex items-center gap-1">
                      <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                      Ton d'Emma
                    </label>
                    <select
                      value={emmaPersonality}
                      onChange={(e) => setEmmaPersonality(e.target.value)}
                      className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-pink-500 bg-white"
                    >
                      <option value="professionnelle">👔 Professionnelle</option>
                      <option value="amicale">😊 Amicale</option>
                      <option value="pédagogue">👩‍🏫 Pédagogue</option>
                      <option value="directe">⚡ Directe</option>
                    </select>
                  </div>
                </div>
              )}
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
                    <strong>Propulsé par JSL AI</strong> - Intelligence Artificielle au service des professionnels
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
                    <li>JSL AI décline toute responsabilité pour les décisions prises sur la base des informations fournies</li>
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

        <div className="p-6 border-b border-gray-200">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Settings size={16} className="text-indigo-600" />
                Personnalisation des réponses
                <span className="text-xs text-indigo-500 ml-2">← Ajustez ici</span>
              </h3>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {showSettings ? 'Masquer ▼' : 'Afficher ▶'}
              </button>
            </div>
            
            {showSettings && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Style utilisateur */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-2 block flex items-center gap-1">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                    Votre style
                  </label>
                  <select
                    value={userPersonality}
                    onChange={(e) => setUserPersonality(e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 bg-white"
                  >
                    <option value="standard">⚖️ Standard</option>
                    <option value="analytique">📊 Analytique</option>
                    <option value="créatif">🎨 Créatif</option>
                    <option value="pragmatique">🎯 Pragmatique</option>
                    <option value="empathique">💝 Empathique</option>
                  </select>
                </div>

                {/* Niveau d'expertise */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-2 block flex items-center gap-1">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Votre niveau
                  </label>
                  <select
                    value={expertiseLevel}
                    onChange={(e) => setExpertiseLevel(e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 bg-white"
                  >
                    <option value="débutant">🌱 Débutant</option>
                    <option value="intermediaire">📚 Intermédiaire</option>
                    <option value="avancé">🎓 Avancé</option>
                    <option value="expert">🏆 Expert</option>
                  </select>
                </div>

                {/* Ton d'Emma */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-2 block flex items-center gap-1">
                    <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                    Ton d'Emma
                  </label>
                  <select
                    value={emmaPersonality}
                    onChange={(e) => setEmmaPersonality(e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-pink-500 bg-white"
                  >
                    <option value="professionnelle">👔 Professionnelle</option>
                    <option value="amicale">😊 Amicale</option>
                    <option value="pédagogue">👩‍🏫 Pédagogue</option>
                    <option value="directe">⚡ Directe</option>
                  </select>
                </div>
              </div>
            )}

            {/* Résumé actuel compact */}
            <div className="mt-3 pt-3 border-t border-indigo-200">
              <div className="flex items-center justify-between text-xs text-gray-600">
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
          <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <BookOpen size={14} /> Sources fiables
          </h4>
          <div className="space-y-1">
            {profile.profile.sources.map((source, idx) => (
              <div key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                <span className="text-indigo-500">•</span>
                <span>{source}</span>
              </div>
            ))}
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
                onClick={() => setInputMessage(example)}
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
                onClick={() => setShowEmailModal(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                disabled={messages.length === 0}
              >
                <Mail size={18} />
                Envoyer par email
              </button>
              <button
                onClick={() => {
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
  );
};

export default EmmaExpertChatbot;