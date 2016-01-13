import DS from 'ember-data';
import config from '../config/environment';
import ls from 'npm:local-storage';

export default DS.RESTAdapter.extend({
	host: config.host,
	namespace: 'api',
	coalesceFindRequests: true,
	headers: function() {
		const jwt = ls.get('jwt');
		return (jwt) ? {
			'x-access-token': jwt
		} : {};
	}.property().volatile()
});