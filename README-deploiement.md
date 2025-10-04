# 🎯 Expert Chatbot Pro - Guide de Déploiement

Application React de chatbot multi-experts avec **API Gemini gratuite** de Google.

## 🌟 Fonctionnalités

### **9 Secteurs d'Activité**
- 🏥 **Santé & Bien-être** (8 métiers)
- ⚖️ **Juridique & Finance** (5 métiers)
- 💻 **Technologie & Digital** (7 métiers)
- 🏗️ **Construction & BTP** (7 métiers)
- 💼 **Business & Management** (6 métiers)
- 📚 **Éducation & Formation** (4 métiers)
- 🎭 **Créativité & Arts** (6 métiers)
- 🔧 **Services & Artisanat** (6 métiers)
- 🐾 **Animaux & Nature** (4 métiers)

### **53 Métiers Experts au Total**
Chaque professionnel a son propre profil avec :
- ✅ Connaissances spécialisées uniques
- ✅ Style de communication adapté
- ✅ Approche professionnelle du métier
- ✅ Prompt système personnalisé

---

## 📦 Déploiement : GitHub + Vercel (100% GRATUIT)

### ✅ **Réponse à votre question : OUI, GitHub + Vercel suffisent !**

**Vous N'AVEZ PAS BESOIN de n8n** pour cette application car :
- ✅ L'API Gemini est appelée directement depuis le navigateur
- ✅ Aucun serveur backend nécessaire
- ✅ C'est une application React pure (frontend only)
- ✅ La clé API est stockée localement dans le navigateur

**n8n serait utile uniquement si :**
- ❌ Vous vouliez masquer votre clé API côté serveur
- ❌ Vous vouliez faire des workflows complexes
- ❌ Vous vouliez connecter plusieurs APIs

**Mais pour votre cas : GitHub + Vercel = parfait ! 🎯**

---

## 🚀 Étapes de Déploiement

### **1. Prérequis**

- Compte GitHub (gratuit) : https://github.com
- Compte Vercel (gratuit) : https://vercel.com
- Clé API Google Gemini (gratuite) : https://makersuite.google.com/app/apikey

---

### **2. Créer le Projet React**

```bash
# Créer un nouveau projet React avec Vite
npm create vite@latest expert-chatbot -- --template react

# Entrer dans le dossier
cd expert-chatbot

# Installer les dépendances
npm install

# Installer lucide-react pour les icônes
npm install lucide-react
```

---

### **3. Intégrer le Code**

**Remplacer le contenu de `src/App.jsx` par le code de `expert-chatbot-gemini.jsx`**

**Modifier `src/index.css` pour ajouter Tailwind :**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

**Installer Tailwind CSS :**

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Configurer `tailwind.config.js` :**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Tester en local :**

```bash
npm run dev
```

Ouvrir http://localhost:5173

---

### **4. Pousser sur GitHub**

**Dans votre terminal :**

```bash
# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Faire le premier commit
git commit -m "Initial commit - Expert Chatbot"

# Créer le repo sur GitHub (via l'interface web)
# Puis lier et pousser :
git remote add origin https://github.com/VOTRE-USERNAME/expert-chatbot.git
git branch -M main
git push -u origin main
```

---

### **5. Déployer sur Vercel (3 clics !)**

1. **Aller sur https://vercel.com**
2. **Se connecter avec GitHub**
3. **Cliquer sur "New Project"**
4. **Importer votre repo `expert-chatbot`**
5. **Configurer le projet :**
   - Framework Preset : **Vite**
   - Root Directory : `./`
   - Build Command : `npm run build`
   - Output Directory : `dist`
6. **Cliquer sur "Deploy"**

**✅ C'est tout ! Votre app est en ligne en 2 minutes !**

L'URL sera : `https://expert-chatbot-XXXXX.vercel.app`

---

## 🔑 Obtenir votre Clé API Gemini (GRATUIT)

1. Aller sur https://makersuite.google.com/app/apikey
2. Se connecter avec un compte Google
3. Cliquer sur **"Get API Key"**
4. Cliquer sur **"Create API key in new project"**
5. Copier la clé générée
6. La coller dans l'application au premier lancement

**Limites gratuites de Gemini :**
- ✅ 60 requêtes par minute
- ✅ Illimité en nombre de tokens
- ✅ Parfait pour usage personnel et test

---

## 📁 Structure du Projet

```
expert-chatbot/
├── src/
│   ├── App.jsx           # Composant principal (le code de l'app)
│   ├── main.jsx          # Point d'entrée React
│   └── index.css         # Styles Tailwind
├── public/
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🎨 Personnalisation

### Ajouter un nouveau secteur :

```javascript
nouveauSecteur: {
  name: 'Nom du Secteur',
  icon: '🎯',
  color: 'from-blue-50 to-indigo-50',
  borderColor: 'border-blue-400',
  professions: [
    { 
      id: 'metier1', 
      name: 'Nom du Métier', 
      icon: '👨‍💼', 
      description: 'Description' 
    }
  ]
}
```

### Ajouter un nouveau métier :

```javascript
metier1: {
  systemPrompt: `Tu es un expert en [domaine]. Tu maîtrises [compétences]. 
  Tu es [personnalité]. Tu [approche].`,
  greeting: "Message d'accueil personnalisé du professionnel."
}
```

---

## 🔧 Commandes Utiles

```bash
# Développement local
npm run dev

# Build de production
npm run build

# Preview du build
npm run preview

# Mettre à jour le déploiement Vercel
git add .
git commit -m "Update"
git push
# Vercel redéploie automatiquement !
```

---

## 🆘 Dépannage

### Erreur : "Invalid API Key"
- Vérifiez que vous avez copié la clé complète
- Allez sur Google AI Studio pour régénérer une clé
- Effacez le cache du navigateur (localStorage)

### Erreur : "Module not found"
```bash
npm install
npm run dev
```

### L'app ne se déploie pas sur Vercel
- Vérifiez que `package.json` contient les bonnes dépendances
- Build Command doit être : `npm run build`
- Output Directory doit être : `dist`

---

## 📊 Avantages de cette Stack

| Feature | GitHub | Vercel |
|---------|--------|--------|
| **Coût** | 🟢 Gratuit | 🟢 Gratuit |
| **Déploiement** | - | 🚀 Automatique |
| **HTTPS** | - | ✅ Inclus |
| **Domaine custom** | - | ✅ Possible |
| **Rollback** | ✅ Git | ✅ 1 clic |
| **Preview** | - | ✅ Branches |

---

## 🎯 Conclusion

**Vous avez maintenant une application professionnelle avec :**
- ✅ 53 experts différents avec IA adaptée
- ✅ 9 secteurs d'activité organisés
- ✅ API Gemini gratuite (illimitée)
- ✅ Déploiement gratuit sur Vercel
- ✅ Code source versionné sur GitHub
- ✅ Design moderne et responsive
- ✅ Pas besoin de serveur backend
- ✅ **PAS besoin de n8n !**

**Prêt à déployer ! 🚀**

---

## 📞 Support

Pour toute question :
1. Vérifier la documentation Gemini : https://ai.google.dev/docs
2. Documentation Vercel : https://vercel.com/docs
3. Documentation React : https://react.dev

**Bon développement ! 🎉**
