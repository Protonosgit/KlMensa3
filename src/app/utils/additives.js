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
    'fi': 'Fisch',
    'ei': 'Eier',
    'sl': 'Sellerie',
    'sf': 'Senf',
    'so': 'Soja',
    'a': 'Restalkohol',
    'nu': 'Schalenfrüchte',
    'sw': 'Schwefeldioxid'
};

function extractAdditives(inputString) {
    // Regular expression to match content inside parentheses
    const regex = /\(([^)]+)\)/g;
    const matches = inputString.match(regex);

    if (!matches) return '';

    // Extract additives from matches
    const additives = matches.flatMap(match => 
        match.slice(1, -1).split(',').map(item => item.trim().toLowerCase())
    );

    // Remove duplicates
    const uniqueAdditives = [...new Set(additives)];

    // Map additives to their full names and filter out unmapped additives
    const mappedAdditives = uniqueAdditives
        .map(additive => additiveMap[additive] || additive)
        .filter(additive => additive !== additive.toLowerCase());

    // Join the additives with commas
    return mappedAdditives.join(', ');
}

export { extractAdditives }