import DS from 'ember-data';
import Ember from 'ember';
import ls from 'npm:local-storage';

export default DS.Model.extend({
	name: DS.attr('string'),
	pending: DS.attr('boolean'),
	password: DS.attr('string'),
	overlapTolerance: DS.attr('number'),
	clusterSize: DS.attr('number'),

	////////////////////
	// Not attributes //
	////////////////////

	email: Ember.computed.alias('id'),
	serializePassword: false,
	shouldConfirmDelete: false,
	shouldConfirmCancelInvite: false,

	isSelf: function() {
		return this.get('email') === ls.get('admin').email;
	}.property().volatile(),
});
