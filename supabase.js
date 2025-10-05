import { createClient } from '@supabase/supabase-js'

// Remplacez ces valeurs par vos vraies clés Supabase
const supabaseUrl = 'VOTRE_PROJECT_URL_ICI'
const supabaseKey = 'VOTRE_ANON_KEY_ICI'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Test de connexion
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('consultation_counts').select('count').limit(1)
    if (error) throw error
    console.log('✅ Connexion Supabase réussie!')
    return true
  } catch (error) {
    console.error('❌ Erreur connexion Supabase:', error)
    return false
  }
}

