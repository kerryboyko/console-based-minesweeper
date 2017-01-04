import _ from 'lodash';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import {parseEntry, alphaDict} from '../src/parser';

import {
  markMinefield,
  layMinefield,
  createMinefield,
  findNeighbors,
} from '../src/board';

let testField = layMinefield("G7");
console.log("TestField");
testField.forEach((row) => console.log(row));
let testMap = markMinefield(testField);
console.log("TestMap");
testMap.forEach((row) => console.log(row));

describe('layMinefield()', function(){
  it('lays a minefield 10x10 matrix', function(){
    expect(testField).to.be.an("Array");
    expect(testField.length).to.equal(10);
    testField.forEach((row) => {
      expect(row).to.be.an("Array");
      expect(row.length).to.equal(10);
    })
  })
  it('never creates a mine at the initial dig', function(done){
    // tests 1000 boards; 10 at each position.
    const pFields = () => new Promise(function(resolve, reject) {
      let result = [];
      let letters = "abcdefghij".split('');
      let numbers = "0123456789".split('');
      let allSquares = letters.reduce((pv, letter) => {
        return pv.concat(numbers.map((number) => letter + number.toString()))
      }, [])
      allSquares.forEach((combo) => {
        let square = parseEntry(combo);
        for(let i = 0; i < 10; i++){
          let field = layMinefield(combo);
          result.push(field[Math.floor(square/10)][square % 10])
        }
      })
      resolve(result);
    });
    expect(pFields()
      .then((result) => result.every((test) => test !== "*")))
      .to.eventually.equal(true)
      .notify(done);
  })
})

describe('markMinefield()', function() {
  const numberDict = _.invert(alphaDict);
  it('correctly marks the minefield', function(){
    // test 100 times with 100 random seeds;
    for(let k = 0; k < 100; k++){
      let initDig = Math.floor(Math.random() * 10).toString() + numberDict[Math.floor(Math.random() * 10)];
      let minefield = markMinefield(layMinefield(initDig));
      for (let i = 0; i < 10; i++){
        for(let j = 0; j < 10; j++){
          if(minefield[i][j] !== '*'){
            let mineCount = parseInt(minefield[i][j])
            let north = ((i > 0) && minefield[i - 1][j] === "*") ? 1 : 0;
            let south = ((i < 9) && minefield[i + 1][j] === "*") ? 1 : 0;
            let west = ((j > 0) && minefield[i][j - 1] === "*") ? 1 : 0;
            let east = ((j < 9) && minefield[i][j + 1] === "*") ? 1 : 0;
            let northwest = ((i > 0) && (j > 0) && minefield[i-1][j-1] === "*") ? 1 : 0;
            let northeast = ((i > 0) && (j < 9) && minefield[i-1][j+1] === "*") ? 1 : 0;
            let southwest = ((i < 9) && (j > 0) && minefield[i+1][j-1] === "*") ? 1 : 0;
            let southeast = ((i < 9) && (j < 9) && minefield[i+1][j+1] === "*") ? 1 : 0;
            expect(mineCount).to.equal(north + south + west + east + northwest + northeast + southwest + southeast);
          }
        }
      }
    }
  })
})

describe('findNeighbors()', function(){
  it('gets all the spaces around the dig spot', function(){
    expect(findNeighbors("C4").sort()).to.eql(["B3", "B4", "B5", "C3", "C5", "D3", "D4", "D5"].sort())
  })
  it('gets all the spaces around the dig spot accounting for walls', function(){
    expect(findNeighbors("A0").sort()).to.eql(["A1", "B0", "B1"].sort())
  })
  it('gets all the spaces around the dig spot accounting for walls', function(){
    expect(findNeighbors("J9").sort()).to.eql(["I8", "I9", "J8"].sort())
  })

})
