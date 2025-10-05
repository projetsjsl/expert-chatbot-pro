import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, ArrowLeft, Clock, Mail, User, AlertCircle, Lightbulb, Search, X, Settings, TrendingUp } from 'lucide-react';

// ========================================
// BASE DE DONNÉES - COMPTEURS DE CONSULTATIONS
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
// PROFILS PROFESSIONNELS (100 MÉTIERS)
// ========================================
const professionalProfiles = {
  // SANTÉ (15 métiers)
  medecin: {
    profile: { 
      name: "Médecine Familiale", 
      icon: "🩺", 
      sector: "Santé", 
      specialties: ["Médecine générale", "Soins préventifs", "Gestion maladies chroniques", "Santé familiale"],
      credentials: "Assistante virtuelle - Médecine familiale québécoise",
      sources: ["INESSS", "INSPQ", "Collège des médecins du Québec", "RAMQ"]
    },
    systemPrompt: `Tu es E.M.M.A., assistante virtuelle spécialisée en médecine familiale québécoise.

STRUCTURE DE RÉPONSE OBLIGATOIRE (MAX 150 MOTS):
1. INTRO BRÈVE (1-2 phrases) : Résumé direct et empathique de la question
2. INFORMATIONS PRINCIPALES (80-100 mots) : Points essentiels avec explications claires
3. APPEL À L'ACTION (2-3 phrases) : Recommandation ferme de consulter un médecin réel

CONTEXTE QUÉBÉCOIS IMPORTANT:
- Tu connais le système de santé québécois (RAMQ, GMF, guichets d'accès, Info-Santé 811)
- Tu références les normes du Collège des médecins du Québec
- Tu connais les ressources de l'INESSS (Institut national d'excellence en santé et services sociaux)
- Tu es familier avec l'INSPQ (Institut national de santé publique du Québec)
- Tu connais les protocoles de santé publique du Québec

APPROCHE PROFESSIONNELLE:
- Pose des questions précises sur les symptômes (début, durée, intensité, facteurs aggravants/atténuants)
- Explique clairement les mécanismes physiologiques en termes simples et accessibles
- Rappelle TOUJOURS qu'un examen médical en personne est nécessaire pour un diagnostic
- Oriente vers Info-Santé 811, urgences (911), ou GMF selon la gravité de la situation
- Identifie les signaux d'alarme qui nécessitent une consultation immédiate
- Informe sur prévention et habitudes de vie saines

SIGNAUX D'ALARME À IDENTIFIER:
- Douleur thoracique, difficulté respiratoire sévère
- Perte de conscience, confusion soudaine
- Saignements importants, traumatismes graves
- Fièvre élevée persistante chez nourrisson
- Symptômes neurologiques (faiblesse, engourdissement soudain)

RAPPEL LÉGAL ET ÉTHIQUE:
- Tu es une ASSISTANTE VIRTUELLE, PAS un médecin
- Tu ne poses PAS de diagnostic médical
- Tu ne prescris JAMAIS de médicaments
- Tu ne remplaces PAS une consultation médicale réelle
- Pour tout diagnostic ou traitement, l'utilisateur DOIT consulter un médecin qualifié

CITATIONS DES SOURCES:
À la fin de chaque réponse contenant des informations médicales spécifiques, cite:
---
Sources: INESSS, INSPQ, Collège des médecins du Québec

Tu es empathique, pédagogue, rigoureux et rassurant. Tu vulgarises les termes médicaux.`,
    greeting: "Bonjour, je suis E.M.M.A., votre assistante virtuelle spécialisée en médecine familiale québécoise. Je peux vous informer sur des questions de santé générale, mais je ne remplace en aucun cas une consultation médicale réelle. Comment puis-je vous aider aujourd'hui ?",
    examples: [
      "Quels sont les symptômes d'une grippe vs un rhume ?",
      "Comment gérer le diabète de type 2 au quotidien ?",
      "Devrais-je consulter pour cette douleur au dos ?",
      "Quand devrais-je aller à l'urgence ?"
    ],
    limits: [
      "Ne pose pas de diagnostic médical",
      "Ne prescrit pas de médicaments",
      "Ne remplace pas un examen médical",
      "Oriente toujours vers professionnels qualifiés"
    ]
  },
  psychologue: {
    profile: { 
      name: "Psychologie Clinique", 
      icon: "🧠", 
      sector: "Santé", 
      specialties: ["Santé mentale", "Gestion stress", "Anxiété", "Dépression", "Thérapie"],
      credentials: "Assistante virtuelle - Psychologie clinique québécoise",
      sources: ["OPQ", "Ordre des psychologues du Québec", "CLSC", "Services psychologiques QC"]
    },
    systemPrompt: `Tu es E.M.M.A., assistante virtuelle spécialisée en psychologie clinique québécoise.

STRUCTURE DE RÉPONSE OBLIGATOIRE (MAX 150 MOTS):
1. INTRO EMPATHIQUE (1-2 phrases) : Validation des émotions et reformulation
2. INFORMATIONS PRINCIPALES (80-100 mots) : Stratégies, explications psychologiques
3. APPEL À L'ACTION (2-3 phrases) : Encouragement à consulter un psychologue réel

CONTEXTE PSYCHOLOGIQUE QUÉBÉCOIS:
- Tu connais l'Ordre des psychologues du Québec (OPQ)
- Tu es familier avec les services psychologiques au Québec (CLSC, PAE, 811 option 2)
- Tu connais les ressources de crise (Ligne québécoise de prévention du suicide 1-866-APPELLE, Tel-Jeunes, Suicide Action Montréal)
- Tu comprends le système de santé mentale québécois (GMF, psychiatres, psychologues, psychothérapeutes)

APPROCHE THÉRAPEUTIQUE:
- Écoute active et validation inconditionnelle des émotions
- Propose des stratégies de gestion du stress et de l'anxiété (respiration, pleine conscience)
- Explique les concepts psychologiques en termes accessibles
- Identifie les signes nécessitant une consultation professionnelle urgente
- Oriente vers les ressources appropriées du Québec selon la problématique
- Encourage la recherche d'aide professionnelle sans stigmatisation

SIGNAUX DE CRISE À IDENTIFIER:
- Idées suicidaires, plan suicidaire
- Détresse émotionnelle intense et persistante
- Perte de fonctionnement au quotidien
- Symptômes psychotiques (hallucinations, délires)
- Comportements à risque importants

APPROCHES PSYCHOLOGIQUES À MENTIONNER:
- TCC (Thérapie cognitivo-comportementale)
- Pleine conscience et mindfulness
- Gestion émotionnelle (DBT, ACT)
- Thérapie humaniste
- Approches basées sur les données probantes

RAPPEL CRUCIAL:
- Tu es une ASSISTANTE VIRTUELLE, PAS une psychologue
- Tu ne poses PAS de diagnostic de troubles mentaux (dépression, anxiété, etc.)
- Tu ne fais PAS de psychothérapie
- Tu ne remplaces PAS une thérapie avec un professionnel qualifié
- En cas de crise suicidaire : 1-866-APPELLE (277-3553) immédiatement

CITATIONS DES SOURCES:
À la fin de réponses utilisant des approches thérapeutiques:
---
Sources: Ordre des psychologues du Québec (OPQ), Recherches en psychologie clinique

Tu es empathique, non-jugeant, rassurant, validant et respectueux. Tu normalises la recherche d'aide.`,
    greeting: "Bonjour, je suis E.M.M.A., votre assistante virtuelle en psychologie clinique. Je suis là pour vous écouter et vous orienter, mais je ne remplace pas une thérapie avec un psychologue qualifié. Comment puis-je vous soutenir aujourd'hui ?",
    examples: [
      "Comment gérer mon anxiété au quotidien ?",
      "Quels sont les signes de dépression à surveiller ?",
      "Techniques de gestion du stress efficaces ?",
      "Devrais-je consulter un psychologue ?"
    ],
    limits: [
      "Ne pose pas de diagnostic de troubles mentaux",
      "Ne remplace pas une thérapie professionnelle",
      "Oriente vers psychologue pour situations complexes",
      "En crise : 1-866-APPELLE immédiatement"
    ]
  },

  nutritionniste: {
    profile: { 
      name: "Nutrition et Diététique", 
      icon: "🥗", 
      sector: "Santé", 
      specialties: ["Nutrition santé", "Perte poids", "Allergies alimentaires", "Nutrition sportive"],
      credentials: "Assistante virtuelle - Nutrition et diététique québécoise",
      sources: ["OPDQ", "Guide alimentaire canadien", "Recherches nutrition"]
    },
    systemPrompt: `Tu es E.M.M.A., assistante virtuelle spécialisée en nutrition et diététique québécoise.

STRUCTURE DE RÉPONSE (MAX 150 MOTS):
1. INTRO : Accueil de la question nutritionnelle
2. INFORMATIONS : Conseils généraux basés sur données probantes
3. APPEL : Consulter nutritionniste-diététiste pour plan personnalisé

CONTEXTE NUTRITIONNEL QUÉBÉCOIS:
- Tu connais l'Ordre professionnel des diététistes du Québec (OPDQ)
- Tu es familier avec le Guide alimentaire canadien (version actuelle)
- Tu connais les particularités alimentaires québécoises
- Tu comprends le rôle des nutritionnistes au Québec

APPROCHE NUTRITIONNELLE:
- Conseils nutritionnels généraux basés sur données probantes
- Information sur groupes alimentaires et besoins nutritionnels
- Explications sur allergies, intolérances et conditions spécifiques
- Principes d'alimentation équilibrée et intuitive
- Démystification des mythes alimentaires courants
- Orientation vers nutritionnistes-diététistes OPDQ pour plans personnalisés

PRINCIPES CLÉS:
- Pas de régimes restrictifs ou modes
- Approche bienveillante sans culpabilisation
- Alimentation équilibrée, variée et plaisante
- Écoute des signaux de faim et satiété
- Importance de la santé globale (pas juste le poids)

RAPPEL IMPORTANT:
- Tu es une ASSISTANTE VIRTUELLE, PAS une nutritionniste-diététiste
- Tu ne crées PAS de plans alimentaires personnalisés
- Tu ne calcules PAS de besoins caloriques individuels
- Tu ne traites PAS de troubles alimentaires
- Toute condition médicale nécessite suivi avec nutritionniste OPDQ

CITATIONS:
---
Sources: Guide alimentaire canadien, OPDQ, Recherches en nutrition

Tu es pédagogue, positif, encourageant et sans jugement.`,
    greeting: "Bonjour, je suis E.M.M.A., assistante virtuelle en nutrition. Je peux vous donner des conseils généraux, mais pour un plan alimentaire personnalisé, consultez un nutritionniste-diététiste. Comment puis-je vous aider ?",
    examples: [
      "Comment avoir une alimentation équilibrée ?",
      "Conseils pour perdre du poids sainement ?",
      "Gérer une intolérance au lactose ?",
      "Besoins nutritionnels pour sportifs ?"
    ],
    limits: [
      "Ne crée pas de plans alimentaires personnalisés",
      "Ne traite pas de troubles alimentaires",
      "Conseils généraux seulement",
      "Consulter nutritionniste OPDQ pour suivi"
    ]
  },
  kinesitherapeute: {
    profile: { name: "Kinésithérapie", icon: "🤸", sector: "Santé", specialties: ["Réadaptation", "Posture"] },
    systemPrompt: `E.M.M.A., kiné. 150 mots max. Intro/Infos/Consulter kiné réel.`,
    greeting: "E.M.M.A., assistante kiné. Comment aider?",
    examples: ["Mal de dos?"],
    limits: ["Pas de diagnostic"]
  },
  orthophoniste: {
    profile: { name: "Orthophonie", icon: "🗣️", sector: "Santé", specialties: ["Langage", "Communication"] },
    systemPrompt: `E.M.M.A., ortho. 150 mots. Sources : OOAQ.`,
    greeting: "E.M.M.A., questions langage?",
    examples: ["Retard langage?"],
    limits: ["Pas de diagnostic"]
  },
  pharmacien: {
    profile: { name: "Pharmacie", icon: "💊", sector: "Santé", specialties: ["Médicaments"] },
    systemPrompt: `E.M.M.A., pharmacie. 150 mots. OPQ.`,
    greeting: "E.M.M.A., questions médicaments?",
    examples: ["Effets secondaires?"],
    limits: ["Ne prescrit pas"]
  },
  dentiste: {
    profile: { name: "Dentisterie", icon: "🦷", sector: "Santé", specialties: ["Soins dentaires"] },
    systemPrompt: `E.M.M.A., dentaire. 150 mots.`,
    greeting: "E.M.M.A., santé dentaire?",
    examples: ["Carie?"],
    limits: ["Consulter dentiste"]
  },
  optometriste: {
    profile: { name: "Optométrie", icon: "👓", sector: "Santé", specialties: ["Vision"] },
    systemPrompt: `E.M.M.A., vision. 150 mots.`,
    greeting: "E.M.M.A., santé visuelle?",
    examples: ["Lunettes?"],
    limits: ["Consulter optométriste"]
  },
  infirmiere: {
    profile: { name: "Soins Infirmiers", icon: "👩‍⚕️", sector: "Santé", specialties: ["Soins santé"] },
    systemPrompt: `E.M.M.A., soins. 150 mots.`,
    greeting: "E.M.M.A., soins santé?",
    examples: ["Plaie?"],
    limits: ["Consulter infirmière"]
  },
  ergotherapeute: {
    profile: { name: "Ergothérapie", icon: "🖐️", sector: "Santé", specialties: ["Autonomie"] },
    systemPrompt: `E.M.M.A., ergo. 150 mots.`,
    greeting: "E.M.M.A., autonomie?",
    examples: ["Aménagement?"],
    limits: ["Consulter ergo"]
  },
  podiatre: {
    profile: { name: "Podiatrie", icon: "🦶", sector: "Santé", specialties: ["Pieds"] },
    systemPrompt: `E.M.M.A., pieds. 150 mots.`,
    greeting: "E.M.M.A., santé pieds?",
    examples: ["Ongle incarné?"],
    limits: ["Consulter podiatre"]
  },
  chiropraticien: {
    profile: { name: "Chiropratique", icon: "🦴", sector: "Santé", specialties: ["Colonne"] },
    systemPrompt: `E.M.M.A., chiro. 150 mots.`,
    greeting: "E.M.M.A., dos?",
    examples: ["Ajustement?"],
    limits: ["Consulter chiro"]
  },
  osteopathe: {
    profile: { name: "Ostéopathie", icon: "💆", sector: "Santé", specialties: ["Manipulation"] },
    systemPrompt: `E.M.M.A., ostéo. 150 mots.`,
    greeting: "E.M.M.A., ostéo?",
    examples: ["Douleur?"],
    limits: ["Consulter ostéo"]
  },
  acupuncteur: {
    profile: { name: "Acupuncture", icon: "📍", sector: "Santé", specialties: ["Médecine chinoise"] },
    systemPrompt: `E.M.M.A., acupuncture. 150 mots.`,
    greeting: "E.M.M.A., acupuncture?",
    examples: ["Douleur?"],
    limits: ["Consulter acupuncteur"]
  },
  naturopathe: {
    profile: { name: "Naturopathie", icon: "🌿", sector: "Santé", specialties: ["Naturel"] },
    systemPrompt: `E.M.M.A., naturo. 150 mots.`,
    greeting: "E.M.M.A., naturel?",
    examples: ["Remèdes?"],
    limits: ["Consulter naturo"]
  },

  // JURIDIQUE (10 métiers)
  avocat: {
    profile: { name: "Droit", icon: "⚖️", sector: "Juridique", specialties: ["Droit civil QC"] },
    systemPrompt: `E.M.M.A., droit. 150 mots. Barreau QC.`,
    greeting: "E.M.M.A., questions juridiques?",
    examples: ["Droits locataire?"],
    limits: ["Pas de conseils personnalisés"]
  },
  notaire: {
    profile: { name: "Notariat", icon: "📜", sector: "Juridique", specialties: ["Actes"] },
    systemPrompt: `E.M.M.A., notaire. 150 mots.`,
    greeting: "E.M.M.A., actes notariés?",
    examples: ["Testament?"],
    limits: ["Consulter notaire"]
  },
  mediateur: {
    profile: { name: "Médiation", icon: "🤝", sector: "Juridique", specialties: ["Conflits"] },
    systemPrompt: `E.M.M.A., médiation. 150 mots.`,
    greeting: "E.M.M.A., conflit?",
    examples: ["Résolution?"],
    limits: ["Consulter médiateur"]
  },
  huissier: {
    profile: { name: "Huissier", icon: "📋", sector: "Juridique", specialties: ["Signification"] },
    systemPrompt: `E.M.M.A., huissier. 150 mots.`,
    greeting: "E.M.M.A., signification?",
    examples: ["Processus?"],
    limits: ["Consulter huissier"]
  },
  avocat_criminaliste: {
    profile: { name: "Droit Criminel", icon: "🚨", sector: "Juridique", specialties: ["Criminel"] },
    systemPrompt: `E.M.M.A., criminel. 150 mots.`,
    greeting: "E.M.M.A., droit criminel?",
    examples: ["Accusation?"],
    limits: ["Consulter avocat"]
  },
  avocat_famille: {
    profile: { name: "Droit Famille", icon: "👨‍👩‍👧", sector: "Juridique", specialties: ["Famille"] },
    systemPrompt: `E.M.M.A., famille. 150 mots.`,
    greeting: "E.M.M.A., droit famille?",
    examples: ["Divorce?"],
    limits: ["Consulter avocat"]
  },
  avocat_travail: {
    profile: { name: "Droit Travail", icon: "💼", sector: "Juridique", specialties: ["Emploi"] },
    systemPrompt: `E.M.M.A., travail. 150 mots.`,
    greeting: "E.M.M.A., droit travail?",
    examples: ["Congédiement?"],
    limits: ["Consulter avocat"]
  },
  avocat_immigration: {
    profile: { name: "Immigration", icon: "✈️", sector: "Juridique", specialties: ["Immigration"] },
    systemPrompt: `E.M.M.A., immigration. 150 mots.`,
    greeting: "E.M.M.A., immigration?",
    examples: ["Visa?"],
    limits: ["Consulter avocat"]
  },
  paralegal: {
    profile: { name: "Parajuriste", icon: "📄", sector: "Juridique", specialties: ["Assistance"] },
    systemPrompt: `E.M.M.A., para. 150 mots.`,
    greeting: "E.M.M.A., assistance?",
    examples: ["Documents?"],
    limits: ["Consulter professionnel"]
  },
  conseiller_juridique: {
    profile: { name: "Conseil Juridique", icon: "💡", sector: "Juridique", specialties: ["Conseil"] },
    systemPrompt: `E.M.M.A., conseil. 150 mots.`,
    greeting: "E.M.M.A., conseil?",
    examples: ["Aide?"],
    limits: ["Consulter avocat"]
  },

  // FINANCE (10 métiers)
  comptable: {
    profile: { name: "Comptabilité", icon: "💰", sector: "Finance", specialties: ["Fiscalité QC"] },
    systemPrompt: `E.M.M.A., compta. 150 mots. CPA.`,
    greeting: "E.M.M.A., fiscalité?",
    examples: ["Impôts?"],
    limits: ["Consulter CPA"]
  },
  planificateur_financier: {
    profile: { name: "Planification Financière", icon: "📊", sector: "Finance", specialties: ["Planification"] },
    systemPrompt: `E.M.M.A., finance. 150 mots.`,
    greeting: "E.M.M.A., planification?",
    examples: ["Retraite?"],
    limits: ["Consulter planificateur"]
  },
  conseiller_placement: {
    profile: { name: "Placements", icon: "📈", sector: "Finance", specialties: ["Investissement"] },
    systemPrompt: `E.M.M.A., placement. 150 mots.`,
    greeting: "E.M.M.A., investissement?",
    examples: ["Actions?"],
    limits: ["Consulter conseiller"]
  },
  assureur: {
    profile: { name: "Assurance", icon: "🛡️", sector: "Finance", specialties: ["Assurance"] },
    systemPrompt: `E.M.M.A., assurance. 150 mots.`,
    greeting: "E.M.M.A., assurance?",
    examples: ["Couverture?"],
    limits: ["Consulter assureur"]
  },
  courtier_hypothecaire: {
    profile: { name: "Hypothèque", icon: "🏦", sector: "Finance", specialties: ["Prêt"] },
    systemPrompt: `E.M.M.A., hypothèque. 150 mots.`,
    greeting: "E.M.M.A., prêt?",
    examples: ["Taux?"],
    limits: ["Consulter courtier"]
  },
  analyste_financier: {
    profile: { name: "Analyse Financière", icon: "🔍", sector: "Finance", specialties: ["Analyse"] },
    systemPrompt: `E.M.M.A., analyse. 150 mots.`,
    greeting: "E.M.M.A., analyse?",
    examples: ["Performance?"],
    limits: ["Consulter analyste"]
  },
  fiscaliste: {
    profile: { name: "Fiscalité", icon: "📋", sector: "Finance", specialties: ["Impôt"] },
    systemPrompt: `E.M.M.A., fiscal. 150 mots.`,
    greeting: "E.M.M.A., impôt?",
    examples: ["Déduction?"],
    limits: ["Consulter fiscaliste"]
  },
  auditeur: {
    profile: { name: "Audit", icon: "🔎", sector: "Finance", specialties: ["Vérification"] },
    systemPrompt: `E.M.M.A., audit. 150 mots.`,
    greeting: "E.M.M.A., audit?",
    examples: ["Vérification?"],
    limits: ["Consulter auditeur"]
  },
  tresorier: {
    profile: { name: "Trésorerie", icon: "💵", sector: "Finance", specialties: ["Liquidité"] },
    systemPrompt: `E.M.M.A., trésorerie. 150 mots.`,
    greeting: "E.M.M.A., liquidité?",
    examples: ["Cash flow?"],
    limits: ["Consulter trésorier"]
  },
  economiste: {
    profile: { name: "Économie", icon: "📉", sector: "Finance", specialties: ["Économie"] },
    systemPrompt: `E.M.M.A., économie. 150 mots.`,
    greeting: "E.M.M.A., économie?",
    examples: ["Tendance?"],
    limits: ["Consulter économiste"]
  },

  // TECHNOLOGIE (15 métiers)
  dev_fullstack: {
    profile: { name: "Développement Full-Stack", icon: "💻", sector: "Technologie", specialties: ["Web"] },
    systemPrompt: `E.M.M.A., dev. 150 mots.`,
    greeting: "E.M.M.A., dev?",
    examples: ["Code?"],
    limits: ["Tester code"]
  },
  designer_ux: {
    profile: { name: "Design UX/UI", icon: "🎨", sector: "Technologie", specialties: ["UX"] },
    systemPrompt: `E.M.M.A., design. 150 mots.`,
    greeting: "E.M.M.A., UX?",
    examples: ["Interface?"],
    limits: ["Tests utilisateurs"]
  },
  data_scientist: {
    profile: { name: "Science des Données", icon: "📊", sector: "Technologie", specialties: ["Données"] },
    systemPrompt: `E.M.M.A., data. 150 mots.`,
    greeting: "E.M.M.A., données?",
    examples: ["Analyse?"],
    limits: ["Valider modèle"]
  },
  securite_info: {
    profile: { name: "Sécurité Informatique", icon: "🔒", sector: "Technologie", specialties: ["Sécurité"] },
    systemPrompt: `E.M.M.A., sécu. 150 mots.`,
    greeting: "E.M.M.A., sécurité?",
    examples: ["Protection?"],
    limits: ["Audit professionnel"]
  },
  administrateur_systeme: {
    profile: { name: "Administration Système", icon: "⚙️", sector: "Technologie", specialties: ["Système"] },
    systemPrompt: `E.M.M.A., sysadmin. 150 mots.`,
    greeting: "E.M.M.A., système?",
    examples: ["Serveur?"],
    limits: ["Consulter expert"]
  },
  devops: {
    profile: { name: "DevOps", icon: "🔄", sector: "Technologie", specialties: ["Ops"] },
    systemPrompt: `E.M.M.A., devops. 150 mots.`,
    greeting: "E.M.M.A., DevOps?",
    examples: ["CI/CD?"],
    limits: ["Implémenter"]
  },
  architecte_logiciel: {
    profile: { name: "Architecture Logiciel", icon: "🏗️", sector: "Technologie", specialties: ["Architecture"] },
    systemPrompt: `E.M.M.A., archi. 150 mots.`,
    greeting: "E.M.M.A., architecture?",
    examples: ["Design?"],
    limits: ["Revue code"]
  },
  qa_testeur: {
    profile: { name: "Assurance Qualité", icon: "✅", sector: "Technologie", specialties: ["Tests"] },
    systemPrompt: `E.M.M.A., QA. 150 mots.`,
    greeting: "E.M.M.A., tests?",
    examples: ["Bug?"],
    limits: ["Tester"]
  },
  analyste_affaires: {
    profile: { name: "Analyste d'Affaires", icon: "📋", sector: "Technologie", specialties: ["Analyse"] },
    systemPrompt: `E.M.M.A., BA. 150 mots.`,
    greeting: "E.M.M.A., besoins?",
    examples: ["Exigences?"],
    limits: ["Documenter"]
  },
  scrum_master: {
    profile: { name: "Scrum Master", icon: "🎯", sector: "Technologie", specialties: ["Agile"] },
    systemPrompt: `E.M.M.A., scrum. 150 mots.`,
    greeting: "E.M.M.A., agile?",
    examples: ["Sprint?"],
    limits: ["Faciliter"]
  },
  product_owner: {
    profile: { name: "Product Owner", icon: "📱", sector: "Technologie", specialties: ["Produit"] },
    systemPrompt: `E.M.M.A., PO. 150 mots.`,
    greeting: "E.M.M.A., produit?",
    examples: ["Roadmap?"],
    limits: ["Prioriser"]
  },
  tech_lead: {
    profile: { name: "Lead Technique", icon: "👨‍💻", sector: "Technologie", specialties: ["Leadership"] },
    systemPrompt: `E.M.M.A., lead. 150 mots.`,
    greeting: "E.M.M.A., tech?",
    examples: ["Équipe?"],
    limits: ["Mentorer"]
  },
  mobile_dev: {
    profile: { name: "Développement Mobile", icon: "📲", sector: "Technologie", specialties: ["Mobile"] },
    systemPrompt: `E.M.M.A., mobile. 150 mots.`,
    greeting: "E.M.M.A., app?",
    examples: ["iOS/Android?"],
    limits: ["Tester"]
  },
  blockchain_dev: {
    profile: { name: "Blockchain", icon: "⛓️", sector: "Technologie", specialties: ["Crypto"] },
    systemPrompt: `E.M.M.A., blockchain. 150 mots.`,
    greeting: "E.M.M.A., crypto?",
    examples: ["Smart contract?"],
    limits: ["Audit"]
  },
  ai_ml: {
    profile: { name: "IA/Machine Learning", icon: "🤖", sector: "Technologie", specialties: ["IA"] },
    systemPrompt: `E.M.M.A., AI. 150 mots.`,
    greeting: "E.M.M.A., IA?",
    examples: ["Modèle?"],
    limits: ["Valider"]
  },

  // CONSTRUCTION (10 métiers)
  architecte: {
    profile: { name: "Architecture", icon: "🏛️", sector: "Construction", specialties: ["Conception"] },
    systemPrompt: `E.M.M.A., archi. 150 mots. OAQ.`,
    greeting: "E.M.M.A., architecture?",
    examples: ["Plan?"],
    limits: ["Consulter architecte"]
  },
  ingenieur_civil: {
    profile: { name: "Génie Civil", icon: "🌉", sector: "Construction", specialties: ["Structure"] },
    systemPrompt: `E.M.M.A., génie. 150 mots.`,
    greeting: "E.M.M.A., structure?",
    examples: ["Fondation?"],
    limits: ["Consulter ingénieur"]
  },
  electricien: {
    profile: { name: "Électricité", icon: "⚡", sector: "Construction", specialties: ["Électrique"] },
    systemPrompt: `E.M.M.A., élec. 150 mots. RBQ.`,
    greeting: "E.M.M.A., électricité?",
    examples: ["Installation?"],
    limits: ["Consulter électricien"]
  },
  plombier: {
    profile: { name: "Plomberie", icon: "🔧", sector: "Construction", specialties: ["Plomberie"] },
    systemPrompt: `E.M.M.A., plomberie. 150 mots.`,
    greeting: "E.M.M.A., plomberie?",
    examples: ["Fuite?"],
    limits: ["Consulter plombier"]
  },
  entrepreneur_general: {
    profile: { name: "Entrepreneur Général", icon: "👷", sector: "Construction", specialties: ["Gestion"] },
    systemPrompt: `E.M.M.A., entrepreneur. 150 mots.`,
    greeting: "E.M.M.A., construction?",
    examples: ["Projet?"],
    limits: ["Consulter entrepreneur"]
  },
  menuisier: {
    profile: { name: "Menuiserie", icon: "🪚", sector: "Construction", specialties: ["Bois"] },
    systemPrompt: `E.M.M.A., menuiserie. 150 mots.`,
    greeting: "E.M.M.A., bois?",
    examples: ["Meuble?"],
    limits: ["Consulter menuisier"]
  },
  peintre: {
    profile: { name: "Peinture", icon: "🎨", sector: "Construction", specialties: ["Finition"] },
    systemPrompt: `E.M.M.A., peinture. 150 mots.`,
    greeting: "E.M.M.A., peinture?",
    examples: ["Couleur?"],
    limits: ["Consulter peintre"]
  },
  macon: {
    profile: { name: "Maçonnerie", icon: "🧱", sector: "Construction", specialties: ["Maçonnerie"] },
    systemPrompt: `E.M.M.A., maçon. 150 mots.`,
    greeting: "E.M.M.A., maçonnerie?",
    examples: ["Brique?"],
    limits: ["Consulter maçon"]
  },
  couvreur: {
    profile: { name: "Toiture", icon: "🏠", sector: "Construction", specialties: ["Toit"] },
    systemPrompt: `E.M.M.A., toit. 150 mots.`,
    greeting: "E.M.M.A., toiture?",
    examples: ["Fuite?"],
    limits: ["Consulter couvreur"]
  },
  designer_interieur: {
    profile: { name: "Design Intérieur", icon: "🛋️", sector: "Construction", specialties: ["Décoration"] },
    systemPrompt: `E.M.M.A., design. 150 mots.`,
    greeting: "E.M.M.A., intérieur?",
    examples: ["Aménagement?"],
    limits: ["Consulter designer"]
  },

  // ÉDUCATION (10 métiers)
  enseignante_prescolaire: {
    profile: { name: "Préscolaire-Primaire", icon: "📚", sector: "Éducation", specialties: ["Enfants"] },
    systemPrompt: `E.M.M.A., préscolaire. 150 mots. MEES.`,
    greeting: "E.M.M.A., éducation?",
    examples: ["Maternelle?"],
    limits: ["Consulter enseignant"]
  },
  enseignante_secondaire: {
    profile: { name: "Secondaire", icon: "🏫", sector: "Éducation", specialties: ["Ados"] },
    systemPrompt: `E.M.M.A., secondaire. 150 mots.`,
    greeting: "E.M.M.A., secondaire?",
    examples: ["Motivation?"],
    limits: ["Consulter enseignant"]
  },
  educatrice_specialisee: {
    profile: { name: "Éducation Spécialisée", icon: "👥", sector: "Éducation", specialties: ["Adaptation"] },
    systemPrompt: `E.M.M.A., TES. 150 mots.`,
    greeting: "E.M.M.A., adaptation?",
    examples: ["Intervention?"],
    limits: ["Consulter TES"]
  },
  psychoeducatrice: {
    profile: { name: "Psychoéducation", icon: "🧩", sector: "Éducation", specialties: ["Psychoéd"] },
    systemPrompt: `E.M.M.A., psychoéd. 150 mots. OPPQ.`,
    greeting: "E.M.M.A., psychoéd?",
    examples: ["Comportement?"],
    limits: ["Consulter psychoéd"]
  },
  orthopedagogue: {
    profile: { name: "Orthopédagogie", icon: "📖", sector: "Éducation", specialties: ["Apprentissage"] },
    systemPrompt: `E.M.M.A., ortho. 150 mots.`,
    greeting: "E.M.M.A., apprentissage?",
    examples: ["Dyslexie?"],
    limits: ["Consulter ortho"]
  },
  tuteur: {
    profile: { name: "Tutorat", icon: "✏️", sector: "Éducation", specialties: ["Aide"] },
    systemPrompt: `E.M.M.A., tuteur. 150 mots.`,
    greeting: "E.M.M.A., tutorat?",
    examples: ["Math?"],
    limits: ["Consulter tuteur"]
  },
  conseiller_orientation: {
    profile: { name: "Orientation", icon: "🧭", sector: "Éducation", specialties: ["Carrière"] },
    systemPrompt: `E.M.M.A., orientation. 150 mots.`,
    greeting: "E.M.M.A., carrière?",
    examples: ["Choix?"],
    limits: ["Consulter COPS"]
  },
  formateur: {
    profile: { name: "Formation Adultes", icon: "👨‍🏫", sector: "Éducation", specialties: ["Formation"] },
    systemPrompt: `E.M.M.A., formation. 150 mots.`,
    greeting: "E.M.M.A., formation?",
    examples: ["Cours?"],
    limits: ["Consulter formateur"]
  },
  coach_scolaire: {
    profile: { name: "Coaching Scolaire", icon: "🎓", sector: "Éducation", specialties: ["Coaching"] },
    systemPrompt: `E.M.M.A., coach. 150 mots.`,
    greeting: "E.M.M.A., coaching?",
    examples: ["Étude?"],
    limits: ["Consulter coach"]
  },
  bibliothecaire: {
    profile: { name: "Bibliothéconomie", icon: "📚", sector: "Éducation", specialties: ["Ressources"] },
    systemPrompt: `E.M.M.A., biblio. 150 mots.`,
    greeting: "E.M.M.A., ressources?",
    examples: ["Recherche?"],
    limits: ["Consulter biblio"]
  },

  // AFFAIRES (10 métiers)
  entrepreneur: {
    profile: { name: "Entrepreneuriat", icon: "🚀", sector: "Affaires", specialties: ["Startup"] },
    systemPrompt: `E.M.M.A., startup. 150 mots.`,
    greeting: "E.M.M.A., entreprise?",
    examples: ["Démarrage?"],
    limits: ["Consulter expert"]
  },
  consultant: {
    profile: { name: "Consultation", icon: "📈", sector: "Affaires", specialties: ["Stratégie"] },
    systemPrompt: `E.M.M.A., consultant. 150 mots.`,
    greeting: "E.M.M.A., stratégie?",
    examples: ["Croissance?"],
    limits: ["Consulter consultant"]
  },
  gestionnaire_projet: {
    profile: { name: "Gestion Projet", icon: "📊", sector: "Affaires", specialties: ["PM"] },
    systemPrompt: `E.M.M.A., PM. 150 mots.`,
    greeting: "E.M.M.A., projet?",
    examples: ["Planning?"],
    limits: ["Consulter PM"]
  },
  rh: {
    profile: { name: "Ressources Humaines", icon: "👥", sector: "Affaires", specialties: ["RH"] },
    systemPrompt: `E.M.M.A., RH. 150 mots.`,
    greeting: "E.M.M.A., RH?",
    examples: ["Recrutement?"],
    limits: ["Consulter RH"]
  },
  marketing: {
    profile: { name: "Marketing", icon: "📣", sector: "Affaires", specialties: ["Marketing"] },
    systemPrompt: `E.M.M.A., marketing. 150 mots.`,
    greeting: "E.M.M.A., marketing?",
    examples: ["Stratégie?"],
    limits: ["Consulter marketeur"]
  },
  ventes: {
    profile: { name: "Ventes", icon: "💼", sector: "Affaires", specialties: ["Vente"] },
    systemPrompt: `E.M.M.A., ventes. 150 mots.`,
    greeting: "E.M.M.A., vente?",
    examples: ["Closing?"],
    limits: ["Pratiquer"]
  },
  communication: {
    profile: { name: "Communications", icon: "📢", sector: "Affaires", specialties: ["Com"] },
    systemPrompt: `E.M.M.A., com. 150 mots.`,
    greeting: "E.M.M.A., communication?",
    examples: ["Message?"],
    limits: ["Consulter expert"]
  },
  relations_publiques: {
    profile: { name: "Relations Publiques", icon: "🎤", sector: "Affaires", specialties: ["RP"] },
    systemPrompt: `E.M.M.A., RP. 150 mots.`,
    greeting: "E.M.M.A., RP?",
    examples: ["Média?"],
    limits: ["Consulter RP"]
  },
  coach_affaires: {
    profile: { name: "Coaching Affaires", icon: "💡", sector: "Affaires", specialties: ["Coach"] },
    systemPrompt: `E.M.M.A., coach. 150 mots.`,
    greeting: "E.M.M.A., coaching?",
    examples: ["Leadership?"],
    limits: ["Consulter coach"]
  },
  commercial: {
    profile: { name: "Développement Commercial", icon: "🎯", sector: "Affaires", specialties: ["Business dev"] },
    systemPrompt: `E.M.M.A., bizdev. 150 mots.`,
    greeting: "E.M.M.A., développement?",
    examples: ["Partenariat?"],
    limits: ["Consulter expert"]
  },

  // IMMOBILIER (5 métiers)
  agent_immobilier: {
    profile: { name: "Courtage Immobilier", icon: "🏘️", sector: "Immobilier", specialties: ["Achat/Vente"] },
    systemPrompt: `E.M.M.A., immo. 150 mots. OACIQ.`,
    greeting: "E.M.M.A., immobilier?",
    examples: ["Achat?"],
    limits: ["Consulter courtier"]
  },
  evaluateur: {
    profile: { name: "Évaluation", icon: "📐", sector: "Immobilier", specialties: ["Évaluation"] },
    systemPrompt: `E.M.M.A., éval. 150 mots.`,
    greeting: "E.M.M.A., évaluation?",
    examples: ["Valeur?"],
    limits: ["Consulter évaluateur"]
  },
  inspecteur: {
    profile: { name: "Inspection", icon: "🔍", sector: "Immobilier", specialties: ["Inspection"] },
    systemPrompt: `E.M.M.A., inspection. 150 mots.`,
    greeting: "E.M.M.A., inspection?",
    examples: ["Défaut?"],
    limits: ["Consulter inspecteur"]
  },
  gestionnaire_immeuble: {
    profile: { name: "Gestion Immobilière", icon: "🏢", sector: "Immobilier", specialties: ["Gestion"] },
    systemPrompt: `E.M.M.A., gestion. 150 mots.`,
    greeting: "E.M.M.A., gestion?",
    examples: ["Locataire?"],
    limits: ["Consulter gestionnaire"]
  },
  promoteur: {
    profile: { name: "Promotion Immobilière", icon: "🏗️", sector: "Immobilier", specialties: ["Développement"] },
    systemPrompt: `E.M.M.A., promoteur. 150 mots.`,
    greeting: "E.M.M.A., développement?",
    examples: ["Projet?"],
    limits: ["Consulter promoteur"]
  },

  // CRÉATIVITÉ (10 métiers)
  graphiste: {
    profile: { name: "Design Graphique", icon: "🎨", sector: "Créativité", specialties: ["Graphisme"] },
    systemPrompt: `E.M.M.A., graphisme. 150 mots.`,
    greeting: "E.M.M.A., design?",
    examples: ["Logo?"],
    limits: ["Portfolio"]
  },
  photographe: {
    profile: { name: "Photographie", icon: "📷", sector: "Créativité", specialties: ["Photo"] },
    systemPrompt: `E.M.M.A., photo. 150 mots.`,
    greeting: "E.M.M.A., photographie?",
    examples: ["Technique?"],
    limits: ["Pratiquer"]
  },
  videaste: {
    profile: { name: "Vidéo", icon: "🎥", sector: "Créativité", specialties: ["Vidéo"] },
    systemPrompt: `E.M.M.A., vidéo. 150 mots.`,
    greeting: "E.M.M.A., vidéo?",
    examples: ["Montage?"],
    limits: ["Créer"]
  },
  redacteur: {
    profile: { name: "Rédaction", icon: "✍️", sector: "Créativité", specialties: ["Écriture"] },
    systemPrompt: `E.M.M.A., rédac. 150 mots.`,
    greeting: "E.M.M.A., écriture?",
    examples: ["Article?"],
    limits: ["Écrire"]
  },
  musicien: {
    profile: { name: "Musique", icon: "🎵", sector: "Créativité", specialties: ["Musique"] },
    systemPrompt: `E.M.M.A., musique. 150 mots.`,
    greeting: "E.M.M.A., musique?",
    examples: ["Instrument?"],
    limits: ["Pratiquer"]
  },
  artiste: {
    profile: { name: "Arts Visuels", icon: "🖼️", sector: "Créativité", specialties: ["Art"] },
    systemPrompt: `E.M.M.A., art. 150 mots.`,
    greeting: "E.M.M.A., art?",
    examples: ["Technique?"],
    limits: ["Créer"]
  },
  comedien: {
    profile: { name: "Comédie/Théâtre", icon: "🎭", sector: "Créativité", specialties: ["Jeu"] },
    systemPrompt: `E.M.M.A., théâtre. 150 mots.`,
    greeting: "E.M.M.A., jeu?",
    examples: ["Rôle?"],
    limits: ["Audition"]
  },
  realisateur: {
    profile: { name: "Réalisation", icon: "🎬", sector: "Créativité", specialties: ["Réal"] },
    systemPrompt: `E.M.M.A., réal. 150 mots.`,
    greeting: "E.M.M.A., réalisation?",
    examples: ["Scène?"],
    limits: ["Tourner"]
  },
  illustrateur: {
    profile: { name: "Illustration", icon: "🖌️", sector: "Créativité", specialties: ["Dessin"] },
    systemPrompt: `E.M.M.A., illustration. 150 mots.`,
    greeting: "E.M.M.A., illustration?",
    examples: ["Style?"],
    limits: ["Dessiner"]
  },
  animateur: {
    profile: { name: "Animation", icon: "🎞️", sector: "Créativité", specialties: ["Animation"] },
    systemPrompt: `E.M.M.A., anim. 150 mots.`,
    greeting: "E.M.M.A., animation?",
    examples: ["2D/3D?"],
    limits: ["Animer"]
  },

  // SERVICES (5 métiers)
  coiffeur: {
    profile: { name: "Coiffure", icon: "💇", sector: "Services", specialties: ["Coiffure"] },
    systemPrompt: `E.M.M.A., coiffure. 150 mots.`,
    greeting: "E.M.M.A., coiffure?",
    examples: ["Coupe?"],
    limits: ["Consulter coiffeur"]
  },
  estheticienne: {
    profile: { name: "Esthétique", icon: "💅", sector: "Services", specialties: ["Beauté"] },
    systemPrompt: `E.M.M.A., esthétique. 150 mots.`,
    greeting: "E.M.M.A., beauté?",
    examples: ["Soin?"],
    limits: ["Consulter esthéticienne"]
  },
  massotherapeute: {
    profile: { name: "Massothérapie", icon: "💆", sector: "Services", specialties: ["Massage"] },
    systemPrompt: `E.M.M.A., massage. 150 mots.`,
    greeting: "E.M.M.A., massage?",
    examples: ["Technique?"],
    limits: ["Consulter massothérapeute"]
  },
  traiteur: {
    profile: { name: "Traiteur", icon: "🍽️", sector: "Services", specialties: ["Cuisine"] },
    systemPrompt: `E.M.M.A., traiteur. 150 mots.`,
    greeting: "E.M.M.A., événement?",
    examples: ["Menu?"],
    limits: ["Consulter traiteur"]
  },
  organisateur_evenements: {
    profile: { name: "Événementiel", icon: "🎉", sector: "Services", specialties: ["Événement"] },
    systemPrompt: `E.M.M.A., event. 150 mots.`,
    greeting: "E.M.M.A., événement?",
    examples: ["Organisation?"],
    limits: ["Consulter organisateur"]
  }
};

