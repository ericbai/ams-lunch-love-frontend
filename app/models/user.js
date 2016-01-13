import DS from 'ember-data';
import Ember from 'ember';
import ls from 'npm:local-storage';

export default DS.Model.extend({
	name: DS.attr('string'),
	classYear: DS.attr('string'),
	password: DS.attr('string'),
	overlapTolerance: DS.attr('number'),
	clusterSize: DS.attr('number'),
	pendingAdmin: DS.attr('boolean'),

	////////////////////
	// Not attributes //
	////////////////////

	serializePassword: false,
	email: Ember.computed.alias('id'),
	isSelected: false,
	shouldConfirmDelete: false,
	shouldConfirmCancelInvite: false,

	isSelf: function() {
		return this.get('email') === ls.get('user').email;
	}.property().volatile(),
});
