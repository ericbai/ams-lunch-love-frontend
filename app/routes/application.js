import config from '../config/environment';
import Ember from 'ember';
import ls from 'npm:local-storage';

export default Ember.Route.extend({
	init: function() {
		this._super();
		this.notifications.setDefaultClearNotification(5000);
		this.notifications.setDefaultAutoClear(true);
	},

	actions: {

		/////////////////////
		// Authentication  //
		/////////////////////

		sendCredentials: function(email, password, deferred) {
			Ember.$.ajax({
				type: 'POST',
				url: `${config.host}/api/login`,
				contentType: 'application/json',
				data: JSON.stringify({
					email: email,
					password: password
				})
			}).then(deferred.resolve, deferred.reject);
			return false;
		},
		login: function(email, password) {
			const deferred = Ember.RSVP.defer();
			this.send('sendCredentials', email, password, deferred);
			deferred.promise.then((success) => {
				ls.set('jwt', success.token);
				ls.set('user', success.user);
				ls.set('classYears', success.classYears);
				this.notifications.success('Welcome back! Nice to see you!');
				this.transitionTo('dashboard');
			}, (failure) => {
				this.notifications.error(failure.message || 'Could not login. Check the email and password and try again.');
			});
			return false;
		},
		logout: function() {
			ls.clear();
			this.notifications.success('Successfully logged out. See you next time!');
			this.transitionTo('user');
			return false;
		},

		////////////
		// Modals //
		////////////

		renderModal: function(modalName, controller) {
			this.render(modalName, {
				into: 'application',
				outlet: 'modal',
				controller: controller
			});
			return false;
		},
		destroyModal: function() {
			this.disconnectOutlet({
				outlet: 'modal',
				parentView: 'application'
			});
			return false;
		},

		///////////////////
		// Error handler //
		///////////////////

		error: function(err) {
			console.log("ERROR: " + err);
			ls.clear();
			this.transitionTo("login");
			return false;
		}
	}
});
