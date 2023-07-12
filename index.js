const { readFile } = require('fs/promises');
// const wordlist = 'wordlists/yawl5.txt';
const wordlist = 'wordlists/enable5.txt';
// const wordlist = 'wordlists/enable5_test.txt';

// notes on game rules
// guessing a word with a single X, where the answer has an X in the right spot, will  also show you whether there is another X in the answer
// guessing a word with a single X, where the answer has an X in the wrong spot, will *not* show you whether there is another X in the answer

// possible perf improvements:
// instead of starting at across 1 and down 1, should I start with across that has the most info?



// c r i s p
// h e n c e
// o v e r t
// r u p e e
// d e t e r

const possibleWords = new Set();
// squares are 2d array of letters
const initialSquare = [
    ["", "", "", "", "t"],
    ["", "", "", "e", ""],
    ["", "", "o", "r", ""],
    ["", "", "", "", ""],
    ["", "", "", "e", ""],
];

// letters that are IN each across word but not in the right place
const letterPatterns = [
    // [ /h/, /e/, /..[^e].[^h]/ ],
    [ /a/, /s/, /^[^as]....$/],
    [ /d/, /o/, /r/, /^.[^d][^o][^r].$/],
    [ /i/, /^..[^i]..$/],
    [ /e/, /n/, /r/, /^.[^n].[^er].$/],
    [ /d/, /e.*e/, /r/, /^.[^d].[^r].$/],
];

// letters that are NOT IN each word
const negativeLetterPatterns = [
//    [ /[wakmsch]/ ],
    [/[dieunor]/],
    [/[aiusnt]/, /e.*e/],
    [/[adeusnt]/],
    [/[adiusot]/],
    [/[aiusnot]/ ],
];

const thereAreNone = /u/;

const go = async () => {
    const allWords = (await readFile(wordlist, {encoding: 'utf8'})).split("\n");
    const words = allWords.filter(word => !word.match(thereAreNone));

    // index could be calculated instead of passed in, but that's computation time
    // across 1, down 1, across 2, down 2... etc
    const recurse = (square, isHorizontal, index) => {

        //  if (index === 0 && isHorizontal) {
            // console.log(`${Array(index+1).join(" ")}${index} / ${isHorizontal} / ${square[0].join("")}`);
        //  }

        // success case
        // if (isHorizontal && index >= 4) {
        if (isHorizontal && index < 0) {
            // you found one!
            console.log("winner winner", square);

            square.forEach(word => {
                possibleWords.add(word.join(""));
            });

            return;
        }
       
        const squareCopy = [
            [...square[0]],
            [...square[1]],
            [...square[2]],
            [...square[3]],
            [...square[4]],
        ];

        // get list of possible words for this direction/index
        var letters;
        if (isHorizontal) {
            letters = squareCopy[index];
        }
        else {
            letters = [
                squareCopy[0][index],
                squareCopy[1][index],
                squareCopy[2][index],
                squareCopy[3][index],
                squareCopy[4][index]
            ];
        }

        const pattern = letters.map(letter => letter ? letter : ".").join("")
        const regex = new RegExp(`^${pattern}$`);

        // loop through possibilities
        words.forEach(word => {
            if (
                word.match(regex) &&
                (!isHorizontal || letterPatterns[index].every(pattern => word.match(pattern))) &&
                (!isHorizontal || !negativeLetterPatterns[index].some(pattern => word.match(pattern)))
            ) {
                // this word still works. go deeper.

                const wordLetters = word.split("");
                // create new square
                if (isHorizontal) {
                    squareCopy[index] = [...wordLetters]
                }
                else {
                    squareCopy[0][index] = wordLetters[0];
                    squareCopy[1][index] = wordLetters[1];
                    squareCopy[2][index] = wordLetters[2];
                    squareCopy[3][index] = wordLetters[3];
                    squareCopy[4][index] = wordLetters[4];
                }

                // recurse(squareCopy, !isHorizontal, index + (isHorizontal ? 0 : 1));
                recurse(squareCopy, !isHorizontal, index - (isHorizontal ? 0 : 1));
            }
        })

    }

    // recurse(initialSquare, true, 0);
    recurse(initialSquare, true, 4);

    // console.log(possibleWords);
}

go();
