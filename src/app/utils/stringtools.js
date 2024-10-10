function extractDifferences(string1, string2) {
    const words1 = string1.split(' ');
    const words2 = string2.split(' ');
    const differences = [];
    let i = 0, j = 0;

    while (i < words1.length && j < words2.length) {
        if (words1[i] === words2[j]) {
            i++;
            j++;
        } else {
            const match = words1[i].match(/\((.*?)\)/);
            if (match) {
                differences.push(match[1]); // Extract content inside parentheses
            }
            i++;
        }
    }

    // Check for any remaining words in string1
    while (i < words1.length) {
        const match = words1[i].match(/\((.*?)\)/);
        if (match) {
            differences.push(match[1]); // Extract content inside parentheses
        }
        i++;
    }

    // Join the differences and remove all spaces
    return differences.join(',').replace(/\s+/g, '');
}

export { extractDifferences }