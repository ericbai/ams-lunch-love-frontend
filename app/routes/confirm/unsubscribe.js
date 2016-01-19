import Ember from 'ember';
import config from "../../config/environment";

export default Ember.Route.extend({
	model: function() {
		const token = this.modelFor('confirm').token;
		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.ajax({
				type: 'POST',
				url: `${config.host}/api/users/${token}`,
				contentType: 'application/json',
				data: JSON.stringify({
					user: {
						confirmed: false
					}
				})
			}).then((success) => {
				resolve(success);
			}, (failure) => {
				reject(failure);
			});
		});
	},
});
