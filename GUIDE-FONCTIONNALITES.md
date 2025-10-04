# 🇨🇦 Guide Complet - Version Québécoise Professionnelle

## 🎉 Nouvelles Fonctionnalités Ajoutées

### 1. **Contexte Québécois Intégré** 🍁

Chaque expert est maintenant adapté au Québec avec :

#### Lois et Réglementations Québécoises
- **Avocat** : Code civil du Québec, Barreau du Québec
- **Comptable** : Revenu Québec + ARC (fédéral)
- **Architecte** : Code de construction du Québec, RBQ
- **Courtier immobilier** : OACIQ, Centris
- **Médecin** : Collège des médecins du Québec, RAMQ

#### Sources Fiables par Métier
Chaque professionnel référence les sources les plus fiables de son domaine québécois :

```javascript
profile: {
  sources: [
    "INESSS",              // Santé
    "Code civil du Québec", // Droit
    "Revenu Québec",       // Fiscalité
    // etc.
  ]
}
```

---

### 2. **Sidebar Professionnel** 📊

Une barre latérale complète affichant :

#### A. Profil de l'Expert
- Nom et titre professionnel
- Crédences (années d'expérience, ordres professionnels)
- Spécialités principales
- Sources fiables utilisées

#### B. Compteur de Temps ⏱️
- Timer en temps réel de la consultation
- Format : MM:SS
- Commence dès la sélection de l'expert

#### C. Points Clés Importants 🎯
- Mise à jour automatique pendant la conversation
- Extrait les informations cruciales
- Affiche les 5 derniers points importants
- Code d'extraction intelligent (peut être amélioré avec l'IA)

#### D. Questions Suggérées 💡
- 4 exemples de questions par expert
- Cliquables pour remplir automatiquement le champ
- Adaptées au contexte québécois

#### E. Limites Importantes ⚠️
- Liste claire de ce que l'expert peut/ne peut pas faire
- Rappels sur les consultations formelles
- Protection légale et éthique

---

### 3. **Logo JSL AI** 🎨

Logo professionnel intégré :
```html
<div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
  <h1 className="text-xl font-bold">JSL AI</h1>
  <p className="text-xs opacity-90">Intelligence Artificielle</p>
</div>
```

Apparaît :
- En haut de chaque page
- Dans la sidebar
- Style gradient moderne indigo/violet

---

### 4. **Navigation Améliorée** 🧭

Système de navigation fluide en 3 niveaux :

1. **Secteurs** → Vue en grille des domaines
2. **Métiers** → Sélection de l'expert spécifique
3. **Chat** → Interface de consultation

Boutons de retour intuitifs :
- `← Retour aux secteurs`
- `← Retour aux métiers`
- Bouton "Nouveau" pour tout réinitialiser

---

### 5. **Résumé et Export Email** 📧

#### Bouton "Recevoir résumé"
- Ouvre une modal pour entrer l'email
- Génère un résumé complet automatiquement

#### Contenu du Résumé
```
RÉSUMÉ DE CONSULTATION
Expert: [Nom]
Durée: [Temps]
Date: [Date]

CONVERSATION:
[Tous les messages]

POINTS CLÉS:
[Liste des points importants]
```

#### Solution d'Envoi
**Actuelle** : `mailto:` (ouvre le client email)
**Recommandée** : EmailJS (envoi automatique)
Voir `GUIDE-EMAIL.md` pour détails

---

### 6. **Mémoire Conversationnelle** 🧠

L'historique complet est maintenu :
```javascript
const [messages, setMessages] = useState([]);
```

**Caractéristiques** :
- ✅ Tout l'historique passé à Gemini à chaque requête
- ✅ L'expert se souvient du contexte
- ✅ Peut référencer des éléments antérieurs
- ✅ Cohérence de la conversation garantie

**Comment ça fonctionne** :
```javascript
const history = messages.map(msg => ({
  role: msg.role === 'assistant' ? 'model' : msg.role,
  parts: msg.parts
}));

// Envoi à Gemini avec TOUT l'historique
body: JSON.stringify({
  contents: [...history, userMessage],
  systemInstruction: { parts: [{ text: profile.systemPrompt }] }
})
```

