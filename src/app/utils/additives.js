
// Uses comma seperated string to extract additives to an array
function extractAdditives(inputString) {
    const additives = inputString.split(',').map(item => {
      const [code,name] = item.trim().split('=');
      return {code: code.toLowerCase(), name};
    });
    return additives;
}
// Uses comma seperated string to extract codes (for filtering)
function extractAdditiveCodes(inputString) {
  if(!inputString) return [];
  const codes = inputString.split(',').map(item => item.trim().toLowerCase());
  return codes;
}

function extractAlternativeVersion() {

}

export { extractAdditives,extractAdditiveCodes, extractAlternativeVersion }