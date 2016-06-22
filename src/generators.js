var _ = require('lodash');
var automata = {};
exports.automata = automata;

automata.dfaGenerator = function(tuple){
	return function(string){
		var symbols = string.split('');
		var transitioner = transitionerForDfa(tuple.transitionFunction);
		var finalState = symbols.reduce(transitioner,tuple.startState);
		return _.includes(tuple.finalStates,finalState);
	}
}

var transitionerForDfa=function(transitionTable) {
	return function(state,symbol) {
		return transitionTable[state] && transitionTable[state][symbol];
	}
}

automata.nfaGenerator = function(tuple){
	return function(string){
		var symbols = string.split('');
		var startStateWithEpsilons = getEpsilonStates(tuple.transitionFunction,[tuple.startState]);
		var stateReducer = nfaReducer(tuple.transitionFunction);
		var finalStates = symbols.reduce(stateReducer,startStateWithEpsilons);
		return !(_.isEmpty(_.intersection(tuple.finalStates,finalStates)));
	}
}

var nfaReducer = function(transitionTable){
	return function(states,symbol){
		var transitioner = getStateTransition(transitionTable,symbol);
		var nextState = _.compact(_.flattenDeep(states.map(transitioner)));
		return nextState && getEpsilonStates(transitionTable,nextState);
	}
}

var getEpsilonStates = function(transitionTable,startState){
	var transitioner = getStateTransition(transitionTable, "e");
	var epsilonStates = startState.map(transitioner);
	epsilonStates = _.compact(_.flattenDeep(epsilonStates));
	if(_.isEmpty(_.difference(epsilonStates,startState)))
		return startState;
	return _.flattenDeep(getEpsilonStates(transitionTable,_.union(startState,epsilonStates)));
}

var getStateTransition = function(transitionTable,symbol){
	return function(state){
		return transitionTable[state] && transitionTable[state][symbol];
	}
};

//nfa to dfa convertor

automata.nfaToDfa = function(tuple){
	var dfaTuple = getTupleForDfa(tuple);
	return automata.dfaGenerator(dfaTuple);
}

var getTupleForDfa = function(tuple){
		var states = getAllStates(sortStates(tuple.setOfStates));
		return generateTupleForDfa(tuple,states,{});
}

var getTransitionTableForDfa = function(tuple,transitionTableForDfa,states){
	_.forEach(states,function(state){
		var sortedState = sortStates(state).join('');
		transitionTableForDfa[sortedState] = generateTransitionTable(tuple,transitionTableForDfa,state,{});
	});
	return  transitionTableForDfa;
}

var getStates = function(states){
	return states.map(function(state){
		return state.join('')
	})
}

var getAllStates = function (setOfState) {
    var setOfStatesForDfa = [];
    for( var state = 1; state < 1<<setOfState.length; ++state ) {
      var newState = setOfState.filter(stateFilter(state));
    	setOfStatesForDfa.push(newState);
    }
    return setOfStatesForDfa;
}

var stateFilter = function(stateIndex){
	return function(state,index){
		return stateIndex>>index & 1;
	}
}

var getFinalStates = function(allStates,finalStates){
	var finalState = _.filter(allStates,function(state){
		return _.intersection(state,finalStates).length > 0;
	});
	return getStates(finalState);
}

var generateTransitionTable = function(tuple,transitionTableForDfa,states,transitions){
	_.forEach(tuple.alphabetSet,function(alphabet){
		var values = _.map(states,function(state){
			return getTransitonValues(tuple,state,alphabet);
		});
		transitions[alphabet] = sortStates(values).join('');
	})
	return transitions;
}

var getTransitonValues = function(tuple,state,alphabet){
	var startStateWithEpsilons = getEpsilonStates(tuple.transitionFunction,[state]);
	var stateReducer = nfaReducer(tuple.transitionFunction);
	return [alphabet].reduce(stateReducer,startStateWithEpsilons);
}

var generateTupleForDfa = function(tuple,states,tupleForDfa){
	tupleForDfa.startState = sortStates(getEpsilonStates(tuple.transitionFunction,[tuple.startState])).join('');
	tupleForDfa.transitionFunction = getTransitionTableForDfa(tuple,{},states);
	tupleForDfa.finalStates = getFinalStates(states,tuple.finalStates);
	tupleForDfa.alphabetSet = tuple.alphabetSet;
	tupleForDfa.setOfStates = getStates(states);
	return tupleForDfa;
}

var sortStates = function(states){
	return _.uniq(_.flattenDeep(states)).sort(function(x,y){
		return x.length - y.length | x > y;
	});
}