---

### 7. **Design Professionnel** ✨

#### Palette de Couleurs par Secteur
Chaque secteur a sa propre identité visuelle :

```javascript
sante: {
  color: 'from-red-50 to-pink-100',
  borderColor: 'border-red-400'
}
```

- 🏥 Santé : Rouge/Rose
- ⚖️ Juridique : Bleu/Indigo
- 💻 Tech : Violet/Pourpre
- 🏗️ Construction : Orange/Ambre
- 💼 Business : Vert/Émeraude
- 🏠 Immobilier : Teal/Cyan

#### Effets Visuels
- Hover avec scale (zoom)
- Transitions fluides
- Ombres dynamiques
- Gradients modernes
- Bordures colorées au survol

---

## 📝 Personnalisation

### Ajouter un Nouveau Métier Québécois

#### Étape 1 : Définir dans `sectors`

```javascript
nouveauSecteur: {
  name: 'Votre Secteur',
  icon: '🎯',
  color: 'from-blue-50 to-indigo-100',
  borderColor: 'border-blue-400',
  bgColor: 'bg-blue-50',
  professions: [
    {
      id: 'votre_metier',
      name: 'Nom du Métier',
      icon: '👨‍💼',
      description: 'Description courte',
      color: 'bg-blue-100'
    }
  ]
}
```

#### Étape 2 : Créer le Profil dans `professionalProfiles`

```javascript
votre_metier: {
  profile: {
    name: "Prénom Nom, Titre",
    credentials: "Crédences - X ans d'expérience",
    specialties: ["Spé 1", "Spé 2", "Spé 3"],
    sources: [
      "Source officielle QC 1",
      "Source officielle QC 2",
      "Source officielle QC 3"
    ]
  },
  
  systemPrompt: `Tu es [Nom], [profession] au Québec avec [X] ans d'expérience.

CONTEXTE QUÉBÉCOIS IMPORTANT:
- [Lois et règlements spécifiques au Québec]
- [Organismes de réglementation québécois]
- [Particularités du marché québécois]
- [Normes et standards québécois]

SOURCES FIABLES À PRIVILÉGIER:
- [Source officielle 1]
- [Source officielle 2]
- [Source officielle 3]
- [Bases de données pertinentes]

APPROCHE:
- [Méthodologie de travail]
- [Questions à poser]
- [Points à noter]
- [Ressources à recommander]
- [Format des réponses]

Tu es [qualités professionnelles]. Tu [style de communication].`,

  greeting: "Bonjour, [Nom], [profession]. [Question d'introduction]",
  
  examples: [
    "Question type 1 adaptée au Québec ?",
    "Question type 2 avec contexte QC ?",
    "Question type 3 spécifique ?",
    "Question type 4 pratique ?"
  ],
  
  limits: [
    "Limite 1 importante",
    "Limite 2 à respecter",
    "Limite 3 éthique/légale",
    "Limite 4 pratique"
  ]
}
```

---

### Adapter un Métier Existant au Québec

#### Rechercher les Sources Officielles

**Pour chaque profession, identifier** :

1. **Ordre Professionnel**
   - Ex: OAQ (Architectes), Barreau du Québec, OACIQ (Courtiers)
   - Site web officiel
   - Code de déontologie

2. **Lois et Règlements**
   - Code civil du Québec (droit)
   - Loi sur les impôts (fiscalité)
   - Code du bâtiment (construction)

3. **Organismes Gouvernementaux**
   - Revenu Québec
   - RAMQ
   - Régie du bâtiment (RBQ)

4. **Ressources Spécialisées**
   - Bases de données (CanLII, SOQUIJ)
   - Guides de pratique
   - Publications officielles

#### Exemple : Médecin au Québec

```javascript
systemPrompt: `[...]

CONTEXTE QUÉBÉCOIS IMPORTANT:
- Tu pratiques selon les normes du Collège des médecins du Québec
- Tu connais le système de santé québécois :
  * RAMQ (assurance maladie)
  * GMF (Groupes de médecine de famille)
  * Guichets d'accès aux services
  * Info-Santé 811
- Tu références les guides de l'INESSS (Institut national d'excellence)
- Tu es à jour sur les recommandations de l'INSPQ (santé publique)

