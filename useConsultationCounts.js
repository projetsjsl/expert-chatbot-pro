import { useState, useEffect } from 'react';
import { getAllConsultationCounts, getConsultationCount, incrementConsultationCount } from './consultation-service.js';

/**
 * Hook personnalisé pour gérer les compteurs de consultations
 * @returns {Object} - Objet avec les compteurs et fonctions
 */
export const useConsultationCounts = () => {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  // Charger tous les compteurs au démarrage
  useEffect(() => {
    const loadCounts = async () => {
      try {
        const allCounts = await getAllConsultationCounts();
        setCounts(allCounts);
      } catch (error) {
        console.error('Erreur chargement compteurs:', error);
        // Fallback vers localStorage
        const localCounts = JSON.parse(localStorage.getItem('consultationCounts') || '{}');
        setCounts(localCounts);
      } finally {
        setLoading(false);
      }
    };

    loadCounts();
  }, []);

  // Fonction pour obtenir le compteur d'une profession
  const getCount = (professionId) => {
    return counts[professionId] || 0;
  };

  // Fonction pour incrémenter le compteur
  const incrementCount = async (professionId) => {
    try {
      const newCount = await incrementConsultationCount(professionId);
      setCounts(prev => ({
        ...prev,
        [professionId]: newCount
      }));
      return newCount;
    } catch (error) {
      console.error('Erreur incrémentation:', error);
      // Fallback local
      const newCount = (counts[professionId] || 0) + 1;
      setCounts(prev => ({
        ...prev,
        [professionId]: newCount
      }));
      return newCount;
    }
  };

  // Fonction pour recharger les compteurs
  const refreshCounts = async () => {
    setLoading(true);
    try {
      const allCounts = await getAllConsultationCounts();
      setCounts(allCounts);
    } catch (error) {
      console.error('Erreur rechargement compteurs:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    counts,
    loading,
    getCount,
    incrementCount,
    refreshCounts
  };
};

