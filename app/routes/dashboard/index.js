import Ember from 'ember';
import ls from 'npm:local-storage';

export default Ember.Route.extend({
	queryParams: {
		q: {
			refreshModel: true
		},
		classYear: {
			refreshModel: true
		}
	},

	model: function(params) {
		params.offset = 0;
		params.max = this.currentModel ? this.currentModel.get('length') : 10;
		return this.executeQuery(params);
	},
	executeQuery: function(params) {
		const options = {
			offset: params.offset,
			max: params.max,
		};
		if (params.q) {
			options.q = params.q;
		}
		if (params.classYear) {
			options.classYear = params.classYear;
		}
		return this.store.query('user', options);
	},
	setupController: function(controller, model) {
		this._super(controller, model);
		controller.set('total', this.store.metadataFor('user').total);
	},
	deactivate: function() {
		this.controller.setProperties({
			q: null,
			classYear: null,
			searchString: null
		});
	},
	actions: {
		loadMore: function(offset, max, deferred) {
			this.executeQuery({
				offset: offset,
				max: max,
				q: this.controller.get('q'),
				classYear: this.controller.get('classYear')
			}).then((results) => {
				Ember.RSVP.all(results.get('content').map((el) => {
					return this.store.find('user', el.id);
				})).then((users) => {
					users.forEach((user) => {
						this.currentModel.pushObject(user._internalModel);
					});
					deferred.resolve(users);
				}, deferred.reject);
			}, deferred.reject);
			return false;
		},
		deleteSelectedUsers: function() {
			const selectedUsers = this.controller.get('selectedUsers'),
				numSelected = selectedUsers.length;
			Ember.RSVP.all(selectedUsers.map((user) => {
				return user.destroyRecord();
			})).then((success) => {
				this.send('destroyModal');
				this.notifications.success(`Deleted ${numSelected} users.`);
				this.refresh();
				this.controller.send('selectNone');
			}, (failure) => {
				this.notifications.error('Could not delete all users. Please try again.');
			});
			return false;
		},
	}
});
