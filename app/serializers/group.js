import DS from 'ember-data';

export default DS.RESTSerializer.extend({
	isNewSerializerAPI: true,
	primaryKey: 'uuid'
});