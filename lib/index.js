'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _readline = require('readline');

var _readline2 = _interopRequireDefault(_readline);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rl = _readline2.default.createInterface({
  input: process.stdin,
  output: process.stdout
});

var alphaDict = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
  I: 8,
  J: 9
};

// turns a Battleship code into a number from 0 - 99.
var parseEntry = function parseEntry(code) {
  // TODO: Error handling;
  codeArray = str.split('');
  var tens = Number.isInteger(codeArray[0]) ? codeArray[0] * 10 : codeArray[1] * 10;
  var ones = alphaDict[Number.isInteger(codeArray[0]) ? codeArray[1] : codeArray[0]];
  return tens + ones;
};

var Board = function Board(firstDig) {
  // TODO: Typecheck / input sanitize.
  this.board = _lodash2.default.fill(Array(100), 0);
};

var introText = ['MINESWEEPER', '-------------------------', 'Hello, welcome to Minesweeper for the Node Console.', 'The grid is 10 x 10, and there are 20 bombs.', 'To dig, at the prompt, type the letter "D" then press Enter', 'It will then ask you which square you want to dig.', 'Choose the square by choosing the row number and column letter', 'If the square contains no bomb, the number of bombs adjacent to that square will be revealed', 'If the there are no bombs around that square, then more squares may be dug automatically', 'If you wish to mark a square as a bomb, type the letter "M" then press Enter', 'Choose the square by choosing the row number and column letter', 'If you manage to mark all 20 bombs, you win.', 'Don\'t worry. The first dig is never a bomb.  Good luck.', '-----------------------------'];

var playIntro = function playIntro() {
  return new Promise(function (resolve, reject) {
    var iterIntro = function iterIntro(num) {
      if (num < introText.length) {
        console.log(introText[num]);
        setTimeout(function () {
          iterIntro(num + 1);
        }, 500);
      } else {
        resolve();
      }
    };
    iterIntro(0);
  });
};

playIntro().then(function () {

  rl.question('This is the first prompt', function (answer) {
    // TODO: Log the answer in a database
    console.log('Thank you for your valuable feedback: ' + answer);

    rl.close();
  });
});