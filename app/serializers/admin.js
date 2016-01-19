import DS from 'ember-data';

export default DS.RESTSerializer.extend({
	isNewSerializerAPI: true,
	primaryKey: 'email',
	attrs: {
		password: {
			serialize: false
		},
		pending: {
			serialize: false
		}
	},
	serialize: function(snapshot, options) {
		const json = this._super(snapshot, options);
		json.email = snapshot.record.get('email');
		if (snapshot.record.get('serializePassword')) {
			json.password = snapshot.get('password');
			snapshot.record.set('serializePassword', false);
		}
		return json;
	},
});
