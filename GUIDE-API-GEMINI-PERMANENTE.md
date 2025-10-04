# 🔑 Guide - Configuration API Gemini Permanente

## 🎯 Objectif

Configurer votre clé API Gemini **UNE SEULE FOIS** et ne plus jamais avoir à la rentrer.

---

## 📋 Comment Ça Fonctionne Actuellement

### Version Actuelle de Votre App

```javascript
// La clé API est stockée dans localStorage du navigateur
localStorage.setItem('gemini_api_key', apiKey);
```

**Avantage** :
- ✅ Simple
- ✅ Pas de backend nécessaire
- ✅ Chaque utilisateur entre SA propre clé

**Inconvénient** :
- ⚠️ Clé stockée dans le navigateur seulement
- ⚠️ Si vous videz cache/cookies → clé disparaît
- ⚠️ Différent par appareil/navigateur

---

## ✅ SOLUTION 1 : localStorage (Déjà Implémenté)

### C'est Quoi

La clé API est sauvegardée dans le **localStorage** du navigateur.

### Comment Ça Marche

```javascript
// Sauvegarder la clé
localStorage.setItem('gemini_api_key', 'VOTRE_CLE_API');

// Récupérer la clé
const savedKey = localStorage.getItem('gemini_api_key');
```

### Quand la Clé Est Perdue

La clé disparaît si :
- ❌ Vous videz cache/cookies du navigateur
- ❌ Vous utilisez mode navigation privée
- ❌ Vous changez de navigateur
- ❌ Vous changez d'appareil

### Avantages

- ✅ Déjà implémenté dans votre app
- ✅ Aucune configuration supplémentaire
- ✅ Pas de backend
- ✅ Sécurisé (localStorage accessible seulement par votre site)

### Inconvénients

- ⚠️ Par navigateur seulement
- ⚠️ Peut être perdue si cache vidé

### C'est Pour Qui ?

**✅ Parfait si :**
- Vous utilisez toujours le même appareil/navigateur
- Vous êtes le seul utilisateur de l'app
- Vous acceptez de rentrer la clé occasionnellement

---

## 🌐 SOLUTION 2 : Variables d'Environnement Vercel (Recommandé)

### C'est Quoi

La clé API est stockée **côté serveur** sur Vercel, pas dans le navigateur.

### Avantages

- ✅ Clé API cachée (utilisateurs ne la voient pas)
- ✅ Fonctionne sur tous appareils/navigateurs
- ✅ Ne disparaît jamais
- ✅ Plus sécurisé

### Inconvénients

- ⚠️ Nécessite modification du code
- ⚠️ Tous les utilisateurs utilisent LA MÊME clé (votre clé personnelle)
- ⚠️ Risque de dépassement de quota si beaucoup d'utilisateurs

### Quand Utiliser

**✅ Recommandé si :**
- Vous voulez une expérience "plug and play" pour utilisateurs
- Vous êtes prêt à partager votre quota Gemini
- Vous voulez que la clé soit invisible

**❌ Ne PAS utiliser si :**
- App publique avec beaucoup d'utilisateurs inconnus
- Vous ne voulez pas partager votre quota Gemini

---

### Comment Implémenter (15 minutes)

#### Étape 1 : Ajouter la Variable sur Vercel

1. Aller sur https://vercel.com
2. Sélectionner votre projet
3. Aller dans **Settings** → **Environment Variables**
4. Ajouter une nouvelle variable :
   - **Key** : `VITE_GEMINI_API_KEY`
   - **Value** : `VOTRE_CLE_API_GEMINI`
5. Sélectionner "Production", "Preview", "Development"
6. Cliquer **Save**

#### Étape 2 : Modifier le Code

**Dans `src/App.jsx`**, modifier la section API Key :

```javascript
// ===== ANCIENNE VERSION (localStorage) =====
const [apiKey, setApiKey] = useState('');
const [showApiInput, setShowApiInput] = useState(true);

useEffect(() => {
  const savedApiKey = localStorage.getItem('gemini_api_key');
  if (savedApiKey) {
    setApiKey(savedApiKey);
    setShowApiInput(false);
  }
}, []);

// ===== NOUVELLE VERSION (Variable d'environnement) =====
const [apiKey, setApiKey] = useState('');
const [showApiInput, setShowApiInput] = useState(false); // false par défaut

useEffect(() => {
  // Vérifier d'abord la variable d'environnement
  const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (envApiKey) {
    // Clé trouvée dans variables d'environnement
    setApiKey(envApiKey);
    setShowApiInput(false);
  } else {
    // Sinon, vérifier localStorage (fallback)
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setShowApiInput(false);
    } else {
      // Aucune clé trouvée, afficher l'input
      setShowApiInput(true);
    }
  }
}, []);
```

#### Étape 3 : Déployer

```bash
git add .
git commit -m "Ajout support variable d'environnement API Gemini"
git push
```

**Vercel redéploie automatiquement avec la clé !**

#### Étape 4 : Tester

1. Aller sur votre URL Vercel
2. **L'écran de configuration API ne devrait PAS s'afficher**
3. Les secteurs devraient s'afficher directement
4. Tester une conversation

**✅ Si ça fonctionne : La clé est configurée en permanence !**

---

### Pour Développement Local

Si vous voulez tester avec la variable d'environnement en local :

1. Créer un fichier `.env.local` à la racine du projet :

```bash
VITE_GEMINI_API_KEY=VOTRE_CLE_API_GEMINI
```

2. **IMPORTANT** : Ajouter `.env.local` au `.gitignore` :

```
# .gitignore
.env.local
.env
```

3. Redémarrer le serveur de développement :

```bash
npm run dev
```

