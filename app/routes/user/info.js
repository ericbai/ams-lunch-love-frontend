import Ember from 'ember';

export default Ember.Route.extend({
	actions: {
		signup: function(name, emailAddress, classYear) {
			if (!name || !emailAddress || !classYear) {
				this.notifications.error('Please fill out all fields.');
				return false;
			}
			if (!(/@brown.edu$/i.test(emailAddress)) && !(/@alumni.brown.edu$/i.test(emailAddress))) {
				this.notifications.error('Please use your Brown email address.');
				return false;
			}
			const newUser = this.store.createRecord('user', {
				name: name,
				classYear: classYear
			});
			newUser.set('email', emailAddress);
			newUser.save().then(() => {
				this.notifications.success('Successfully signed up! Check your inbox for the confirmation email.');
				this.transitionTo('user.done');
			}, () => {
				this.notifications.error('Could not sign up. Please check your email address and try again later.');
			});
			return false;
		}
	}
});
