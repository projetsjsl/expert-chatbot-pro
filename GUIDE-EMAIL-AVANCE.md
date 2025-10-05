# 📧 Guide EmailJS - Envoi Automatique d'Emails

## 🎯 Fonctionnalité Actuelle vs EmailJS

### ✅ Solution Actuelle (mailto:)
- **Fonctionne immédiatement** - Aucune configuration
- **Gratuit** - Pas de coûts
- **Simple** - Ouvre le client email de l'utilisateur
- **Limitation** - L'utilisateur doit cliquer "Envoyer" dans son client

### 🌟 Solution EmailJS (Recommandée pour l'automatisation)
- **Envoi automatique** - L'email est envoyé directement
- **Gratuit** - 200 emails/mois
- **Configuration simple** - 5 minutes de setup
- **Fonctionne partout** - Pas besoin de client email configuré

---

## 🚀 Installation EmailJS

### Étape 1 : Installer la librairie

```bash
npm install @emailjs/browser
```

### Étape 2 : Créer un compte EmailJS

1. Aller sur https://www.emailjs.com
2. S'inscrire gratuitement
3. Créer un service email (Gmail, Outlook, etc.)
4. Créer un template email

### Étape 3 : Configuration

Dans votre compte EmailJS, notez :
- **Service ID** (ex: `service_abc123`)
- **Template ID** (ex: `template_xyz789`)
- **Public Key** (ex: `user_abc123def456`)

---

## 🔧 Code EmailJS

### Modifier expert-chatbot-pro-v2.jsx

```javascript
// 1. Ajouter l'import en haut du fichier
import emailjs from '@emailjs/browser';

// 2. Ajouter les constantes de configuration (remplacer par vos vraies valeurs)
const EMAILJS_CONFIG = {
  serviceId: 'VOTRE_SERVICE_ID',
  templateId: 'VOTRE_TEMPLATE_ID',
  publicKey: 'VOTRE_PUBLIC_KEY'
};

// 3. Initialiser EmailJS dans useEffect
useEffect(() => {
  emailjs.init(EMAILJS_CONFIG.publicKey);
}, []);

// 4. Remplacer la fonction onClick du bouton dans le modal
onClick={() => {
  if (!email.trim()) {
    alert('Veuillez saisir une adresse email valide');
    return;
  }
  
  const summary = generateSummary();
  
  // Envoyer avec EmailJS
  emailjs.send(
    EMAILJS_CONFIG.serviceId,
    EMAILJS_CONFIG.templateId,
    {
      to_email: email,
      subject: `Résumé consultation - ${selectedProfession && professionalProfiles[selectedProfession.id].profile.name}`,
      message: summary,
      duration: formatTime(elapsedTime),
      date: new Date().toLocaleDateString('fr-CA'),
      profession: selectedProfession && professionalProfiles[selectedProfession.id].profile.name
    }
  ).then(
    (result) => {
      alert('✅ Email envoyé avec succès !');
      setShowEmailModal(false);
      setEmail('');
    },
    (error) => {
      alert('❌ Erreur lors de l\'envoi. Réessayez.');
      console.error('EmailJS error:', error);
    }
  );
}}
```

---

## 📝 Template EmailJS

Dans le dashboard EmailJS, créez un template avec ces variables :

```
À : {{to_email}}
Sujet : {{subject}}

Bonjour,

Voici le résumé de votre consultation avec Emma :

{{message}}

---
Détails de la consultation :
- Professionnel : {{profession}}
- Durée : {{duration}}
- Date : {{date}}

⚠️ RAPPEL IMPORTANT
Cette consultation est fournie à titre informatif uniquement. 
Pour des conseils personnalisés et professionnels, consultez toujours un expert qualifié du domaine.

---
Propulsé par JSL AI - Emma, votre assistante virtuelle spécialisée
www.mespros.ca
```

---

## 🔒 Variables d'Environnement (Optionnel)

Pour plus de sécurité, vous pouvez utiliser des variables d'environnement :

### 1. Créer un fichier .env.local
```
VITE_EMAILJS_SERVICE_ID=votre_service_id
VITE_EMAILJS_TEMPLATE_ID=votre_template_id
VITE_EMAILJS_PUBLIC_KEY=votre_public_key
```

### 2. Modifier le code
```javascript
const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY
};
```

### 3. Ajouter dans vercel.json (pour Vercel)
```json
{
  "env": {
    "VITE_EMAILJS_SERVICE_ID": "@emailjs_service_id",
    "VITE_EMAILJS_TEMPLATE_ID": "@emailjs_template_id",
    "VITE_EMAILJS_PUBLIC_KEY": "@emailjs_public_key"
  }
}
```

---

## 🎯 Avantages EmailJS

### ✅ Pourquoi choisir EmailJS ?

1. **Envoi automatique** - L'utilisateur n'a rien à faire
2. **Pas de backend** - Fonctionne directement depuis le navigateur
3. **Gratuit** - 200 emails/mois (largement suffisant)
4. **Simple** - Configuration en 5 minutes
5. **Fiable** - Service professionnel
6. **Sécurisé** - Pas besoin d'exposer vos credentials

### 📊 Comparaison

| Aspect | mailto: (Actuel) | EmailJS |
|--------|------------------|---------|
| **Envoi** | Manuel | Automatique |
| **Configuration** | Aucune | 5 min |
| **Coût** | Gratuit | Gratuit* |
| **Client email requis** | Oui | Non |
| **Limite** | Aucune | 200/mois |

*Gratuit jusqu'à 200 emails/mois

---

## 🚀 Déploiement

### Avec Vercel

1. **Variables d'environnement** dans Vercel Dashboard :
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`

2. **Redéployer** l'application

### Test

1. Ouvrir l'application
2. Faire une consultation
3. Cliquer "Envoyer par email"
4. Saisir une adresse email
5. Cliquer "Envoyer automatiquement"
6. Vérifier la réception de l'email

---

## 🎉 Résultat Final

Avec EmailJS, l'utilisateur :
1. ✅ Fait sa consultation
2. ✅ Clique "Envoyer par email"
3. ✅ Saisit son email
4. ✅ Clique "Envoyer automatiquement"
5. ✅ **L'email est envoyé automatiquement !**

**Plus besoin d'ouvrir un client email ou de cliquer "Envoyer" !**

---

## 🔧 Support

Si vous avez des questions sur EmailJS :
- Documentation : https://www.emailjs.com/docs/
- Support : https://www.emailjs.com/support/
- Templates : https://www.emailjs.com/templates/

---

**La fonctionnalité d'envoi par email est maintenant complète ! 🎉**
