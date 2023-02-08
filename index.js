const { readFile } = require('fs/promises');
const wordlist = 'wordlists/enable5.txt';
// const wordlist = 'wordlists/enable5_test.txt';


// square is a 2d array of letters
// [ 
//   [c,    r,    i,    s,    p],
//   [h,    e,    n,    c,    e],
//   [o, null, null, null, null],
//   [r, null, null, null, null],
//   [d, null, null, null, null],
// ]

// letters that are IN each across word but not in the right place
const letterPatterns = [
    [ /c/, /...[^c]./ ],
    [ /h/, /e/, /..[^e].[^h]/ ],
    [ /r/, /.[^r].../ ],
    [ /r/, /e/, /.[^r][^e]../ ],
    [ /r/, /e/, /.[^r][^e]../ ],
];

// letters that are NOT IN each word
const negativeLetterPatterns = [
   [ /[wakmhe]/ ],
   [ /[wakmrs]/ ],
   [ /[wakmshc]/ ],
   [ /[wakmsch]/ ],
   [ /[wakmsch]/ ],
]

const initialSquare = [
    ["", "r", "", "s", ""],
    ["", "", "", "c", ""],
    ["", "", "e", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
];

// c r i s p
// h e n c e
// o v e r t
// r u p e e
// d e t e r


const go = async () => {
    const words = (await readFile(wordlist, {encoding: 'utf8'})).split("\n");

    // index could be calculated instead of passed in, but that's computation time
    // across 1, down 1, across 2, down 2... etc
    const recurse = (square, isHorizontal, index) => {

        // if (index >= 4) {
            // console.log(`${Array(index+1).join(" ")}${index} / ${isHorizontal} / ${square}`);
        // }

        // success case
        if (isHorizontal && index >=5) {
            // you found one!
            console.log("winner winner", square);
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
        const regex = new RegExp(pattern);

        // loop through possibilities
        // TODO: this does not further restrict down words to known info
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

                //TODO: revisit 0 or 1 here
                recurse(squareCopy, !isHorizontal, index + (isHorizontal ? 0 : 1));
            }
        })

    }

    recurse(initialSquare, true, 0);
}

go();