**⚠️ Ne JAMAIS commiter le fichier `.env.local` sur GitHub !**

---

## 🔒 SOLUTION 3 : Backend API (Avancé)

### C'est Quoi

Créer une API backend qui gère les requêtes Gemini.

### Architecture

```
User Browser
    ↓
Your Backend API (Node.js, etc.)
    ↓
Gemini API
```

### Avantages

- ✅ Clé API complètement cachée
- ✅ Contrôle total (rate limiting, logging, etc.)
- ✅ Peut gérer authentification utilisateurs
- ✅ Plus sécurisé

### Inconvénients

- ⚠️ Complexe à implémenter
- ⚠️ Nécessite backend (coût potentiel)
- ⚠️ Maintenance supplémentaire

### Quand Utiliser

**✅ Recommandé si :**
- App avec beaucoup d'utilisateurs
- Vous voulez monitorer/limiter l'usage
- Vous voulez authentifier les utilisateurs
- Vous avez besoin de fonctionnalités avancées

### Implémentation

Ceci est avancé et sort du scope de ce guide, mais voici les grandes lignes :

1. Créer un backend (Express, Vercel Serverless, etc.)
2. Endpoint `/api/chat` qui fait le proxy vers Gemini
3. Modifier le frontend pour appeler votre API au lieu de Gemini directement

---

## 📊 Comparaison des Solutions

| Critère | localStorage | Env Variables | Backend API |
|---------|--------------|---------------|-------------|
| **Simplicité** | 🟢 Très simple | 🟡 Simple | 🔴 Complexe |
| **Sécurité clé** | 🟡 Moyenne | 🟢 Bonne | 🟢 Excellente |
| **Setup** | ✅ 0 min | ✅ 5 min | ⚠️ 60+ min |
| **Coût** | 🟢 Gratuit | 🟢 Gratuit | 🟡 Peut avoir coût |
| **Multi-appareils** | ❌ Non | ✅ Oui | ✅ Oui |
| **Maintenance** | 🟢 Aucune | 🟢 Minimale | 🔴 Régulière |
| **Usage multi-users** | ✅ Chacun sa clé | ⚠️ Partagent la clé | ✅ Contrôlable |

---

## 🎯 Recommandations

### Si Usage Personnel

**→ Utilisez localStorage (déjà implémenté)**

Pourquoi :
- Simple
- Pas de configuration
- Vous êtes le seul utilisateur
- Ça fonctionne déjà

### Si Partage avec Amis/Famille (10-20 personnes)

**→ Utilisez Variables d'Environnement Vercel**

Pourquoi :
- Expérience transparente pour eux
- Facile à configurer
- Quota Gemini gratuit suffisant

### Si App Publique (100+ utilisateurs)

**→ Backend API ou localStorage**

Option 1 : Backend API
- Contrôle total
- Rate limiting
- Analytics

Option 2 : localStorage
- Chaque utilisateur entre sa propre clé
- Vous ne payez rien
- Aucune maintenance

---

## ✅ Solution Recommandée Pour Vous

### Ma Recommandation : Variables d'Environnement Vercel

**Pourquoi** :
- ✅ Configuration une seule fois (5 min)
- ✅ Fonctionne sur tous appareils
- ✅ Expérience utilisateur parfaite (pas d'input clé)
- ✅ Assez simple à implémenter
- ✅ Gratuit

**Limite Gemini gratuite** :
- 60 requêtes/minute
- Largement suffisant pour usage personnel ou petit groupe

---

## 🚀 Mise en Place Rapide (Recommandé)

### Étapes Complètes

**1. Obtenir clé API Gemini**
```
https://makersuite.google.com/app/apikey
→ Créer clé API
→ Copier la clé
```

**2. Ajouter sur Vercel**
```
vercel.com → Votre Projet → Settings → Environment Variables
→ Key: VITE_GEMINI_API_KEY
→ Value: [VOTRE_CLE]
→ Save
```

**3. Modifier le code**
```javascript
// Dans src/App.jsx
const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (envApiKey) {
  setApiKey(envApiKey);
  setShowApiInput(false);
}
```

**4. Déployer**
```bash
git add .
git commit -m "Config API permanente"
git push
```

**5. Tester**
```
→ Ouvrir votre URL Vercel
→ Vérifier que secteurs s'affichent directement
→ Tester une conversation
```

**Total : 10-15 minutes** ⚡

---

## 📞 Dépannage

### Problème : Variable d'environnement ne fonctionne pas

**Vérifier** :
1. Variable bien nommée : `VITE_GEMINI_API_KEY` (pas d'espace)
2. Préfixe `VITE_` est obligatoire (c'est comme ça que Vite fonctionne)
3. Redéployer après ajout de variable :
   ```
   Vercel → Deployments → Redeploy
   ```

### Problème : Ça fonctionne sur Vercel mais pas en local

**Solution** : Créer `.env.local`

```
VITE_GEMINI_API_KEY=VOTRE_CLE
```

Redémarrer `npm run dev`

### Problème : import.meta.env undefined

**Solution** : Utiliser le bon préfixe

```javascript
// ❌ Mauvais
process.env.GEMINI_API_KEY

// ✅ Bon (Vite)
import.meta.env.VITE_GEMINI_API_KEY
```

---

## 🎉 Résultat Final

Avec Variables d'Environnement Vercel :

```
Utilisateur ouvre l'app
    ↓
Clé API chargée automatiquement depuis Vercel
    ↓
Secteurs s'affichent directement
    ↓
Aucune configuration nécessaire ✨
```

**Expérience utilisateur parfaite !** 🚀

---

**Temps total : 10-15 minutes**  
**Coût : 0€**  
**À refaire : Jamais** ✅

**Bon développement ! 🎉**
