const { readFile } = require('fs/promises');
const wordlist = 'wordlists/enable5.txt';

// This is just dumb brute force. 

//const knownInfo = [
    //{
        //correctLetters: [".",".",".",".","."],
        //incorrectLetters: ["r", "s", "i"],
        //badLetters: ["a", "g", "l", "y", "m"]
    //},
    //{
        //correctLetters: [".","e","n",".","."],
        //incorrectLetters: ["e", "h"],
        //badLetters: ["a", "g", "l", "y", "m"]
    //},
    //{
        //correctLetters: [".",".",".",".","."],
        //incorrectLetters: ["r", "e", "o", "t"],
        //badLetters: ["a", "g", "l", "y", "m","i","s","h","n","u"]
    //},
    //{
        //correctLetters: ["r",".",".",".","."],
        //incorrectLetters: ["e", "u"],
        //badLetters: ["a", "g", "l", "y", "m","i","o","s","h","n"]
    //},
    //{
        //correctLetters: [".","e",".",".","."],
        //incorrectLetters: ["r","e","d","t"],
        //badLetters: ["a", "g", "l", "y", "m","u","i","o","s","h","n"]
    //},
// ];

// c r i s p
// h e n c e
// o v e r t
// r u p e e
// d e t e r


const guessedLetters = [];
const knownInfo = [
    {
        correctLetters: [".",".",".",".","."],
        incorrectLetters: [],
    },
    {
        correctLetters: [".",".",".",".","."],
        incorrectLetters: [],
    },
    {
        correctLetters: [".",".",".",".","."],
        incorrectLetters: [],
    },
    {
        correctLetters: [".",".",".",".","."],
        incorrectLetters: [],
    },
    {
        correctLetters: [".",".",".",".","."],
        incorrectLetters: [],
    },
];

const possibleAnswers = [
    [],
    [],
    [],
    [],
    [],
];

const wordMatchesInfo = (word, info) => {
    return (
        word.match(new RegExp(info.correctLetters.join(""))) &&
        info.incorrectLetters.every(letter => word.includes(letter)) &&
        // !word.match(new RegExp(`[${info.badLetters.join("")}]`))
    );
}

const getVerticalWords = (words) => {

    const verticalWords = [ "", "", "", "", "" ];

    const wordAarray2D = words.map(word => {
        return word.split("");
    })

    wordAarray2D.forEach(word => {
        word.forEach((letter, index) => {
            verticalWords[index] += letter;
        })
    })

    return verticalWords;
}

const go = async () => {
    const words = (await readFile(wordlist, {encoding: 'utf8'})).split("\n");

    words.forEach(word => {
        knownInfo.forEach((info, index) => {
            // console.log(`checking ${word} against ${info.correctLetters.join("")}`)
            if (wordMatchesInfo(word, info)) {
                possibleAnswers[index].push(word);
            }
        })
    })

    // console.log("possible answers for word 1: ", possibleAnswers[0])

    possibleAnswers[0].forEach((word1, i1) => {
        console.log(`word1 loop: ${i1}/${possibleAnswers[0].length}`)
        possibleAnswers[1].forEach((word2, i2) => {
            // console.log(`word2 loop: ${i2}/${possibleAnswers[1].length}`)
            possibleAnswers[2].forEach((word3, i3) => {
                // console.log(`word3 loop: ${i3}/${possibleAnswers[2].length}`)
                possibleAnswers[3].forEach((word4, i4) => {
                    // console.log(`word4 loop: ${i4}/${possibleAnswers[3].length}`)
                    possibleAnswers[4].forEach((word5, i5) => {
                        // console.log(`word5 loop: ${i5}/${possibleAnswers[4].length}`)
                        const verticalWords = getVerticalWords([word1, word2, word3, word4, word5])
                        const verticalsAreValid = verticalWords.every(verticalWord => {
                            return words.includes(verticalWord);
                        });

                        if (verticalsAreValid) {
                            console.log("found valid arrangement:")
                            console.log(` ${word1}`);
                            console.log(` ${word2}`);
                            console.log(` ${word3}`);
                            console.log(` ${word4}`);
                            console.log(` ${word5}`);
                        }
                    })
                })
            })
        })
    })


    // console.log(possibleAnswers);
}

go();
