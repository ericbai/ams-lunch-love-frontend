import Ember from 'ember';
import ls from 'npm:local-storage';
import config from '../config/environment';

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

	resetEmail: null,

	actions: {
		showModal: function(modalName) {
			this.send('renderModal', modalName, this);
			return false;
		},
		sendPasswordReset: function(resetEmail) {
			if (Ember.isNone(resetEmail) || Ember.isBlank(resetEmail)) {
				this.notifications.error('Please specify your account email');
				return false;
			}
			Ember.$.ajax({
				type: 'POST',
				url: `${config.host}/api/reset/${resetEmail}`,
				contentType: 'application/json'
			}).then(() => {
				this.notifications.success('Successfully sent password reset. Please note that the link will expire in one hour.');
				this.set('resetEmail', null);
				this.send('destroyModal');
			}, () => {
				this.notifications.error('Could not send password reset. Check that the email you entered is correct and try again.');
			});
			return false;
		}
	}
});
