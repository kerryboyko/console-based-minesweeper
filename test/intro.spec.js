import _ from 'lodash';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import {
  introText,
  playIntro,
} from '../src/intro';

function MockConsole () {}
MockConsole.prototype = {
  record: [],
  log: function(item) {
    this.record.push(item);
  }
}

describe('playIntro', function(){
  const testString = (str) => str.split('').map((char) => isValidLetter(char));
  it('should play the Intro', function(done){
    this.timeout(10000); 
    let mock = new MockConsole();
    expect(playIntro(mock).then(() => mock.record)).to.eventually.eql(introText).notify(done);
  })
})
