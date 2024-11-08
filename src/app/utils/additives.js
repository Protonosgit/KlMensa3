const additiveMap = {
    'la': 'Laktose',
    'gl': 'Gluten',
    'g': 'Geflügel',
    '1': 'Farbstoff',
    '2': 'Konservierungsstoff',
    '3': 'Antioxidationsmittel',
    '5': 'Geschwefelt',
    '8': 'Phosphat',
    '9': 'Süßungsmittel',
    'r': 'Rind',
    'l': 'Lamm',
    's': 'Schwein',
    'k': 'Kalb',
    'w': 'Wild',
    'fi': 'Fisch',
    'ei': 'Eier',
    'sl': 'Sellerie',
    'sf': 'Senf',
    'so': 'Soja',
    'a': 'Restalkohol',
    'nu': 'Schalenfrüchte',
    'sw': 'Schwefeldioxid',
    'se': 'Sesam',
};


function extractAdditives(inputString) {

    const regex = /\(([^)]+)\)/g;
  
    // Use a Set to store unique additives and avoid duplicates
    const additives = new Set();
  
    // Use a for loop to iterate over the matches
    for (const match of inputString.matchAll(regex)) {
      // Split contents of parentheses and add item to Set
      for (const item of match[1].split(',').map(item => item.trim().toLowerCase())) {
        additives.add(item);
      }
    }
  
    // Map additives to names
    return [...additives].map(additive => additiveMap[additive] || additive).filter(additive => additive !== additive.toLowerCase());
  }

export { extractAdditives }