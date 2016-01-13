import Ember from 'ember';
import ls from 'npm:local-storage';

export default Ember.Route.extend({
	beforeModel: function(transition) {
		this._super(transition);
		const jwt = ls.get('jwt');
		if (jwt) {
			this.transitionTo('dashboard');
		}
	},
	deactivate: function() {
		this.controller.setProperties({
			email: null,
			password: null,
			resetEmail: null
		});
	},
	actions: {
		sendPasswordReset: function(resetEmail) {

			return false;
		}
	}
});