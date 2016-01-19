import Ember from 'ember';
import ls from 'npm:local-storage';

export default Ember.Controller.extend({
	total: null, //set by route
	classYears: function() {
		return ls.get('classYears');
	}.property().volatile(),
	clusterSize: function() {
		return ls.get('admin').clusterSize;
	}.property().volatile(),

	queryParams: ['q', 'classYear'],
	q: null,
	searchString: null,
	classYear: null,

	selectedUsers: function() {
		return this.get('model').filter((user) => {
			return user.get('isSelected');
		});
	}.property('model.@each.isSelected'),
	clusterSizeSatisfied: function() {
		return this.get('selectedUsers.length') >= this.get('clusterSize');
	}.property('selectedUsers'),

	showDetailsForUser: null,
	groupsForUserDetail: null,
	groupsTotalForUserDetail: null,
	addToUserDetailsGroups: function(results, groupsArray, optDeferred) {
		this.get('groupsTotalForUserDetail', results.get('meta.total'));
		Ember.RSVP.all(results.get('content').map((el) => {
			return this.store.find('group', el.id);
		})).then((groups) => {
			groups.forEach((group) => {
				groupsArray.pushObject(group);
			});
			if (optDeferred) {
				optDeferred.resolve(groups);
			}
		}, (failure) => {
			if (optDeferred) {
				optDeferred.reject(failure);
			}
		});
	},

	actions: {

		showModal: function(modalName) {
			this.send('renderModal', modalName, this);
			return false;
		},

		//////////////////
		// User details //
		//////////////////

		showUserDetails: function(user) {
			this.set('showDetailsForUser', user);
			this.set('groupsForUserDetail', []); //prepare groups
			this.store.query('group', {
				email: user.get('email')
			}).then((results) => {
				this.addToUserDetailsGroups(results, this.get('groupsForUserDetail'));
				this.send('renderModal', 'modals/user-details', this);
			}, () => {
				this.notifications.error(`Could not load groups for ${user.get('name')}. Please try again later.`);
			});
			return false;
		},
		closeUserDetails: function() {
			this.setProperties({
				showDetailsForUser: null,
				groupsForUserDetail: null,
				groupsTotalForUserDetail: null
			});
			this.send('destroyModal');
			return false;
		},
		loadMoreGroups: function(offset, max, deferred) {
			this.store.query('group', {
				email: this.get('showDetailsForUser.email'),
				offset: offset,
				max: max
			}).then((results) => {
				this.addToUserDetailsGroups(results, this.get('groupsForUserDetail'), deferred);
			}, deferred.reject);
			return false;
		},

		//////////////////////
		// Changing display //
		//////////////////////

		showAll: function() {
			this.setProperties({
				q: null,
				classYear: null,
				searchString: null
			});
			return false;
		},
		showClassYear: function(classYear) {
			this.setProperties({
				q: null,
				classYear: classYear,
				searchString: null
			});
			return false;
		},
		doSearch: function(searchString) {
			this.setProperties({
				q: searchString,
				classYear: null
			});
			return false;
		},

		/////////////////////
		// Selecting users //
		/////////////////////

		toggleUser: function(user) {
			user.toggleProperty('isSelected');
			return false;
		},
		selectAll: function() {
			this.get('model').forEach((user) => {
				user.set('isSelected', true);
			});
			return false;
		},
		selectNone: function() {
			this.get('model').forEach((user) => {
				user.set('isSelected', false);
			});
			return false;
		},
	}
});
