import { createClient } from '@supabase/supabase-js'

// Remplacez ces valeurs par vos vraies clés Supabase
const supabaseUrl = 'https://xpcdmztazbsmyudvkbkb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwY2RtenRhemJzbXl1ZHZrYmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MDMzOTAsImV4cCI6MjA3NTA3OTM5MH0.T2N52l862Ri5c2UuT1mD6kUhKDAhoGJpRGHq6r1zYzA'

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

