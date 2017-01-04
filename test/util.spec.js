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

import {
  deepArrayCopy,
} from '../src/util';

describe('deepArrayCopy()', function(){
  it('copies an array deeply', function(){
    let source = deepArrayCopy(MINES);
    let experiment = deepArrayCopy(MINES);
    experiment = experiment.map((el) => "Foo");

    expect(source).to.eql(MINES);
    expect(experiment).to.eql(
      ["Foo", "Foo", "Foo", "Foo", "Foo", "Foo", "Foo", "Foo", "Foo", "Foo" ]
    )
  })
})
