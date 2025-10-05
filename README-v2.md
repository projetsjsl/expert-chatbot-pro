# 🇨🇦 Expert Chatbot Pro - Version Québécoise

<div align="center">

![Emma](https://img.shields.io/badge/Emma-AI-blueviolet?style=for-the-badge)
![Experts](https://img.shields.io/badge/Experts-Québécois-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&style=for-the-badge)
![Gemini](https://img.shields.io/badge/Gemini-API-4285F4?logo=google&style=for-the-badge)

**Consultez des experts professionnels québécois avec l'IA**

[🚀 Démo](#) | [📚 Documentation](#documentation) | [🎯 Installation](#installation)

</div>

---

## 🌟 Nouveautés Version 2.0

### ✨ Fonctionnalités Professionnelles

- 🇨🇦 **Contexte 100% Québécois** - Lois, règlements et sources du Québec
- 📊 **Sidebar Professionnelle** - Profil expert, points clés, suggestions
- ⏱️ **Compteur de Consultation** - Timer en temps réel
- 🎯 **Points Importants** - Résumé automatique des éléments clés
- 💡 **Questions Suggérées** - Exemples cliquables par métier
- ⚠️ **Limites Claires** - Transparence sur ce que l'expert peut faire
- 📧 **Export Email** - Recevez le résumé complet par email
- 🎨 **Logo Emma** - Branding professionnel
- 🧠 **Mémoire Totale** - L'expert se souvient de toute la conversation
- 🎨 **Design Pro** - Interface moderne et intuitive

---

## 📋 Secteurs & Experts Québécois

### 🏥 Santé & Bien-être
**Dr. Marie Tremblay, MD** - Médecin de famille  
*Sources : INESSS, INSPQ, Collège des médecins du Québec*

**Dr. Sophie Renard** - Psychologue clinicienne  
*Sources : Ordre des psychologues du Québec*

**Laura Petit, Dt.P.** - Nutritionniste-diététiste  
*Sources : Ordre professionnel des diététistes du Québec*

### ⚖️ Juridique & Finance
**Me Jean-François Gagnon** - Avocat au Barreau du Québec  
*Sources : Code civil du Québec, CanLII, Barreau du Québec*

**Me Fontaine** - Notaire  
*Sources : Chambre des notaires du Québec*

**Julie Bergeron, CPA** - Comptable professionnelle agréée  
*Sources : Revenu Québec, ARC, CPA Québec*

### 💻 Technologie
**Alex Chen** - Développeur Full-Stack senior  
**Emma Rousseau** - Designer UX/UI

### 🏗️ Construction
**Pierre Normandeau, Architecte** - Membre OAQ  
*Sources : Code de construction du Québec, RBQ, OAQ*

**Luc Martin** - Électricien qualifié  
*Sources : Régie du bâtiment du Québec*

### 💼 Affaires
**Marc-André Leblanc** - Entrepreneur québécois  
*Sources : Investissement Québec, PME MTL, BDC*

**Isabelle Roche** - Consultante en stratégie

### 🏠 Immobilier
**Sophie Lavoie** - Courtier immobilier OACIQ  
*Sources : OACIQ, Centris, JLR*

---

## 🎯 Captures d'écran

### Interface Principale
```
┌─────────────────────────────────────────────────┐
│  Emma                      [⚙️ Changer clé API]  │
│  Experts Professionnels                          │
│  Consultations avec experts québécois            │
├─────────────────────────────────────────────────┤
│                                                   │
│   [🏥 Santé]  [⚖️ Juridique]  [💻 Tech]         │
│                                                   │
│   [🏗️ Construction]  [💼 Business]  [🏠 Immo]   │
│                                                   │
└─────────────────────────────────────────────────┘
```

### Interface de Consultation
```
┌──────────────────┬───────────────────────────────┐
│  Emma            │  Dr. Marie Tremblay, MD       │
│  ─────────────   │  [← Retour] [📧 Email] [🔄]  │
│                  │                                │
│  👤 Profil       │  ┌──────────────────────────┐ │
│  Marie Tremblay  │  │ Bonjour, je suis la     │ │
│  MDCM, FRCPC     │  │ Dre Tremblay...         │ │
│  15 ans          │  └──────────────────────────┘ │
│                  │                                │
│  🔖 Spécialités  │  ┌──────────────────────────┐ │
│  • Médecine      │  │ Vous: J'ai mal à la     │ │
│    familiale     │  │ tête depuis 3 jours     │ │
│  • Préventif     │  └──────────────────────────┘ │
│                  │                                │
│  ⏱️ Durée: 05:32 │  [Posez votre question...]    │
│                  │  [Envoyer]                     │
│  🎯 Points Clés  │                                │
│  • Point 1       │                                │
│  • Point 2       │                                │
│                  │                                │
│  💡 Questions    │                                │
│  [Suggestion 1]  │                                │
│  [Suggestion 2]  │                                │
│                  │                                │
│  ⚠️ Limites      │                                │
│  • Pas de Rx     │                                │
│  • Examen requis │                                │
└──────────────────┴───────────────────────────────┘
```

---

## 🚀 Installation

### Prérequis

- Node.js 18+
- Compte Google (pour API Gemini gratuite)
- Compte GitHub et Vercel (déploiement)

### Installation Locale

```bash
# 1. Cloner ou créer le projet
npm create vite@latest expert-chatbot-pro -- --template react
cd expert-chatbot-pro

# 2. Installer les dépendances
npm install
npm install lucide-react

# 3. Remplacer App.jsx par expert-chatbot-pro-v2.jsx

# 4. Lancer en développement
npm run dev
```

### Obtenir Clé API Gemini (Gratuit)

1. Aller sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Créer une clé API
3. La coller dans l'application au premier lancement
4. Elle sera sauvegardée dans votre navigateur

**Limites gratuites :**
- ✅ 60 requêtes/minute
- ✅ Illimité en tokens
- ✅ Parfait pour usage professionnel

---

## 📊 Architecture

```
┌─────────────────────────────────────────────┐
│           React App (Frontend)               │
│  ┌────────────────────────────────────────┐ │
│  │  Navigation (Secteurs → Métiers)       │ │
│  │  ┌──────────────────────────────────┐  │ │
│  │  │  Chat Interface                   │  │ │
│  │  │  • Sidebar (Profil, Points clés) │  │ │
│  │  │  • Messages                       │  │ │
│  │  │  • Input                          │  │ │
│  │  │  • Timer                          │  │ │
│  │  └──────────────────────────────────┘  │ │
│  └────────────────────────────────────────┘ │
│                      ↓                       │
│              API Gemini (Directe)            │
│         • System Prompts Québécois           │
│         • Historique complet                 │
│         • Sources fiables                    │
└─────────────────────────────────────────────┘
                      ↓
            Vercel (Hébergement)
                      ↓
              GitHub (Code)
```

---

## 🎨 Personnalisation

### Ajouter un Expert Québécois

```javascript
// 1. Dans sectors
professions: [
  {
    id: 'nouveau_metier',
    name: 'Titre Professionnel',
    icon: '🎯',
    description: 'Description',
    color: 'bg-blue-100'
  }
]

// 2. Dans professionalProfiles
nouveau_metier: {
  profile: {
    name: "Prénom Nom, Titre",
    credentials: "Ordre/Association - X ans",
    specialties: ["Spé 1", "Spé 2", "Spé 3"],
    sources: ["Source QC 1", "Source QC 2"]
  },
  systemPrompt: `Prompt avec contexte québécois...`,
  greeting: "Message d'accueil",
  examples: ["Question 1?", "Question 2?"],
  limits: ["Limite 1", "Limite 2"]
}
```

### Modifier les Couleurs

```javascript
// Logo Emma
<div className="bg-gradient-to-r from-indigo-600 to-purple-600">

// Personnaliser
<div className="bg-gradient-to-r from-blue-600 to-teal-600">
```

### Ajuster la Sidebar

```javascript
// Largeur actuelle
<div className="w-80">

// Plus large
<div className="w-96">
```

---

## 📧 Export Email

### Solution Actuelle (Simple)

L'app utilise `mailto:` qui ouvre le client email :
- ✅ Fonctionne immédiatement
- ✅ Aucune configuration
- ⚠️ Nécessite client email configuré

### Solution Recommandée (Automatique)

**EmailJS** pour envoi automatique :
```bash
npm install @emailjs/browser
```

Voir `GUIDE-EMAIL.md` pour l'implémentation complète.

---

## 📚 Documentation

| Guide | Description |
|-------|-------------|
| `GUIDE-FONCTIONNALITES.md` | ⭐ Toutes les fonctionnalités détaillées |
| `GUIDE-EMAIL.md` | 📧 Solutions d'envoi email (avec/sans n8n) |
| `README-deploiement.md` | 🚀 Déploiement GitHub + Vercel |
| `QUICK-START.md` | ⚡ Démarrage rapide en 3 étapes |
| `COMPARAISON-SOLUTIONS.md` | 🤔 Pourquoi pas n8n pour ce projet |

---

## ❓ FAQ

### Contexte Québécois

**Q : Les réponses sont-elles vraiment adaptées au Québec ?**  
R : Oui ! Chaque expert a un prompt système avec :
- Lois et règlements québécois spécifiques
- Organismes professionnels du Québec
- Sources fiables québécoises
- Particularités du marché québécois

**Q : Quelles sources sont utilisées ?**  
R : Selon le métier :
- Droit : Code civil QC, Barreau du Québec, CanLII
- Fiscalité : Revenu Québec, ARC, CPA Québec
- Santé : INESSS, INSPQ, Collège des médecins
- Construction : RBQ, Code du bâtiment QC, OAQ
- Immobilier : OACIQ, Centris, JLR

### Fonctionnalités

**Q : L'expert se souvient-il de toute la conversation ?**  
R : Oui ! L'historique complet est envoyé à Gemini à chaque message.

**Q : Les points clés sont-ils intelligents ?**  
R : Version actuelle : extraction par mots-clés. Améliorable avec Gemini (voir `GUIDE-FONCTIONNALITES.md`).

**Q : Puis-je recevoir le résumé par email ?**  
R : Oui ! Via `mailto:` (client email) ou EmailJS (automatique).

### Technique

**Q : Ai-je besoin de n8n ?**  
R : **NON** ! n8n est inutile pour ce projet. Tout fonctionne avec React + Gemini + Vercel. Voir `GUIDE-EMAIL.md`.

**Q : Comment déployer ?**  
R : GitHub + Vercel en 10 minutes. Voir `README-deploiement.md`.

**Q : C'est gratuit ?**  
R : OUI ! API Gemini (gratuite), GitHub (gratuit), Vercel (gratuit). **0€/mois**.

---

## 🔒 Sécurité & Confidentialité

### Données Utilisateur
- ✅ Clé API stockée localement (navigateur uniquement)
- ✅ Conversations non sauvegardées côté serveur
- ✅ Pas de base de données
- ✅ Pas de tracking utilisateur

### Limites Professionnelles
Chaque expert affiche clairement ses limites :
- Ne remplace pas une consultation formelle
- Recommande des professionnels pour cas complexes
- Rappelle les obligations légales/éthiques

### Avertissements
- ⚠️ Conseils généraux seulement
- ⚠️ Consultation formelle recommandée pour décisions importantes
- ⚠️ Vérifier avec un professionnel agréé

---

## 🚀 Déploiement Production

### GitHub + Vercel (Recommandé)

```bash
# 1. Pousser sur GitHub
git init
git add .
git commit -m "Initial commit"
git push

# 2. Sur vercel.com
# - Importer le repo
# - Framework: Vite
# - Deploy!
```

**Temps : 5 minutes | Coût : 0€**

### Alternatives
- Netlify
- Cloudflare Pages
- Render

Toutes gratuites et simples !

---

## 🎯 Technologies

<table>
<tr>
<td align="center"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="40"/><br>React 18</td>
<td align="center"><img src="https://vitejs.dev/logo.svg" width="40"/><br>Vite</td>
<td align="center"><img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" width="40"/><br>Tailwind</td>
<td align="center"><img src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg" width="40"/><br>Gemini</td>
<td align="center"><img src="https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_dark_background.png" width="40"/><br>Vercel</td>
</tr>
</table>

---

## 📈 Statistiques

```
Experts québécois :      6 secteurs
Métiers disponibles :    15+ experts
Lignes de code :         ~800 (App.jsx)
Sources officielles :    30+ références
Temps de réponse :       <2 secondes
Coût d'utilisation :     0€/mois
```

---

## 🤝 Contribution

Les contributions sont bienvenues !

**Idées d'amélioration** :
- Ajouter plus de métiers québécois
- Améliorer l'extraction de points clés avec l'IA
- Intégration de ressources additionnelles
- Traduction anglais/français
- Mode sombre

---

## 📝 License

MIT License - Libre d'utilisation et de modification

---

## 👨‍💻 Crédits

**Propulsé par Emma**  
Développé avec ❤️ pour les professionnels québécois

**Technologies** :
- Google Gemini (IA)
- React + Vite
- Tailwind CSS
- Vercel (hébergement)

**Sources** :
Tous les ordres professionnels, organismes gouvernementaux et institutions québécoises mentionnés dans les profils d'experts.

---

## 📞 Support

**Documentation** :
- 📚 Guides complets dans `/outputs`
- 💬 Questions ? Consultez la FAQ
- 🐛 Issues ? GitHub Issues

**Ressources** :
- [Google AI Studio](https://makersuite.google.com)
- [Vercel Docs](https://vercel.com/docs)
- [React Docs](https://react.dev)

---

<div align="center">

**⭐ Si ce projet vous aide, donnez-lui une étoile ! ⭐**

Made with 🍁 for Québec

[⬆ Retour en haut](#-expert-chatbot-pro---version-québécoise)

</div>
