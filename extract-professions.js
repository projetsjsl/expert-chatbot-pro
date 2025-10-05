// Script pour extraire tous les noms de métiers du fichier professionnalProfiles.js
const fs = require('fs');

// Lire le fichier
const content = fs.readFileSync('professionnalProfiles.js', 'utf8');

// Extraire tous les noms de métiers (clés d'objet)
const professionMatches = content.match(/^\s*([a-z_]+):\s*{/gm);

if (professionMatches) {
  const professions = professionMatches.map(match => {
    const keyMatch = match.match(/^\s*([a-z_]+):/);
    return keyMatch ? keyMatch[1] : null;
  }).filter(Boolean);

  console.log(`Nombre total de métiers: ${professions.length}`);
  console.log('\nListe des métiers:');
  professions.forEach((profession, index) => {
    console.log(`${index + 1}. ${profession}`);
  });

  // Sauvegarder dans un fichier JSON
  fs.writeFileSync('professions-list.json', JSON.stringify(professions, null, 2));
  console.log('\nListe sauvegardée dans professions-list.json');
} else {
  console.log('Aucun métier trouvé');
}

