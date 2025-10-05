# Configuration des Variables d'Environnement

## Variables Requises

### VITE_GEMINI_API_KEY
- **Description** : Clé API pour Google Gemini
- **Obligatoire** : Oui
- **Obtention** : https://makersuite.google.com/app/apikey
- **Usage** : Permet au chatbot d'utiliser l'API Gemini pour générer les réponses

## Configuration Vercel

1. Allez dans votre dashboard Vercel
2. Sélectionnez votre projet
3. Allez dans Settings > Environment Variables
4. Ajoutez la variable :
   - **Name** : `VITE_GEMINI_API_KEY`
   - **Value** : Votre clé API Gemini
   - **Environment** : Production, Preview, Development

## Configuration Locale

Créez un fichier `.env.local` à la racine du projet :

```bash
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

⚠️ **Important** : Ne commitez jamais votre fichier `.env.local` dans Git !
