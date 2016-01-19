import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Route.extend({
	actions: {
		chooseNewPassword: function(newPassword, confirmNewPassword) {
			if (Ember.isNone(newPassword) || Ember.isNone(confirmNewPassword)) {
				this.notifications.error('Please fill out both fields');
				return false;
			} else if (newPassword !== confirmNewPassword) {
				this.notifications.error('Passwords must match');
				return false;
			}
			const token = this.modelFor('confirm').token;
			Ember.$.ajax({
				type: 'POST',
				url: `${config.host}/api/admins/${token}`,
				contentType: 'application/json',
				data: JSON.stringify({
					admin: {
						password: newPassword,
						pending: false
					}
				})
			}).then((success) => {
				this.notifications.success('Welcome! You have successfully set up your account.');
				this.send('login', success.admin.email, newPassword);
			}, (failure) => {
				this.notifications.error('Could not set up your account. This link is invalid or expired. Please try again with a new link.');
			});
			return false;
		}
	}
});
