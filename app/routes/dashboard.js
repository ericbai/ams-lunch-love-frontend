import Ember from 'ember';
import Auth from '../mixins/auth';
import config from '../config/environment';
import ls from 'npm:local-storage';

export default Ember.Route.extend(Auth, {
	deactivate: function() {
		this.controller.setProperties({
			suggestedGroups: null,
			ungroupedUsers: null,
			numOverlaps: null
		});
	},
	actions: {
		clusterUsers: function() {
			const indexController = this.controllerFor('dashboard.index'),
				selectedUsers = indexController.get('selectedUsers'),
				emailParams = selectedUsers.map((selectedUser) => {
					return `candidates[]=${selectedUser.get('email')}`;
				});
			Ember.$.ajax({
				type: 'GET',
				url: `${config.host}/api/groups?${emailParams.join('&')}`,
				contentType: 'application/json',
				beforeSend: function(request) {
					request.setRequestHeader("x-access-token", ls.get("jwt"));
				}
			}).then((results) => {
				this.controller.setProperties({
					suggestedGroups: results.groups,
					ungroupedUsers: results.meta.notGrouped,
					numOverlaps: results.meta.overlap
				});
				indexController.send('selectNone');
				this.transitionTo('dashboard.love');
			}, () => {
				this.notifications.error('Could not cluster users at this time. Please try again.');
			});
			return false;
		},
	}
});
