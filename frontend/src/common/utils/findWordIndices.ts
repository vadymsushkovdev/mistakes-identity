export function findWordIndices(inputString: string, word: string) {
    const wordIndices = [];
    let startIndex = 0;

    while (startIndex < inputString.length) {
        const wordIndex = inputString.indexOf(word, startIndex);

        if (wordIndex === -1) {
            break;
        }

        const endIndex = wordIndex + word.length - 1;
        wordIndices.push({startIndex: wordIndex, endIndex: endIndex});

        startIndex = wordIndex + 1;
    }

    return wordIndices;
}