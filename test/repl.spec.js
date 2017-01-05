import _ from 'lodash';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import {
  HELP,
  showHelp,
  display,
  Game,
} from '../src/repl';

import {
  MINES,
  ICE,
} from './board.spec';

class Konsole {
  constructor(){
    this.storage = [];
  }
  log (item) {
    this.storage.push(item)
  }
}

describe('showHelp()', function(){
  it('should show the help', function(){
    let k = new Konsole;
    showHelp(k);
    expect(k.storage).to.eql(HELP);
  })
})

describe('display()', function(){
  it('should display the matrix', function(){
    let k = new Konsole;
    display(ICE, k);
    expect(k.storage).to.eql([
      " |ABCDEFGHIJ",
      "-+----------",
      "0|??????????",
      "1|??????????",
      "2|??????????",
      "3|??????????",
      "4|??????????",
      "5|??????????",
      "6|??????????",
      "7|??????????",
      "8|??????????",
      "9|??????????",
    ])
  })
  it('should dislay the mines', function(){
    let k = new Konsole;
    display(MINES, k);
    expect(k.storage).to.eql([
      " |ABCDEFGHIJ",
      "-+----------",
      "0|*2*****2*2",
      "1|233443233*",
      "2|*21*1001*2",
      "3|*211101332",
      "4|2210012**1",
      "5|1*1001*321",
      "6|1121111211",
      "7|001*1002*2",
      "8|00222002*2",
      "9|001*100111",
    ])
  })
})
