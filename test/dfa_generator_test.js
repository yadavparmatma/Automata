var assert = require('chai').assert;
var dfaGenerator = require("../src/generators.js").automata.dfaGenerator;

var touple = {
	"alphabetSet"	: ["0","1"],
	"startState"	: "q1",
	"finalStates"	: ["q2"],
	"setOfStates"	: ["q1","q2","q3"],
	"transitionFunction"	: {
		"q1" : {
			0:"q3",
			1:"q2"
		},
		"q2" : {
			0:"q2",
			1:"q2"
		},
		"q3" : {
			0:"q3",
			1:"q3"
		}
	}
};

describe('dfaGenerator tests', function(){
  var isFinalState = dfaGenerator(touple);

  it('should be Ok for 101', function(){
    assert.isOk(isFinalState('101'));
  });

  it('should be Ok for 10001', function(){
    assert.isOk(isFinalState('10001'));
  });

   it('should be Ok for 1101', function(){
    assert.isOk(isFinalState('100010'));
  });

  it('should be Ok for 01001', function(){
    assert.isNotOk(isFinalState('01001'));
  });

  it('should not be ok for 001', function(){
    assert.isNotOk(isFinalState('001'));
  });

  it('should return invalid for 102', function(){
    assert.isNotOk(isFinalState('102'));
  });
})

var toupleForOddNumberOffZero = {
  "alphabetSet" : ["0","1"],
  "startState"  : "q1",
  "finalStates" : ["q2"],
  "setOfStates" : ["q1","q2"],
  "transitionFunction"  : {
    "q1" : {
      0:"q2",
      1:"q1"
    },
    "q2" : {
      0:"q1",
      1:"q2"
    }
  }
};

describe('dfaGenerator tests', function(){
  var isFinalState = dfaGenerator(toupleForOddNumberOffZero);

  it('should be Ok for 0', function(){
    assert.isOk(isFinalState('0'));
  });

  it('should be Ok for 000', function(){
    assert.isOk(isFinalState('000'));
  });

  it('should not be Ok for 00', function(){
    assert.isNotOk(isFinalState('00'));
  });

  it('should be Ok for 100010', function(){
    assert.isNotOk(isFinalState('100010'));
  });

});
