import _ from 'lodash';

export const alphaDict = {
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

const numDict = _.invert(alphaDict);

export const isValidLetter = (str) => ((str.length === 1) && str.match(/[a-j]/i));

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

export const encodeEntry = (number) => numDict[number % 10] + Math.floor(number / 10).toString()
