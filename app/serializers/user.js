import DS from 'ember-data';

export default DS.RESTSerializer.extend({
	isNewSerializerAPI: true,
	primaryKey: 'email',
	serialize: function(snapshot, options) {
		const json = this._super(snapshot, options);
		json.email = snapshot.record.get('email');
		return json;
	},
});
