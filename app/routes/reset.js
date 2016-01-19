import Ember from 'ember';
import config from '../config/environment';

export default Ember.Route.extend({
	model: function(params) {
		if (Ember.isNone(params.token)) {
			this.transitionTo('user');
		}
	},
	actions: {
		resetPassword: function(newPassword, confirmNewPassword) {
			if (Ember.isNone(newPassword) || Ember.isNone(confirmNewPassword)) {
				this.notifications.error('Please fill out both fields');
				return false;
			} else if (newPassword !== confirmNewPassword) {
				this.notifications.error('Passwords must match');
				return false;
			}
			const token = this.controllerFor('reset').get('token');
			Ember.$.ajax({
				type: 'PUT',
				url: `${config.host}/api/reset/${token}`,
				contentType: 'application/json',
				data: JSON.stringify({
					admin: {
						password: newPassword
					}
				})
			}).then((success) => {
				this.notifications.success('Successfully reset password.');
				this.send('login', success.admin.email, newPassword);
			}, () => {
				this.notifications.error('Could not reset password. This link is either invalid or expired. Please request another reset and try again.');
			});
			return false;
		}
	}
});
