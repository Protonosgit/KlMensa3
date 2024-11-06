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

// function extractAdditives(inputString) {
//     // Regular expression to match content inside parentheses
//     const regex = /\(([^)]+)\)/g;
//     const matches = inputString.match(regex);

//     if (!matches) return '';

//     // Extract additives from matches
//     const additives = matches.flatMap(match => 
//         match.slice(1, -1).split(',').map(item => item.trim().toLowerCase())
//     );

//     // Remove duplicates
//     const uniqueAdditives = [...new Set(additives)];

//     // Map additives to full names and filter out unmapped additives
//     const mappedAdditives = uniqueAdditives
//         .map(additive => additiveMap[additive] || additive)
//         .filter(additive => additive !== additive.toLowerCase());

//     return mappedAdditives;

//     // Join the additives with commas (deprecated)
//     return mappedAdditives.join(', ');
// }

function extractAdditives(inputString) {

    const regex = /\(([^)]+)\)/g;
  
    // Use a Set to store unique additives and avoid duplicates
    const additives = new Set();
  
    // Use a for...of loop to iterate over the matches
    for (const match of inputString.matchAll(regex)) {
      // Split the contents of the parentheses and add each item to the Set
      for (const item of match[1].split(',').map(item => item.trim().toLowerCase())) {
        additives.add(item);
      }
    }
  
    // Map the additives to their full names using the additiveMap object
    return [...additives].map(additive => additiveMap[additive] || additive).filter(additive => additive !== additive.toLowerCase());
  }

export { extractAdditives }