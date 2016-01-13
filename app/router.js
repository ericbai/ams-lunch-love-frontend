import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
	location: config.locationType
});

Router.map(function() {
	this.route('user', {
		path: '/'
	}, function() {
		this.route('info');
		this.route('done');
	});
	this.route('login');
	this.route('dashboard', function() {
		this.route('love');
		this.route('manage');
	});
});

export default Router;
