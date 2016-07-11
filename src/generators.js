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
		var states = getAllStates(tuple.setOfStates.sort(sortByAsc()));
		return generateTupleForDfa(tuple,states);
}

var getTransitionTableForDfa = function(tuple,transitionTableForDfa,states){
	_.forEach(states,function(state){
		var sortedState = state.sort(sortByAsc()).join('');
		transitionTableForDfa[sortedState] = generateTransitionTable(tuple,transitionTableForDfa,state,{});
	});
	return  transitionTableForDfa;
}

var getStates = function(states){
	return states.map(function(state){
		return state.join('')
	})
}


var getAllStates = function(states){
  return _.reduce(states, reducer, [[]]);
}

var reducer = function(resultSet, element) {
    return _.map(resultSet, function(state){
        return state.concat(element);
    }).concat(resultSet);
};


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
		transitions[alphabet] = _.uniq(_.flattenDeep(values)).sort(sortByAsc()).join('');
	})
	return transitions;
}

var getTransitonValues = function(tuple,state,alphabet){
	var startStateWithEpsilons = getEpsilonStates(tuple.transitionFunction,[state]);
	var stateReducer = nfaReducer(tuple.transitionFunction);
	return [alphabet].reduce(stateReducer,startStateWithEpsilons);
}

var generateTupleForDfa = function(tuple,states){
	return {
				'alphabetSet' : tuple.alphabetSet,
				'setOfStates' : getStates(states),
				'finalStates' : getFinalStates(states,tuple.finalStates),
				'transitionFunction' : getTransitionTableForDfa(tuple,{},states),
				'startState'  : getEpsilonStates(tuple.transitionFunction,[tuple.startState]).sort(sortByAsc()).join('')
			}
}

var sortByAsc = function(){
	return function(x,y){
		return x.length - y.length | x > y;
	};
}
