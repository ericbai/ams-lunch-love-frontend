import Ember from 'ember';

export default Ember.Route.extend({
	beforeModel: function(transition) {
		this._super(transition);
		const controller = this.controllerFor('dashboard');
		if (Ember.isNone(controller.get('suggestedGroups')) || Ember.isNone(controller.get('ungroupedUsers')) || Ember.isNone(controller.get('numOverlaps'))) {
			this.transitionTo('dashboard.index');
		}
	}
});
