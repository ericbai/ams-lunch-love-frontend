import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params) {
		console.log('CONFIRM ROUTE');
		console.log(params);
		if (Ember.isNone(params.token)) {
			this.transitionTo('user');
		} else {
			return params;
		}
	},
	actions: {
		error: function(err) {
			this.transitionTo('confirm');
			this.render('confirm/error', {
				into: 'confirm'
			});
			return false;
		}
	}
});
