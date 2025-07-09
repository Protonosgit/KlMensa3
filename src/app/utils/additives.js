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
    const additives = inputString.split(',').map(item => {
      const [code,name] = item.trim().split('=');
      return {code: code.toLowerCase(), name};
    });
    return additives;
}

  function extractAdditiveCodes(inputString) {
    if(!inputString) return [];
    const codes = inputString.split(',').map(item => item.trim().toLowerCase());
    return codes;
  }

export { extractAdditives,extractAdditiveCodes }