import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, ArrowLeft, Clock, AlertCircle, Lightbulb, Search, X, Settings, TrendingUp, BookOpen } from 'lucide-react';
import { professionalProfiles, getSectors } from './professionnalProfiles.js';

// ========================================
// GESTION LOCALE - COMPTEURS
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
// COMPOSANT PRINCIPAL
// ========================================
const EmmaExpertChatbot = () => {
  const [selectedProfession, setSelectedProfession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(true);
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
  const [introStep, setIntroStep] = useState(0); // 0: logo, 1: avatar, 2: nom, 3: description, 4: marketing, 5: final
  const messagesEndRef = useRef(null);

  const sectors = getSectors();

  useEffect(() => {
    const saved = localStorage.getItem('gemini_api_key');
    if (saved) {
      setApiKey(saved);
      setShowApiInput(false);
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
    
    // Séquence d'animation : chaque élément apparaît avec un délai
    timers.push(setTimeout(() => setIntroStep(1), 800));   // Avatar
    timers.push(setTimeout(() => setIntroStep(2), 1600));  // Nom
    timers.push(setTimeout(() => setIntroStep(3), 2400));  // Description
    timers.push(setTimeout(() => setIntroStep(4), 3200));  // Marketing
    timers.push(setTimeout(() => setIntroStep(5), 4000));  // Final
    
    // Masquer l'intro après 5 secondes
    timers.push(setTimeout(() => setShowIntro(false), 5000));
    
    return () => timers.forEach(clearTimeout);
  }, []);

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      setShowApiInput(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

${personalityPrompt ? `Je vais adapter mes réponses selon vos préférences : ${userPersonality}, niveau ${expertiseLevel}, style ${emmaPersonality}.` : ''}

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
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey
          },
          body: JSON.stringify({
            contents: [...history, userMessage],
            systemInstruction: { parts: [{ text: enhancedPrompt }] },
            generationConfig: { temperature: 0.7, maxOutputTokens: 300 }
          })
        }
      );

      const data = await response.json();
      
      if (data.candidates?.[0]?.content) {
        const responseText = data.candidates[0].content.parts[0].text;
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
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSectors = Object.keys(sectors).filter(sector => 
    sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sectors[sector].some(prof => 
      prof.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ).sort();

  // ========================================
  // ÉCRAN API
  // ========================================
  if (showApiInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl">
              👋
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Emma
            </h1>
            <p className="text-gray-600 text-sm">Exploration Multi-Métiers et Assistance</p>
          </div>
          
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Clé API Gemini"
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-indigo-500"
          />

          <button
            onClick={saveApiKey}
            disabled={!apiKey.trim()}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 font-semibold"
          >
            Commencer
          </button>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Obtenez votre clé gratuite sur <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Google AI Studio</a>
          </p>
        </div>
      </div>
    );
  }

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
  // ANIMATION DE PRÉSENTATION EMMA SÉQUENTIELLE
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
        
        <div className="emma-intro-content">
          <div className="emma-intro-left">
            <MesProsLogo />
          </div>
          
          <div className="emma-intro-right">
            {/* Avatar - Étape 1 */}
            {introStep >= 1 && (
              <div className="emma-intro-avatar animate-fade-in-up">
                <img src="/emma-avatar.png" alt="Emma" className="w-full h-full object-cover" />
              </div>
            )}
            
            {/* Nom - Étape 2 */}
            {introStep >= 2 && (
              <h1 className="emma-intro-name animate-fade-in-up">Emma</h1>
            )}
            
            {/* Description - Étape 3 */}
            {introStep >= 3 && (
              <p className="emma-intro-subtitle animate-fade-in-up">
                Votre assistante virtuelle spécialisée<br />
                en expertise professionnelle
              </p>
            )}
            
            {/* Marketing - Étape 4 */}
            {introStep >= 4 && (
              <div className="emma-intro-marketing animate-fade-in-up">
                <p className="emma-intro-marketing-text">
                  Consultez-la gratuitement dans <strong>50+ métiers</strong><br />
                  de <strong>8 domaines</strong> différents !
                </p>
              </div>
            )}
            
            {/* Final - Étape 5 */}
            {introStep >= 5 && (
              <p className="emma-intro-introduction animate-fade-in-up">
                Propulsé par l'IA
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // SÉLECTION MÉTIER
  // ========================================
  if (!selectedProfession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="bg-white shadow-lg border-b-2 border-indigo-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl">
                  👋
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Emma
                  </h1>
                  <p className="text-sm text-gray-600">Exploration Multi-Métiers et Assistance</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAbout(true)}
                  className="text-indigo-600 hover:underline text-sm"
                >
                  À propos
                </button>
                <button
                  onClick={() => setShowDisclaimer(true)}
                  className="text-gray-600 hover:underline text-sm"
                >
                  Avis légal
                </button>
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

        <div className="max-w-7xl mx-auto px-6 py-8">
          {filteredSectors.map(sectorName => {
            const professions = sectors[sectorName].filter(prof =>
              searchTerm === '' ||
              prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              sectorName.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (professions.length === 0) return null;

            return (
              <div key={sectorName} className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  {sectorName}
                  <span className="text-sm font-normal text-gray-500">({professions.length} {professions.length > 1 ? 'métiers' : 'métier'})</span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {professions.map((profession) => {
                    const count = getConsultationCount(profession.id);
                    return (
                      <div
                        key={profession.id}
                        onClick={() => selectProfession(profession)}
                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer p-4 hover:scale-105 border-2 border-transparent hover:border-indigo-400"
                      >
                        <div className="text-4xl mb-2 text-center">{profession.icon}</div>
                        <h3 className="text-sm font-bold text-gray-800 text-center mb-1">
                          {profession.name}
                        </h3>
                        {count > 0 && (
                          <p className="text-xs text-gray-500 text-center">
                            {count} consultation{count > 1 ? 's' : ''}
                          </p>
                        )}
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowAbout(false)}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">À propos d'Emma</h2>
                <button onClick={() => setShowAbout(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl flex-shrink-0">
                    👋
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Emma</h3>
                    <p className="text-sm text-gray-600">Exploration Multi-Métiers et Assistance</p>
                  </div>
                </div>

                <p className="font-semibold text-lg">Mission universelle</p>
                <p>Explorer, comprendre et relier les savoirs de tous les métiers du monde. Emma agit comme une intelligence de soutien professionnel global.</p>

                <p className="italic text-indigo-600">"De la science au geste, de la théorie à la pratique — je relie les mondes du savoir."</p>

                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Valeurs cardinales :</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Curiosité - Explorer sans a priori</li>
                    <li>Clarté - Communication accessible</li>
                    <li>Collaboration - S'adapter à chaque interlocuteur</li>
                    <li>Compétence - Rigueur professionnelle</li>
                    <li>Cohérence - Fiabilité des informations</li>
                  </ul>
                </div>

                <p className="font-semibold">Profils Professionnels Détaillés</p>
                <p>Couvrant 8 secteurs d'activité : Santé, Juridique, Finance, Technologie, Construction, Affaires, Immobilier et Éducation.</p>

                <p className="text-sm text-gray-600 mt-4">Propulsé par Emma - Intelligence Artificielle au service des professionnels.</p>
              </div>
            </div>
          </div>
        )}

        {/* Modal Disclaimer */}
        {showDisclaimer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowDisclaimer(false)}>
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
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-xl border-r-2 border-indigo-200 overflow-y-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
              👋
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
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-indigo-600 mb-3 w-full"
          >
            <Settings size={16} /> Personnaliser les réponses
            {showSettings ? ' ▼' : ' ▶'}
          </button>
          
          {showSettings && (
            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Votre style :</label>
                <select
                  value={userPersonality}
                  onChange={(e) => setUserPersonality(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                >
                  <option value="standard">Standard</option>
                  <option value="analytique">Analytique</option>
                  <option value="créatif">Créatif</option>
                  <option value="pragmatique">Pragmatique</option>
                  <option value="empathique">Empathique</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Niveau :</label>
                <select
                  value={expertiseLevel}
                  onChange={(e) => setExpertiseLevel(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                >
                  <option value="débutant">Débutant</option>
                  <option value="intermediaire">Intermédiaire</option>
                  <option value="avancé">Avancé</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Ton Emma :</label>
                <select
                  value={emmaPersonality}
                  onChange={(e) => setEmmaPersonality(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                >
                  <option value="professionnelle">Professionnelle</option>
                  <option value="amicale">Amicale</option>
                  <option value="pédagogue">Pédagogue</option>
                  <option value="directe">Directe</option>
                </select>
              </div>

              <div className="bg-blue-50 p-2 rounded text-xs text-blue-800">
                <p className="font-semibold">Actif :</p>
                <p>• {userPersonality} / {expertiseLevel} / {emmaPersonality}</p>
              </div>
            </div>
          )}
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
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                  👋
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    Consultation avec Emma
                  </h2>
                  <p className="text-sm text-gray-600">{profile.profile.name}</p>
                </div>
              </div>
            </div>
            
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

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white mr-2 flex-shrink-0">
                    👋
                  </div>
                )}
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
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white mr-2">
                  👋
                </div>
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
    </div>
  );
};

export default EmmaExpertChatbot;

// ========================================
// STYLES CSS POUR L'ANIMATION D'INTRODUCTION
// ========================================
const styles = `
/* Animation fade-in-up pour l'intro séquentielle */
.animate-fade-in-up {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 0.8s ease-out forwards;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Animation de présentation d'Emma avec arrière-plan blanc */
.emma-intro {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: emmaIntroFadeOut 0.8s ease-in-out 4s forwards;
  overflow: hidden;
}

/* Conteneur principal pour le logo et l'image */
.emma-intro-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  gap: 60px;
  padding: 0 40px;
}

/* Section gauche - Logo Mes Pros */
.emma-intro-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: logoSlideIn 1.2s ease-out 0.3s both;
}

/* Section droite - Image et texte Emma */
.emma-intro-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* Styles pour le logo Mes Pros */
.mes-pros-logo {
  text-align: center;
  padding: 40px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 30px;
  backdrop-filter: blur(20px);
  border: 2px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  animation: logoGlow 3s ease-in-out infinite;
}

.logo-text-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.logo-mes-pros {
  font-size: 4rem;
  font-weight: bold;
  color: #1e3a8a;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 0;
  animation: logoTextSlide 0.8s ease-out 0.8s both;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.logo-presents {
  font-size: 1.5rem;
  color: #6b7280;
  font-weight: 400;
  margin: 0;
  animation: logoTextSlide 0.8s ease-out 1.0s both;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  opacity: 0.9;
}

.logo-emma {
  font-size: 4rem;
  font-weight: bold;
  color: #7c3aed;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 0;
  animation: logoTextSlide 0.8s ease-out 1.2s both;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Animations pour le logo */
@keyframes logoSlideIn {
  0% {
    opacity: 0;
    transform: translateX(-100px) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes logoTextSlide {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes logoGlow {
  0%, 100% {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.05);
  }
  50% {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 0 30px rgba(0, 0, 0, 0.1);
  }
}

/* Styles pour le message marketing dans l'intro */
.emma-intro-marketing {
  margin: 15px 0;
  animation: marketingSlide 0.8s ease-out 1.8s both;
}

.emma-intro-marketing-text {
  font-size: 1.1rem;
  color: #10b981;
  font-weight: 600;
  text-align: center;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(34, 197, 94, 0.1));
  padding: 12px 20px;
  border-radius: 15px;
  border: 2px solid rgba(16, 185, 129, 0.3);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.2);
  max-width: 400px;
  margin: 0 auto;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.emma-intro-marketing-text strong {
  color: #059669;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

@keyframes marketingSlide {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes emmaIntroFadeOut {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.1);
    visibility: hidden;
  }
}

.emma-intro-avatar {
  width: 400px;
  height: 400px;
  border-radius: 20px;
  overflow: hidden;
  animation: emmaAvatarZoom 3s ease-in-out;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
  border: 6px solid rgba(0, 0, 0, 0.1);
  z-index: 1;
  margin-bottom: 20px;
}

.emma-intro-avatar::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.3));
  z-index: 1;
}

@keyframes emmaAvatarZoom {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  20% {
    transform: scale(1);
    opacity: 1;
  }
  80% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.05);
    opacity: 0.9;
  }
}

.emma-intro-name {
  font-size: 3rem;
  font-weight: bold;
  color: #1f2937;
  animation: emmaNameSlide 0.8s ease-out 1.4s both;
  text-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  z-index: 2;
  text-align: center;
  margin: 0 0 10px 0;
}

@keyframes emmaNameSlide {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.emma-intro-subtitle {
  font-size: 1.2rem;
  color: #6b7280;
  animation: emmaSubtitleSlide 0.8s ease-out 1.6s both;
  text-align: center;
  max-width: 400px;
  line-height: 1.4;
  z-index: 2;
  background: rgba(0, 0, 0, 0.05);
  padding: 10px 20px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  margin: 0 0 15px 0;
}

@keyframes emmaSubtitleSlide {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.emma-intro-introduction {
  font-size: 1.1rem;
  color: #4f46e5;
  font-weight: 600;
  animation: emmaIntroductionSlide 0.8s ease-out 2.0s both;
  text-align: center;
  z-index: 2;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(124, 58, 237, 0.1));
  padding: 12px 24px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  max-width: 400px;
  border: 2px solid rgba(79, 70, 229, 0.2);
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.1);
  margin: 0;
}

@keyframes emmaIntroductionSlide {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.emma-intro-sparkles {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #4f46e5;
  border-radius: 50%;
  animation: sparkleFloat 2s ease-in-out infinite;
  box-shadow: 0 0 10px rgba(79, 70, 229, 0.6);
}

.sparkle:nth-child(1) {
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.sparkle:nth-child(2) {
  top: 30%;
  right: 25%;
  animation-delay: 0.5s;
}

.sparkle:nth-child(3) {
  bottom: 30%;
  left: 30%;
  animation-delay: 1s;
}

.sparkle:nth-child(4) {
  bottom: 20%;
  right: 20%;
  animation-delay: 1.5s;
}

.sparkle:nth-child(5) {
  top: 50%;
  left: 10%;
  animation-delay: 0.8s;
}

.sparkle:nth-child(6) {
  top: 60%;
  right: 15%;
  animation-delay: 1.2s;
}

@keyframes sparkleFloat {
  0%, 100% {
    opacity: 0;
    transform: translateY(0) scale(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-20px) scale(1);
  }
}

/* Styles responsifs pour l'animation d'intro */
@media (max-width: 768px) {
  .emma-intro-content {
    flex-direction: column;
    gap: 30px;
    padding: 0 20px;
  }
  
  .emma-intro-left {
    order: 2;
  }
  
  .emma-intro-right {
    order: 1;
  }
  
  .mes-pros-logo {
    padding: 20px;
  }
  
  .logo-mes-pros {
    font-size: 2.5rem;
  }
  
  .logo-emma {
    font-size: 2.5rem;
  }
  
  .logo-presents {
    font-size: 1.2rem;
  }
  
  .emma-intro-avatar {
    width: 300px;
    height: 300px;
  }
  
  .emma-intro-name {
    font-size: 2.5rem;
  }
  
  .emma-intro-subtitle {
    font-size: 1rem;
    max-width: 300px;
  }
  
  .emma-intro-introduction {
    font-size: 1rem;
    max-width: 300px;
  }
  
  .emma-intro-marketing-text {
    font-size: 1rem;
    max-width: 300px;
    padding: 10px 16px;
  }
}

@media (max-width: 480px) {
  .emma-intro-content {
    gap: 20px;
    padding: 0 15px;
  }
  
  .mes-pros-logo {
    padding: 15px;
  }
  
  .logo-mes-pros {
    font-size: 2rem;
  }
  
  .logo-emma {
    font-size: 2rem;
  }
  
  .logo-presents {
    font-size: 1rem;
  }
  
  .emma-intro-avatar {
    width: 250px;
    height: 250px;
  }
  
  .emma-intro-name {
    font-size: 2rem;
  }
  
  .emma-intro-subtitle {
    font-size: 0.9rem;
    max-width: 250px;
  }
  
  .emma-intro-introduction {
    font-size: 0.9rem;
    max-width: 250px;
  }
  
  .emma-intro-marketing-text {
    font-size: 0.9rem;
    max-width: 250px;
    padding: 8px 12px;
  }
}
`;

// Injecter les styles dans le document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}