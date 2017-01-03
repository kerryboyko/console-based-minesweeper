import _ from 'lodash';
import {parseEntry} from './parser';

let ice = _.chunk(_.fill(Array(100), "?"), 10);

const knuthShuffler = (array) => {
  for(let i = 0; i < array.length; i++){
    let rand = Math.floor(Math.random() * array.length);
    let temp = array[i];
    array[i] = array[rand];
    array[rand] = temp;
  }
  return array;
}

export const markMinefield = (minefield) => {
  // minefield is a matrix.
  for(let i = 0; i < minefield.length; i++){
    for(let j = 0; j < minefield[i].length; j++){
      if(minefield[i][j] !== '*'){
        let north = ((i > 0) && minefield[i - 1][j] === "*") ? 1 : 0;
        let south = ((i < 9) && minefield[i + 1][j] === "*") ? 1 : 0;
        let west = ((j > 0) && minefield[i][j - 1] === "*") ? 1 : 0;
        let east = ((j < 9) && minefield[i][j + 1] === "*") ? 1 : 0;
        let northwest = ((i > 0) && (j > 0) && minefield[i-1][j-1] === "*") ? 1 : 0;
        let northeast = ((i > 0) && (j < 9) && minefield[i-1][j+1] === "*") ? 1 : 0;
        let southwest = ((i < 9) && (j > 0) && minefield[i+1][j-1] === "*") ? 1 : 0;
        let southeast = ((i > 9) && (j > 9) && minefield[i+1][j+1] === "*") ? 1 : 0;
        minefield[i][j] = (north + south + west + east + northwest + northeast + southwest + southeast).toString();
      }
    }
  }
  return minefield;
}

export const layMinefield = (initialDig) => {
  // create an array with 20 mines and 79 empties;
  let mines = _.fill(Array(20), "*");
  let blanks = _.fill(Array(79), " ");
  let minefield = knuthShuffler(mines.concat(blanks));
  let firstGuess = parseEntry(initialDig);
  minefield = minefield.slice(0, firstGuess).concat(" ").concat(minefield.slice(firstGuess));
  // we now have a minefield where the first guess is guaranteed to be clear.
  minefield = _.chunk(minefield, 10)
  // minefield is now a matrix and not a linear array.
  return minefield;
}


export const createMinefield = (initialDig) => markMinefield(layMinefield(intialDig));

export const dig = (minefield, oldIce, digSpot) => {
  let digNum = parseEntry(digSpot);
  let rowI = Math.floor(digNum/10);
  let colI = digNum % 10;
  if (oldIce[rowI][colI] !== "?" || oldIce[rowI][colI] !== 'M'){
    return oldIce;
  }
  if (minefield[rowI][colI] === "*"){
    console.log("BOOM!");
    console.log("Game Over");
    minefield.forEach((row) => console.log(row));
  } else {
    oldIce[rowI][colI] === minefield[rowI][colI];
    if(minefield[rowI][colI] === )
//LEFT OFF HERE  }
}
