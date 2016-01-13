import Ember from 'ember';

export function plus(params) {
	const parsedNum = parseInt(params[0]),
		parsedToAdd = parseInt(params[1]);
	return (!isNaN(parsedNum) && !isNaN(parsedToAdd)) ? (parsedNum + parsedToAdd) : params[0];
}

export default Ember.Helper.helper(plus);
