import Ember from 'ember';
import ls from 'npm:local-storage';
import config from '../../config/environment';

export default Ember.Controller.extend({
	dashboardController: Ember.inject.controller('dashboard'),
	suggestedGroups: Ember.computed.alias('dashboardController.suggestedGroups'),
	ungroupedUsers: Ember.computed.alias('dashboardController.ungroupedUsers'),
	numOverlaps: Ember.computed.alias('dashboardController.numOverlaps'),

	clusterSize: function() {
		return ls.get('admin').clusterSize;
	}.property().volatile(),
	overlapTolerance: function() {
		return ls.get('admin').overlapTolerance;
	}.property().volatile(),

	actions: {
		sendLove: function() {
			Ember.$.ajax({
				type: 'POST',
				url: `${config.host}/api/groups`,
				contentType: 'application/json',
				beforeSend: function(request) {
					request.setRequestHeader("x-access-token", ls.get("jwt"));
				},
				data: JSON.stringify({
					groups: this.get('suggestedGroups')
				})
			}).then(() => {
				this.notifications.success('Successfully sent love! Yay love!');
				this.setProperties({
					suggestedGroups: null,
					ungroupedUsers: null,
					numOverlaps: null
				});
				this.transitionTo('dashboard.index');
			}, () => {
				this.notifications.error('Could not save new groups. Please try again later.');
			});
			return false;
		},

		// Drag and drop
		// -------------

		drop: function(target, sourceInfo) {
			const json = JSON.parse(sourceInfo),
				source = json.source,
				email = json.email;
			if (source === 'leftovers') {
				this.get('ungroupedUsers').removeObject(email);
			} else {
				this.get('suggestedGroups')[source].users.removeObject(email);
			}
			if (target === 'leftovers') {
				this.get('ungroupedUsers').pushObject(email);
			} else {
				this.get('suggestedGroups')[target].users.pushObject(email);
			}
			return false;
		},
	}
});
