import { supabase } from './supabase.js'

// ========================================
// SERVICE DE COMPTAGE PERSISTANT
// ========================================

/**
 * Récupère le nombre de consultations pour une profession
 * @param {string} professionId - ID de la profession
 * @returns {Promise<number>} - Nombre de consultations
 */
export const getConsultationCount = async (professionId) => {
  try {
    const { data, error } = await supabase
      .from('consultation_counts')
      .select('count')
      .eq('profession_id', professionId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = pas de données trouvées
      console.error('Erreur récupération compteur:', error);
      return 0;
    }
    
    return data?.count || 0;
  } catch (error) {
    console.error('Erreur getConsultationCount:', error);
    // Fallback vers localStorage en cas d'erreur
    const counts = JSON.parse(localStorage.getItem('consultationCounts') || '{}');
    return counts[professionId] || 0;
  }
};

/**
 * Incrémente le compteur de consultations
 * @param {string} professionId - ID de la profession
 * @returns {Promise<number>} - Nouveau nombre de consultations
 */
export const incrementConsultationCount = async (professionId) => {
  try {
    // Utiliser la fonction SQL pour incrémenter
    const { error } = await supabase.rpc('increment_count', { 
      prof_id: professionId 
    });
    
    if (error) {
      console.error('Erreur incrémentation:', error);
      // Fallback vers localStorage
      return incrementLocalCount(professionId);
    }
    
    // Récupérer le nouveau count
    const newCount = await getConsultationCount(professionId);
    return newCount;
  } catch (error) {
    console.error('Erreur incrementConsultationCount:', error);
    // Fallback vers localStorage
    return incrementLocalCount(professionId);
  }
};

/**
 * Fallback : incrémentation locale
 * @param {string} professionId - ID de la profession
 * @returns {number} - Nouveau nombre de consultations
 */
const incrementLocalCount = (professionId) => {
  const counts = JSON.parse(localStorage.getItem('consultationCounts') || '{}');
  counts[professionId] = (counts[professionId] || 0) + 1;
  localStorage.setItem('consultationCounts', JSON.stringify(counts));
  return counts[professionId];
};

/**
 * Récupère tous les compteurs (pour les statistiques)
 * @returns {Promise<Object>} - Objet avec tous les compteurs
 */
export const getAllConsultationCounts = async () => {
  try {
    const { data, error } = await supabase
      .from('consultation_counts')
      .select('profession_id, count')
      .order('count', { ascending: false });
    
    if (error) {
      console.error('Erreur récupération tous compteurs:', error);
      return {};
    }
    
    // Convertir en objet
    const counts = {};
    data.forEach(row => {
      counts[row.profession_id] = row.count;
    });
    
    return counts;
  } catch (error) {
    console.error('Erreur getAllConsultationCounts:', error);
    // Fallback vers localStorage
    return JSON.parse(localStorage.getItem('consultationCounts') || '{}');
  }
};

/**
 * Test de connexion Supabase
 * @returns {Promise<boolean>} - true si connexion OK
 */
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('consultation_counts')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    console.log('✅ Connexion Supabase réussie!');
    return true;
  } catch (error) {
    console.error('❌ Erreur connexion Supabase:', error);
    return false;
  }
};

