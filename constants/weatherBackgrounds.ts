// Mapping des weathercode Open-Meteo vers des images de fond
// (À adapter selon les images que tu ajoutes dans /assets/images/)

export const weatherBackgrounds: Record<number, any> = {
  // Ciel clair
  0: require('../../assets/images/soleil.jpg'),

  // Principalement clair / Partiellement nuageux / Couvert
  1: require('../../assets/images/fond.jpg'),
  2: require('../../assets/images/fond.jpg'),
  3: require('../../assets/images/fond.jpg'),

  // Brouillard
  45: require('../../assets/images/brouillard.jpg'),
  48: require('../../assets/images/brouillard.jpg'),

  // Bruine légère / modérée / forte
  51: require('../../assets/images/bruine.jpg'),
  53: require('../../assets/images/bruine.jpg'),
  55: require('../../assets/images/bruine.jpg'),

  // Pluie légère / modérée / forte
  61: require('../../assets/images/pluie.jpg'),
  63: require('../../assets/images/pluie.jpg'),
  65: require('../../assets/images/pluie.jpg'),

  // Neige légère / modérée / forte
  71: require('../../assets/images/neige.jpg'),
  73: require('../../assets/images/neige.jpg'),
  75: require('../../assets/images/heavy_neige.jpg'),

  // Averses de pluie
  80: require('../../assets/images/showers.jpg'),
  81: require('../../assets/images/showers.jpg'),
  82: require('../../assets/images/showers.jpg'),

  // Averses de neige
  85: require('../../assets/images/neige.jpg'),
  86: require('../../assets/images/neige.jpg'),

  // Orages
  95: require('../../assets/images/orage.jpg'),
  96: require('../../assets/images/orage.jpg'),
  99: require('../../assets/images/orage.jpg'),
};