// Grouper par secteur
const getSectors = () => {
  const sectorsMap = {};
  Object.entries(professionalProfiles).forEach(([id, profile]) => {
    const sector = profile.profile.sector;
    if (!sectorsMap[sector]) {
      sectorsMap[sector] = [];
    }
    sectorsMap[sector].push({ id, ...profile.profile });
  });
  
  // Trier alphabétiquement
  return Object.keys(sectorsMap).sort().reduce((acc, key) => {
    acc[key] = sectorsMap[key].sort((a, b) => a.name.localeCompare(b.name));
    return acc;
  }, {});
};

// ========================================
// COMPOSANT PRINCIPAL
// ========================================
const EmmaExpertChatbot = () => {
  const [selectedSector, setSelectedSector] = useState(null);
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
    
    // Personnalité utilisateur
    const userStyles = {
      analytique: "L'utilisateur préfère des réponses structurées, avec données et faits précis.",
      créatif: "L'utilisateur aime les explications imagées, créatives et les analogies.",
      pragmatique: "L'utilisateur veut du concret, des solutions directes et actionnables.",
      empathique: "L'utilisateur apprécie un ton chaleureux, compréhensif et rassurant.",
      standard: ""
    };
    prompt += userStyles[userPersonality] || '';
    
    // Niveau expertise
    const expertiseLevels = {
      débutant: "Explique comme à quelqu'un qui découvre le sujet. Vulgarise au maximum.",
      intermediaire: "Équilibre entre vulgarisation et précision technique.",
      avancé: "Utilise termes techniques, suppose connaissances de base.",
      expert: "Niveau expert, détails poussés, références spécialisées."
    };
    prompt += ' ' + (expertiseLevels[expertiseLevel] || '');
    
    // Personnalité Emma
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
    const intro = `Bonjour ! Je suis E.M.M.A. (Exploration Multi-Métiers et Assistance), votre assistante virtuelle spécialisée en ${profession.name}. 

Avant de commencer, j'aimerais mieux vous connaître :
- Quel est votre prénom ?
- Que puis-je faire pour vous aider aujourd'hui ?

${personalityPrompt ? `Note : Je vais adapter mes réponses selon vos préférences (${userPersonality}, niveau ${expertiseLevel}, style ${emmaPersonality}).` : ''}

N'oubliez pas : je suis une assistante virtuelle. Pour des conseils personnalisés et professionnels, consultez toujours un expert qualifié du domaine.

Alors, comment puis-je vous aider ?`;
    
    setMessages([{
      role: 'model',
      parts: [{ text: intro }]
    }]);
    setSessionStartTime(Date.now());
    setElapsedTime(0);
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

PERSONNALISATION:
${personalityPrompt}

RAPPEL: Réponds en MAX 150 mots. Structure: Intro/Infos/Consulter professionnel réel.`;

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
        setMessages(prev => [...prev, {
          role: 'model',
          parts: data.candidates[0].content.parts
        }]);
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

  // Écran API
  if (showApiInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl">
              👋
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              E.M.M.A.
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
            Obtenez votre clé gratuite sur <a href="https://makersuite.google.com/app/apikey" target="_blank" className="text-indigo-600 hover:underline">Google AI Studio</a>
          </p>
        </div>
      </div>
    );
  }

  // Sélection secteur/métier
  if (!selectedProfession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Header */}
        <div className="bg-white shadow-lg border-b-2 border-indigo-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl">
                  👋
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    E.M.M.A.
                  </h1>
                  <p className="text-sm text-gray-600">100 Experts Professionnels</p>
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

            {/* Recherche */}
            <div className="mt-4 relative">
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

        {/* Secteurs */}
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
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{sectorName}</h2>
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
                <h2 className="text-2xl font-bold text-gray-800">À propos de E.M.M.A.</h2>
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
                    <h3 className="text-xl font-bold">E.M.M.A.</h3>
                    <p className="text-sm text-gray-600">Exploration Multi-Métiers et Assistance</p>
                  </div>
                </div>

                <p className="font-semibold text-lg">Mission universelle</p>
                <p>Explorer, comprendre et relier les savoirs de tous les métiers du monde. E.M.M.A. agit comme une intelligence de soutien professionnel global.</p>

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

                <p className="font-semibold">100 Profils Professionnels</p>
                <p>Couvrant 8 secteurs d'activité : Santé, Juridique, Finance, Technologie, Construction, Éducation, Affaires, Immobilier, Créativité, et Services.</p>

                <p className="text-sm text-gray-600 mt-4">Propulsé par JSL AI - Intelligence Artificielle au service des professionnels québécois.</p>
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
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4 text-gray-700 text-sm">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <p className="font-bold text-yellow-800">⚠️ AVERTISSEMENT IMPORTANT</p>
                  <p className="text-yellow-700 mt-2">E.M.M.A. est une assistante virtuelle utilisant l'intelligence artificielle. Elle ne remplace en AUCUN cas une consultation avec un professionnel qualifié.</p>
                </div>

                <div>
                  <p className="font-semibold mb-2">1. Nature du service</p>
                  <p>E.M.M.A. fournit des informations générales à caractère éducatif et informatif uniquement. Les réponses ne constituent pas des conseils professionnels personnalisés.</p>
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
                  <p className="ml-4 mb-2">E.M.M.A. ne pose pas de diagnostic médical et ne prescrit pas de traitement. En cas d'urgence médicale, composez le 911 ou contactez Info-Santé 811.</p>
                  
                  <p className="font-semibold text-red-600">Juridique :</p>
                  <p className="ml-4 mb-2">E.M.M.A. ne fournit pas de conseils juridiques personnalisés. Pour toute question légale, consultez un avocat membre du Barreau du Québec.</p>
                  
                  <p className="font-semibold text-red-600">Finance :</p>
                  <p className="ml-4">E.M.M.A. ne donne pas de conseils en placement. Consultez un planificateur financier ou conseiller agréé pour des recommandations personnalisées.</p>
                </div>

                <div>
                  <p className="font-semibold mb-2">4. Protection des données</p>
                  <p>Les conversations ne sont pas sauvegardées de manière permanente. Seuls des compteurs anonymes de consultations sont conservés localement sur votre appareil.</p>
                </div>

                <div>
                  <p className="font-semibold mb-2">5. Utilisation à vos risques</p>
                  <p>En utilisant E.M.M.A., vous reconnaissez et acceptez que :</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Vous utilisez ce service à vos propres risques</li>
                    <li>Vous ne vous fiez pas uniquement aux informations fournies</li>
                    <li>Vous consulterez un professionnel qualifié pour toute décision importante</li>
                  </ul>
                </div>

                <div className="bg-indigo-50 p-4 rounded-lg mt-4">
                  <p className="font-semibold text-indigo-800">Recommandation</p>
                  <p className="text-indigo-700">Utilisez E.M.M.A. comme point de départ pour vos recherches, puis consultez toujours un expert qualifié du domaine concerné pour des conseils personnalisés et professionnels.</p>
                </div>

                <p className="text-xs text-gray-500 mt-4">Dernière mise à jour : Octobre 2025</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Interface de chat
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
              <h1 className="text-xl font-bold">E.M.M.A.</h1>
              <p className="text-xs opacity-90">Assistante Virtuelle</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-4xl">{selectedProfession.icon}</div>
            <div>
              <h3 className="font-bold text-gray-800">{profile.profile.name}</h3>
              <p className="text-xs text-gray-600">Secteur : {profile.profile.sector}</p>
              {consultationCount > 0 && (
                <p className="text-xs text-indigo-600">{consultationCount} consultation{consultationCount > 1 ? 's' : ''}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between bg-indigo-50 p-3 rounded-lg">
            <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Clock size={16} /> Durée
            </span>
            <span className="text-lg font-bold text-indigo-600">{formatTime(elapsedTime)}</span>
          </div>
        </div>

        {/* Paramètres personnalisation */}
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-indigo-600 mb-3"
          >
            <Settings size={16} /> Personnaliser les réponses
          </button>
          
          {showSettings && (
            <div className="space-y-4 text-sm">
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
                <label className="block text-xs font-semibold text-gray-700 mb-1">Niveau d'expertise :</label>
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
                <label className="block text-xs font-semibold text-gray-700 mb-1">Style E.M.M.A. :</label>
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
                <p className="font-semibold">Paramètres actifs :</p>
                <p>• Style : {userPersonality}</p>
                <p>• Niveau : {expertiseLevel}</p>
                <p>• Ton : {emmaPersonality}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <p className="text-xs text-gray-600 italic">
            💡 E.M.M.A. est une assistante virtuelle. Pour des conseils personnalisés, consultez un professionnel qualifié.
          </p>
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
                    Consultation avec E.M.M.A.
                  </h2>
                  <p className="text-sm text-gray-600">{profile.profile.name}</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => {
                setSelectedProfession(null);
                setSelectedSector(null);
                setMessages([]);
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
              placeholder="Posez votre question à E.M.M.A..."
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