SOURCES FIABLES:
- INESSS (Institut national d'excellence en santé et services sociaux)
- INSPQ (Institut national de santé publique du Québec)
- Collège des médecins du Québec
- Guides de pratique CMFC (Collège des médecins de famille du Canada)
- UpToDate (médecine basée sur les preuves)

[...]`
```

---

### Personnaliser les Points Clés Automatiques

Actuellement, l'extraction est basique. Pour l'améliorer :

#### Option 1 : Mots-clés (Actuel)

```javascript
const extractKeyPoints = (text) => {
  const points = [];
  
  // Chercher des mots-clés importants
  const keywords = ['important', 'rappel', 'attention', 'noter', 'crucial', 'essentiel'];
  
  keywords.forEach(keyword => {
    if (text.toLowerCase().includes(keyword)) {
      // Extraire la phrase contenant le mot-clé
      const sentences = text.split('.').filter(s => s.includes(keyword));
      points.push(...sentences.map(s => s.trim() + '.'));
    }
  });
  
  return points.slice(0, 5); // Max 5 points
};
```

#### Option 2 : Demander à Gemini (Meilleur)

```javascript
const extractKeyPoints = async (text) => {
  const prompt = `Extrait 3 points clés importants de cette réponse d'expert.
Format: Liste à puces courte et claire.

Réponse: ${text}

Points clés:`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 200 }
      })
    }
  );

  const data = await response.json();
  return data.candidates[0].content.parts[0].text
    .split('\n')
    .filter(line => line.trim().startsWith('-'))
    .map(line => line.replace(/^-\s*/, ''));
};
```

---

## 🎨 Personnalisation du Design

### Changer les Couleurs du Logo

```javascript
// Actuel
<div className="bg-gradient-to-r from-indigo-600 to-purple-600">

// Personnalisé (exemple bleu/vert)
<div className="bg-gradient-to-r from-blue-600 to-teal-600">
```

### Modifier la Palette d'un Secteur

```javascript
sante: {
  // Couleurs d'origine
  color: 'from-red-50 to-pink-100',
  borderColor: 'border-red-400',
  bgColor: 'bg-red-50',
  
  // Nouvelle palette (exemple bleu)
  color: 'from-blue-50 to-sky-100',
  borderColor: 'border-blue-400',
  bgColor: 'bg-blue-50',
}
```

### Ajuster les Tailles

```javascript
// Icônes secteurs
<div className="text-6xl mb-4"> {/* Plus grand: text-8xl */}

// Icônes métiers
<div className="text-5xl mb-3"> {/* Plus petit: text-4xl */}

// Sidebar
<div className="w-80"> {/* Plus large: w-96 ou w-1/4 */}
```

---

## 📊 Métriques et Statistiques

### Ajouter un Compteur de Messages

```javascript
const [messageCount, setMessageCount] = useState(0);

// Dans sendMessage(), après succès:
setMessageCount(prev => prev + 1);

// Afficher dans la sidebar:
<div className="p-4 border-b">
  <p className="text-sm text-gray-600">
    Messages échangés: <span className="font-bold">{messageCount}</span>
  </p>
</div>
```

### Suivre les Consultations par Expert

```javascript
// Dans localStorage
useEffect(() => {
  if (selectedProfession) {
    const stats = JSON.parse(localStorage.getItem('consultStats') || '{}');
    stats[selectedProfession.id] = (stats[selectedProfession.id] || 0) + 1;
    localStorage.setItem('consultStats', JSON.stringify(stats));
  }
}, [selectedProfession]);
```

---

## 🔍 Sources Fiables par Domaine au Québec

### Santé
- **INESSS** : https://www.inesss.qc.ca
- **INSPQ** : https://www.inspq.qc.ca
- **Collège des médecins** : https://www.cmq.org
- **Ordre des pharmaciens** : https://www.opq.org

### Droit
- **Barreau du Québec** : https://www.barreau.qc.ca
- **Code civil du Québec** : http://legisquebec.gouv.qc.ca
- **CanLII** (jurisprudence) : https://www.canlii.org
- **Éducaloi** : https://educaloi.qc.ca
- **SOQUIJ** : https://soquij.qc.ca

### Fiscalité
- **Revenu Québec** : https://www.revenuquebec.ca
- **ARC** (fédéral) : https://www.canada.ca/fr/agence-revenu.html
- **CPA Québec** : https://cpaquebec.ca

### Construction
- **RBQ** : https://www.rbq.gouv.qc.ca
- **Code de construction** : http://legisquebec.gouv.qc.ca
- **OAQ** (architectes) : https://www.oaq.com

### Immobilier
- **OACIQ** : https://www.oaciq.com
- **Centris** : https://www.centris.ca
- **JLR** (statistiques) : https://www.jlr.ca

### Entrepreneuriat
- **Investissement Québec** : https://www.investquebec.com
- **PME MTL** : https://pmemtl.com
- **BDC** : https://www.bdc.ca
- **REQ** : https://www.registreentreprises.gouv.qc.ca

---

## 🚀 Déploiement

### Fichiers Modifiés

Pour utiliser la nouvelle version :

1. **Remplacer** `App.jsx` par `expert-chatbot-pro-v2.jsx`
2. **Garder** tous les autres fichiers identiques
3. **Tester** en local : `npm run dev`
4. **Déployer** : `git push` → Vercel redéploie automatiquement

### Checklist de Vérification

- [ ] Logo JSL AI visible partout
- [ ] Sidebar s'affiche correctement
- [ ] Timer fonctionne
- [ ] Points clés s'ajoutent
- [ ] Questions suggérées cliquables
- [ ] Limites affichées
- [ ] Profil expert complet
- [ ] Sources listées
- [ ] Modal email fonctionne
- [ ] Navigation fluide
- [ ] Contexte québécois dans les réponses

---

## 💡 Améliorations Futures Possibles

### 1. Base de Données des Consultations
- Sauvegarder l'historique côté serveur
- Reprendre une consultation précédente
- Statistiques d'utilisation

### 2. Système de Notes
- L'utilisateur peut prendre des notes pendant la consultation
- Export des notes avec le résumé

### 3. Recherche dans l'Historique
- Chercher dans les anciennes conversations
- Filtrer par expert ou date

### 4. Notifications
- Rappels de suivi
- Suggestions de ressources après consultation

### 5. Multi-langue
- Interface en anglais
- Experts bilingues (FR/EN)

---

## ❓ FAQ Technique

### "Comment l'expert se souvient-il du contexte ?"

L'historique complet est envoyé à Gemini à chaque message :
```javascript
contents: [...history, userMessage]
```

Gemini voit tout l'historique et maintient la cohérence.

### "Les points clés sont-ils intelligents ?"

Actuellement basique (mots-clés). Pour améliorer, utiliser Gemini pour l'extraction (voir Option 2 ci-dessus).

### "Puis-je limiter la durée de consultation ?"

Oui, ajoutez une limite de temps :
```javascript
useEffect(() => {
  if (elapsedTime >= 3600) { // 1 heure
    alert('Consultation terminée - durée maximale atteinte');
    // Actions de fin
  }
}, [elapsedTime]);
```

### "Comment masquer certains métiers ?"

Commentez ou supprimez dans `sectors` :
```javascript
professions: [
  // { id: 'metier_cache', ... }, // Masqué
  { id: 'metier_visible', ... }
]
```

---

## 🎉 Résumé des Fonctionnalités

✅ **6 secteurs** avec experts québécois  
✅ **Contexte québécois** dans chaque prompt  
✅ **Sources fiables** listées par métier  
✅ **Sidebar professionnelle** complète  
✅ **Timer** de consultation en temps réel  
✅ **Points clés** extraits automatiquement  
✅ **Questions suggérées** cliquables  
✅ **Limites** clairement affichées  
✅ **Logo JSL AI** partout  
✅ **Navigation fluide** 3 niveaux  
✅ **Mémoire** conversationnelle intégrée  
✅ **Export email** du résumé  
✅ **Design professionnel** moderne  

---

**Votre application est maintenant une plateforme de consultation professionnelle québécoise de niveau entreprise !** 🚀

Pour toute question : consultez les autres guides ou le code source commenté.
