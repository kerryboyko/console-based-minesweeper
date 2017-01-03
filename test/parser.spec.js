import _ from 'lodash';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import {
  parseEntry,
  isValidLetter,
} from '../src/parser';

describe('isValidLetter()', function(){
  const testString = (str) => str.split('').map((char) => isValidLetter(char));
  it('should tell you whether something is a valid letter', function(){
    expect(_.every(testString("abcdefghijABCDEFGHIJ"))).to.equal(true);
  })
  it('should tell you whether your entry is invalid', function(){
    expect(_.every(testString("1234567890kLmNoPqRsT").map((el) => !el))).to.equal(true);
  })
})

describe('parseEntry()', function(){
  it('should make a number from a battleship code "D4"', function(){
    expect(parseEntry("D4")).to.equal(43);
  })
  it('should make a number from a battleship code "4D"', function(){
    expect(parseEntry("4D")).to.equal(43);
  })
  it('should handle lowercase like "e7"', function(){
    expect(parseEntry('e7')).to.equal(74);
  })
  it('should handle lowercase like "7e"', function(){
    expect(parseEntry('7e')).to.equal(74);
  })
  it('should not make a number from an out of bounds battleship code', function(){
    expect(parseEntry("9Q")).to.equal(false);
  })
  it('should not take two numbers', function(){
    expect(parseEntry("11")).to.equal(false);
  })
  it('should not take two letters', function(){
    expect(parseEntry("AA")).to.equal(false);
  })
  it('should not take empty or incomplete entries', function(){
    expect(parseEntry("4")).to.equal(false);
    expect(parseEntry("")).to.equal(false);
    expect(parseEntry(" C")).to.equal(false);
  })
  it('should cut down longer entries', function(){
    expect(parseEntry("A4andThisIsIrrelevant")).to.equal(40);
  })
})
