
// Uses comma seperated string to extract additives to an array
function extractAdditives(inputString) {
    const additives = inputString?.split(',')?.map(item => {
      const [code,name] = item.trim()?.split('=');
      return {code: code.toLowerCase(), name};
    });
    return additives;
}
// Uses comma seperated string to extract codes (for filtering)
function extractAdditiveCodes(inputString) {
  if(!inputString) return [];
  const codes = inputString?.split(',')?.map(item => item.trim().toLowerCase());
  return codes;
}

// Deprecated!!!
function additiveFromString(additiveTitleArray) {
  // Accept either an array of strings or a single string
  if (!Array.isArray(additiveTitleArray)) {
    additiveTitleArray = additiveTitleArray ? [additiveTitleArray] : [];
  }

  const regex = /\(([^)]+)\)/g;
  return additiveTitleArray.map(part => {
    if (!part) return [];
    const matches = [...part.matchAll(regex)];
    const additives = [];
    for (const match of matches) {
      const additiveString = match[1];
      const additiveCodes = additiveString
        .split(',')
        .map(code => code.trim().toLowerCase())
        .filter(token => /^[0-9a-z]+$/.test(token));
      additives.push(...additiveCodes);
    }
    return additives;
  });
}

export { extractAdditives,extractAdditiveCodes, additiveFromString }