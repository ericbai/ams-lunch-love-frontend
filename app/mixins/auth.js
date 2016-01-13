import Ember from 'ember';
import ls from 'npm:local-storage';

export default Ember.Mixin.create({
	beforeModel: function(transition) {
		this._super(transition);
		const jwt = ls.get('jwt');
		if (!jwt) {
			this.notifications.warning('Please sign in first!');
			this.transitionTo('login');
		}
	}
});