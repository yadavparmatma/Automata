var assert = require('chai').assert;
var nfaGenerator = require("../src/generators.js").automata.nfaGenerator;

//It accepts any binary string that contains 00 or 11 as a substring.

var touple = {
	"alphabetSet"	: ["0","1","e"],
	"startState"	: ["q1"],
	"finalStates"	: ["q4"],
	"setOfStates"	: ["q1","q2","q3","q4"],
	"transitionFunction"	: {
		"q1" : {
			0:["q1","q2"],
			1:["q1","q3"]
		},
		"q2" : {
			0:["q4"],
			1:[]
		},
		"q3" : {
			0:[],
			1:["q4"]
		},
		"q4" : {
			0:["q4"],
			1:["q4"]
		}

	}
};


var toupleWithEpsilon = {
	"alphabetSet"	: ["0","1"],
	"startState"	: ["q1"],
	"finalStates"	: ["q4","q7"],
	"setOfStates"	: ["q1","q2","q3","q4","q5","q6","q7"],
	"transitionFunction"	: {
		"q1" : {
			"e":["q2","q5"],
			0:[],
			1:[]
		},
		"q2" : {
			0:[],
			1:["q3"]
		},
		"q3" : {
			0:[],
			1:["q4"]
		},
		"q4" : {
			0:["q4"],
			1:["q4"]
		},
		"q5" : {
			0:["q6"],
			1:[]
		},
		"q6" : {
			0:["q7"],
			1:[]
		},
		"q7" : {
			0:["q7"],
			1:["q7"]
		}

	}
};





describe('nfaGenerator tests', function(){
  var isFinalState = nfaGenerator(touple);

  it('should be Ok for 11', function(){
    assert.isOk(isFinalState('11'));
  });

  it('should not be Ok for 00', function(){
    assert.isOk(isFinalState('00'));
  });

  it('should be Ok for 1100', function(){
    assert.isOk(isFinalState('1100'));
  });

  it('should be NotOk for 10101', function(){
    assert.isNotOk(isFinalState('10101'));
  });

  it('should be Ok for 1010110', function(){
    assert.isOk(isFinalState('1010110'));
  });

  it('should be Ok for 101010101011', function(){
    assert.isOk(isFinalState('101010101011'));
  });
})

describe('nfaGenerator tests with epsilon', function(){

  var isFinalState = nfaGenerator(toupleWithEpsilon);

  it('should be ok with ebsilon for 1101', function(){
    assert.isOk(isFinalState('1101'));
  });

})


// Vijay's test for nfa with epsilon

var toupleForStringThatContainEvenNumberOfZerosOrOne = {
	"alphabetSet"	: [0,1],
	"startState"	: ["q1"],
	"finalStates"	: ["q4", "q2"],
	"setOfStates"	: ["q1","q2","q3","q4","q5"],
	"transitionFunction"	: {
		"q1" : {
			"e": ["q2", "q4"],
			0:[],
			1:[]
		},
		"q2" : {
			0:["q3"],
			1:["q2"]
		},
		"q3" : {
			0:["q2"],
			1:["q3"]
		},
		"q4" : {
			0:["q4"],
			1:["q5"]
		},
		"q5" : {
			0:["q5"],
			1:["q4"]
		}

	}
}
describe("string that has even number of zeros of one in middle", function(){
		var evenNumberInMiddle = nfaGenerator(toupleForStringThatContainEvenNumberOfZerosOrOne)
		it("should Pass for string that has for zeros in middle 100001", function(){
			assert.isOk(evenNumberInMiddle("100001"))
		})
		it("should fail for string that has for one in middle 1111000001", function(){
			assert.isNotOk(evenNumberInMiddle("1111000001"))
		})
		it("should pass for string that has for one in middle 00001", function(){
			assert.isOk(evenNumberInMiddle("00001"))
		})
	})

var toupleForEveryThing = {
	"setOfStates": ["q1", "q2", "q3"],
	"alphabetSet": [0,1],
	"transitionFunction":{
		"q1": {
			"e":["q2"],
			0: ["q1"],
			1: ["q2"]
		},
		"q2": {
			"e":["q3"],
			0: ["q1"],
			1: ["q2"]
		},
		"q3": {
			0: ["q3"],
			1: ["q3"]
		}
	},
	"startState": ["q1"],
	"finalStates": ["q3"]
}


var toupleForAnyNumberOfZeroFollowedByAnyNumberOffOne = {
	"setOfStates":["q1","q2"],
	"alphabetSet":["1","0"],
	"transitionFunction":{
		"q1":{
			"e":["q2"],
			"0":["q1"]
		},
		"q2":{
			"1":["q2"]
		}
	},
	"startState":["q1"],
	"finalStates":["q2"]
}

describe("string that except every thing", function(){
	var isFinalState = nfaGenerator(toupleForEveryThing);
	var isFinalStateForZero = nfaGenerator(toupleForAnyNumberOfZeroFollowedByAnyNumberOffOne);

	it("should pass for 111", function(){
		assert.isOk(isFinalState("11100"))
	})

	it("should pass for 101", function(){
		assert.isOk(isFinalState("1111100000"))
	})

	it("should pass for 00", function(){
		assert.isOk(isFinalStateForZero("00"))
	})

	it("should pass for empty", function(){
		assert.isOk(isFinalState(""))
	})
})
