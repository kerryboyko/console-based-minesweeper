import _ from 'lodash';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

const MINES = [
  [ '*', '2', '*', '*', '*', '*', '*', '2', '*', '2' ],
  [ '2', '3', '3', '4', '4', '3', '2', '3', '3', '*' ],
  [ '*', '2', '1', '*', '1', '0', '0', '1', '*', '2' ],
  [ '*', '2', '1', '1', '1', '0', '1', '3', '3', '2' ],
  [ '2', '2', '1', '0', '0', '1', '2', '*', '*', '1' ],
  [ '1', '*', '1', '0', '0', '1', '*', '3', '2', '1' ],
  [ '1', '1', '2', '1', '1', '1', '1', '2', '1', '1' ],
  [ '0', '0', '1', '*', '1', '0', '0', '2', '*', '2' ],
  [ '0', '0', '2', '2', '2', '0', '0', '2', '*', '2' ],
  [ '0', '0', '1', '*', '1', '0', '0', '1', '1', '1' ],
]

const ICE = [
  [ '?', '?', '?', '?', '?', '?', '?', '?', '?', '?' ],
  [ '?', '?', '?', '?', '?', '?', '?', '?', '?', '?' ],
  [ '?', '?', '?', '?', '?', '?', '?', '?', '?', '?' ],
  [ '?', '?', '?', '?', '?', '?', '?', '?', '?', '?' ],
  [ '?', '?', '?', '?', '?', '?', '?', '?', '?', '?' ],
  [ '?', '?', '?', '?', '?', '?', '?', '?', '?', '?' ],
  [ '?', '?', '?', '?', '?', '?', '?', '?', '?', '?' ],
  [ '?', '?', '?', '?', '?', '?', '?', '?', '?', '?' ],
  [ '?', '?', '?', '?', '?', '?', '?', '?', '?', '?' ],
  [ '?', '?', '?', '?', '?', '?', '?', '?', '?', '?' ],
]

import {parseEntry, alphaDict} from '../src/parser';

import {
  markMinefield,
  layMinefield,
  createMinefield,
  findNeighbors,
  dig,
  createIce,
  flagMinefield,
  checkVictory,
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

describe('createIce()', function(){
  it('creates an icefield matrix', function(){
    let iceField = createIce();
    expect(iceField).to.have.length(10);
    iceField.forEach((row) => {
      expect(row).to.have.length(10);
      row.forEach((el) => {
        expect(el).to.equal('?');
      })
    })
  })
})

describe('dig()', function(){
  it('digs a square', function(){
    let postDig = dig(MINES, ICE, "B2");
    expect(postDig[2]).to.eql([
      "?", "2", "?", "?", "?", "?", "?", "?", "?", "?",
    ])
  })
  it('blows up when you dig a mine', function(){
    expect(dig(MINES, ICE, "C0")).to.eql(MINES)
  })
  it('expands when you hit a free square', function(){
    expect(dig(MINES, ICE, "D4")).to.eql([
      [ '?', '?', '?', '?', '?', '?', '?', '?', '?', '?' ],
      [ '?', '?', '?', '?', '4', '3', '2', '3', '?', '?' ],
      [ '?', '?', '?', '?', '1', '0', '0', '1', '?', '?' ],
      [ '?', '?', '1', '1', '1', '0', '1', '3', '?', '?' ],
      [ '?', '?', '1', '0', '0', '1', '2', '?', '?', '?' ],
      [ '?', '?', '1', '0', '0', '1', '?', '?', '?', '?' ],
      [ '?', '?', '2', '1', '1', '1', '?', '?', '?', '?' ],
      [ '?', '?', '?', '?', '?', '?', '?', '?', '?', '?' ],
      [ '?', '?', '?', '?', '?', '?', '?', '?', '?', '?' ],
      [ '?', '?', '?', '?', '?', '?', '?', '?', '?', '?' ] ]
    );
  })
})

describe('flagMinefield()', function(){
  it('adds a flag', function(){
    let experiment = flagMinefield(ICE, "C3");
    let expected = ICE.slice(0, 3).concat([[
      "?", "?", "M", "?", "?", "?", "?", "?", "?", "?",
    ]]).concat(ICE.slice(4))
    expect(flagMinefield(ICE, "C3")).to.eql(expected)
  })
  it('removes a flag', function(){
    expect(flagMinefield(flagMinefield(ICE, "C3"), "C3")).to.eql(ICE);
  })
})

describe('checkVictory()', function() {
    it('returns false if there aren\'t enough flags', function() {
        expect(checkVictory(MINES, ICE.slice(2).concat([
            [
                'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M',
            ],
            [
                '?', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M',
            ]
        ]))).to.equal(false);
    })
    it('returns false if there are too many flags', function() {
        expect(checkVictory(MINES, ICE.slice(3).concat([
            [
                'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M',
            ],
            [
                '?', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M',
            ],
            [
                '?', '?', '?', '?', '?', '?', '?', '?', 'M', 'M',
            ]
        ]))).to.equal(false);
    })
    it('returns false ', function() {
        expect(checkVictory(MINES, ICE.slice(3).concat([
            [
                'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M',
            ],
            [
                '?', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M',
            ],
            [
                '?', '?', '?', '?', '?', '?', '?', '?', 'M', 'M',
            ]
        ]))).to.equal(false);
    })
    it('returns true for a winning victory condition', function(){
      let mineClear = MINES.map((row) => row.map((square) => square === "*" ? "M" : square));
      expect(checkVictory(MINES, mineClear)).to.equal(true);
    })
})
