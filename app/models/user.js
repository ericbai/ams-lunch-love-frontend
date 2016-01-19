import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
	name: DS.attr('string'),
	classYear: DS.attr('string'),

	////////////////////
	// Not attributes //
	////////////////////

	email: Ember.computed.alias('id'),
	isSelected: false,
});
