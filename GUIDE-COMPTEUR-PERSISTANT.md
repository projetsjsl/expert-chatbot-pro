# 📊 Guide : Compteur de Consultations Persistant

## 🎯 Objectif
Avoir un compteur global qui se met à jour en temps réel pour tous les utilisateurs.

---

## 🚀 Solutions Recommandées

### **Option 1 : Supabase (Gratuit + Simple)**

#### Installation
```bash
npm install @supabase/supabase-js
```

#### Configuration
```javascript
// supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
export const supabase = createClient(supabaseUrl, supabaseKey)
```

#### Table SQL
```sql
CREATE TABLE consultation_counts (
  profession_id TEXT PRIMARY KEY,
  count INTEGER DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW()
);
```

#### Code React
```javascript
// Remplacer les fonctions localStorage
const getConsultationCount = async (professionId) => {
  const { data, error } = await supabase
    .from('consultation_counts')
    .select('count')
    .eq('profession_id', professionId)
    .single();
  
  return data?.count || 0;
};

const incrementConsultationCount = async (professionId) => {
  const { data, error } = await supabase
    .from('consultation_counts')
    .upsert({ 
      profession_id: professionId, 
      count: 1 
    }, { 
      onConflict: 'profession_id',
      ignoreDuplicates: false 
    });
  
  // Incrémenter
  await supabase.rpc('increment_count', { 
    prof_id: professionId 
  });
};
```

#### Fonction SQL pour incrémenter
```sql
CREATE OR REPLACE FUNCTION increment_count(prof_id TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO consultation_counts (profession_id, count) 
  VALUES (prof_id, 1)
  ON CONFLICT (profession_id) 
  DO UPDATE SET 
    count = consultation_counts.count + 1,
    last_updated = NOW();
END;
$$ LANGUAGE plpgsql;
```

---

### **Option 2 : Firebase Firestore (Google)**

#### Installation
```bash
npm install firebase
```

#### Configuration
```javascript
// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, increment } from 'firebase/firestore';

const firebaseConfig = {
  // Votre config Firebase
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

#### Code React
```javascript
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';
import { db } from './firebase';

const getConsultationCount = async (professionId) => {
  const docRef = doc(db, 'consultations', professionId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data().count;
  }
  return 0;
};

const incrementConsultationCount = async (professionId) => {
  const docRef = doc(db, 'consultations', professionId);
  
  await setDoc(docRef, {
    count: increment(1)
  }, { merge: true });
};
```

---

### **Option 3 : API Simple (Vercel + JSON)**

#### Structure
```
/api/consultations/
  ├── [professionId].json
  └── index.js
```

#### API Route (Vercel)
```javascript
// api/consultations/[professionId].js
export default async function handler(req, res) {
  const { professionId } = req.query;
  
  if (req.method === 'GET') {
    // Lire le compteur
    const fs = require('fs');
    const path = `./data/${professionId}.json`;
    
    try {
      const data = JSON.parse(fs.readFileSync(path, 'utf8'));
      res.json({ count: data.count });
    } catch {
      res.json({ count: 0 });
    }
  }
  
  if (req.method === 'POST') {
    // Incrémenter le compteur
    const fs = require('fs');
    const path = `./data/${professionId}.json`;
    
    try {
      const data = JSON.parse(fs.readFileSync(path, 'utf8'));
      data.count += 1;
      fs.writeFileSync(path, JSON.stringify(data));
    } catch {
      fs.writeFileSync(path, JSON.stringify({ count: 1 }));
    }
    
    res.json({ success: true });
  }
}
```

#### Code React
```javascript
const getConsultationCount = async (professionId) => {
  const response = await fetch(`/api/consultations/${professionId}`);
  const data = await response.json();
  return data.count;
};

const incrementConsultationCount = async (professionId) => {
  await fetch(`/api/consultations/${professionId}`, {
    method: 'POST'
  });
};
```

---

## 🎯 Recommandation Finale

### **Pour votre cas : Supabase**

**Pourquoi ?**
- ✅ **Gratuit** jusqu'à 50k requêtes/mois
- ✅ **Temps réel** avec subscriptions
- ✅ **Simple** à configurer
- ✅ **Sécurisé** avec RLS
- ✅ **Pas de serveur** à gérer

### **Setup en 5 minutes**

1. **Créer compte** sur [supabase.com](https://supabase.com)
2. **Nouveau projet** → Copier URL + Key
3. **Créer table** avec le SQL ci-dessus
4. **Remplacer** les fonctions localStorage
5. **Déployer** sur Vercel/Netlify

### **Coût**
- **Supabase** : 0€ (gratuit jusqu'à 50k requêtes)
- **Vercel** : 0€ (gratuit)
- **Total** : 0€

---

## 🔄 Migration depuis localStorage

```javascript
// Ancien code
const counts = JSON.parse(localStorage.getItem('consultationCounts') || '{}');

// Nouveau code
const counts = await Promise.all(
  Object.keys(professions).map(async (id) => ({
    id,
    count: await getConsultationCount(id)
  }))
);
```

---

## 📊 Statistiques Avancées

Avec Supabase, vous pourrez aussi avoir :

```sql
-- Top 10 des métiers les plus consultés
SELECT profession_id, count 
FROM consultation_counts 
ORDER BY count DESC 
LIMIT 10;

-- Consultations par jour
SELECT DATE(last_updated), SUM(count) 
FROM consultation_counts 
GROUP BY DATE(last_updated);
```

**Résultat** : Dashboard temps réel de vos statistiques ! 📈

