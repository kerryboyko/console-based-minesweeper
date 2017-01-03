import _ from 'lodash';

import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const alphaDict = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
  I: 8,
  J: 9,
}

function isValidLetter(str) {
  return str.length === 1 && str.match(/[a-j]/i);
}

// turns a Battleship code into a number from 0 - 99.
export const parseEntry = (code) => {
  if (code.length < 2){
    return false;
  }
  if (code.length > 2){
    code = code.substr(0, 2);
  }
  if (isValidLetter(code.charAt(0)) && !isNaN(parseInt(code.charAt(1)))) {
    return alphaDict[code.charAt(0).toUpperCase()] + (code.charAt(1) * 10);
  } else if(isValidLetter(code.charAt(1)) && !isNaN(parseInt(code.charAt(0)))) {
    return alphaDict[code.charAt(1).toUpperCase()] + (code.charAt(0) * 10);
  } else {
    return false;
  }
}

const Board = function (firstDig) {
  // TODO: Typecheck / input sanitize.
  this.board = _.fill(Array(100), 0);

}


const introText = [
  'MINESWEEPER',
  '-------------------------',
  'Hello, welcome to Minesweeper for the Node Console.',
  'The grid is 10 x 10, and there are 20 bombs.',
  'To dig, at the prompt, type the letter "D" then press Enter',
  'It will then ask you which square you want to dig.',
  'Choose the square by choosing the row number and column letter',
  'If the square contains no bomb, the number of bombs adjacent to that square will be revealed',
  'If the there are no bombs around that square, then more squares may be dug automatically',
  'If you wish to mark a square as a bomb, type the letter "M" then press Enter',
  'Choose the square by choosing the row number and column letter',
  'If you manage to mark all 20 bombs, you win.',
  'Don\'t worry. The first dig is never a bomb.  Good luck.',
  '-----------------------------'
];

const playIntro = () => new Promise((resolve, reject) => {
  const iterIntro = (num) => {
    if(num < introText.length){
      console.log(introText[num]);
      setTimeout(() => {
        iterIntro(num + 1);
      }, 500)
    } else {
      resolve();
    }
  }
  iterIntro(0);
});

playIntro().then(() => {

  rl.question('This is the first prompt', (answer) => {
    // TODO: Log the answer in a database
    console.log(`Thank you for your valuable feedback: ${answer}`);

    rl.close();
  });

})
