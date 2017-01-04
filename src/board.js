import _ from 'lodash';
import {parseEntry, encodeEntry} from './parser';


const getRow = (num) => Math.floor(num/10);
const getCol = (num) => num % 10;


export const deepArrayCopy = (array) => array.map((el) => (Array.isArray(el) ? deepArrayCopy(el) : el) )
Array.prototype.deepCopy = function() {
    return(deepArrayCopy(this))
};

export const createIce = () => _.chunk(_.fill(Array(100), "?"), 10);

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
        let southeast = ((i < 9) && (j < 9) && minefield[i+1][j+1] === "*") ? 1 : 0;
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

export const findNeighbors = (digSpot) => {
  let digNum = parseEntry(digSpot);
  let rowI = Math.floor(digNum/10);
  let colI = digNum % 10;
  let rows = [rowI - 1, rowI, rowI + 1].filter((el) => el < 10 && el > -1);
  let cols = [colI - 1, colI, colI + 1].filter((el) => el < 10 && el > -1);
  return _.flatten(rows.map((row) => cols.map((col) => col + (row * 10))))
    .filter((el) => el !== digNum).map((el) => encodeEntry(el));
}

export const createMinefield = (initialDig) => markMinefield(layMinefield(intialDig));


// UNTESTED AS OF YET.
export const dig = (minefield, ice, digSpot) => {
  let newIce = ice.deepCopy();
  let rowI = getRow(parseEntry(digSpot));
  let colI = getCol(parseEntry(digSpot));
  if (newIce[rowI][colI] !== "?" && newIce[rowI][colI] !== 'M'){
    return newIce;
  }
  if (minefield[rowI][colI] === "*"){
    console.log("BOOM!");
    console.log("Game Over");
    minefield.forEach((row) => console.log(row));
    return minefield
  } else {
    newIce[rowI][colI] = minefield[rowI][colI];
    if(minefield[rowI][colI] === "0"){
      let neighbors = findNeighbors(digSpot);
      neighbors.forEach((neighbor) => {
        let iceSpot = newIce[getRow(parseEntry(neighbor))][getCol(parseEntry(neighbor))]
        if(iceSpot === '?' || iceSpot === 'M'){
          newIce = dig(minefield, newIce, neighbor);
        }
      })
    }
    return newIce;
  }
}

export const flagMinefield = (ice, flagSpot) => {
  let newIce = ice.deepCopy();
  let rowI = getRow(parseEntry(flagSpot));
  let colI = getCol(parseEntry(flagSpot));
  if (newIce[rowI][colI] === '?'){
    newIce[rowI][colI] = 'M';
  } else if (newIce[rowI][colI] === 'M') {
    newIce[rowI][colI] = '?'
  } else {
    console.log("You can't place a flag there. Please try again")
  }
  return newIce
}

// needs test
export const checkVictory = (minefield, ice) => {
  let flatIce = _.flatten(ice);
  let countFlags = flatIce.filter((el) => (el === 'M')).length;
  if (countFlags !== 20){
    return false;
  }
  if (countFlags === 20){
    let flatField = _.flatten(minefield);
    for (let i = 0; i < minefield.length; i++){
      if (flatField[i] === '*' && flatIce[i] !== 'M'){
        return false;
      }
    }
    return true;
  }
}
