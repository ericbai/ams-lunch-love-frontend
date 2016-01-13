import Ember from 'ember';
import ls from 'npm:local-storage';
import UUID from 'npm:node-uuid';

export default Ember.Route.extend({
	model: function() {
		return new Ember.RSVP.hash({
			self: this.store.find('user', ls.get('user').email),
			admins: this.store.query('user', {
				admins: 'all',
				max: this.currentModel ? this.currentModel.admins.get('length') : 10
			}),
			pendingAdmins: this.store.query('user', {
				admins: 'pending',
				max: this.currentModel ? this.currentModel.pendingAdmins.get('length') : 10
			})
		});
	},
	addToArray: function(results, modelArray, deferred) {
		Ember.RSVP.all(results.get('content').map((el) => {
			return this.store.find('user', el.id);
		})).then((users) => {
			users.forEach((user) => {
				modelArray.pushObject(user._internalModel);
			});
			deferred.resolve(users);
		}, deferred.reject);
	},
	deactivate: function() {
		this.controller.setProperties({
			currentPassword: null,
			newPassword: null,
			confirmNewPassword: null
		});
		this.setProperties({
			newAdminName: null,
			newAdminEmail: null
		});
		if (this.currentModel.self.get('hasDirtyAttributes')) {
			this.currentModel.self.rollbackAttributes();
		}
	},
	setupController: function(controller, modelHash) {
		this._super(controller, modelHash);
		controller.setProperties({
			adminTotal: modelHash.admins.get('meta.total'),
			pendingAdminTotal: modelHash.pendingAdmins.get('meta.total')
		});
	},

	////////////////////////////////////////////////
	// Invite admin modal's context is THIS ROUTE //
	////////////////////////////////////////////////

	newAdminName: null,
	newAdminEmail: null,

	actions: {
		showModal: function(modalName) {
			this.send('renderModal', modalName, this);
			return false;
		},

		////////////
		// Admins //
		////////////

		closeInviteNewAdmin: function() {
			this.setProperties({
				newAdminName: null,
				newAdminEmail: null
			});
			this.send('destroyModal');
			return false;
		},
		inviteNewAdmin: function() {
			const name = this.get('newAdminName'),
				email = this.get('newAdminEmail'),
				tempPassword = UUID.v4(),
				newUser = this.store.createRecord('user', {
					name: name,
					password: tempPassword
				});
			newUser.set('email', email);
			newUser.set('serializePassword', true);
			newUser.save().then(() => {
				this.notifications.success('Successfully invited new admin.');
				this.send('destroyModal');
				this.controller.setProperties({
					newAdminName: null,
					newAdminEmail: null
				});
			}, () => {
				this.notifications.error('Could not save new admin. Check that the email address you used has not already been taken. Please try again later.');
			});
			return false;
		},
		confirmDeleteAdmin: function(admin) {
			admin.set('shouldConfirmDelete', true);
			return false;
		},
		deleteAdmin: function(admin) {
			const name = admin.get('name');
			admin.destroyRecord().then(() => {
				this.notifications.success(`Successfully deleted ${name}.`);
			}, () => {
				this.notifications.error(`Could not delete ${name}. Please try again.`);
			});
			return false;
		},
		confirmCancelPending: function(pending) {
			pending.set('shouldConfirmCancelInvite', true);
			return false;
		},
		cancelPending: function(pending) {
			const name = pending.get('name');
			pending.destroyRecord().then(() => {
				this.notifications.success(`Canceled invite to ${name}.`);
			}, () => {
				this.notifications.error(`Could not cancel invite to ${name}. Please try again.`);
			});
			return false;
		},
		loadMoreAdmins: function(offset, max, deferred) {
			this.store.query('user', {
				admins: 'all',
				offset: offset,
				max: max
			}).then((results) => {
				this.addToArray(results, this.currentModel.admins, deferred);
			}, deferred.reject);
			return false;
		},
		loadMorePendingAdmins: function(offset, max, deferred) {
			this.store.query('user', {
				admins: 'pending',
				offset: offset,
				max: max
			}).then((results) => {
				this.addToArray(results, this.currentModel.pendingAdmins, deferred);
			}, deferred.reject);
			return false;
		},

		//////////////
		// Settings //
		//////////////

		updateSettings: function() {
			const user = this.currentModel.self;
			if (user.get('hasDirtyAttributes')) {
				Ember.run.debounce(this, function() {
					user.save().then(() => {
						this.notifications.success('Successfully updated settings');
						ls.set('user', {
							name: user.get('name'),
							email: user.get('email'),
							clusterSize: user.get('clusterSize'),
							overlapTolerance: user.get('overlapTolerance')
						});
					}, () => {
						this.notifications.error('Could not update your settings. Please try again later.');
					});
				}, 1000);
			}
			return false;
		},
		updatePasswordAndLogout: function(currentPassword, newPassword, confirmNewPassword) {
			if (currentPassword === newPassword) {
				this.notifications.error('New password cannot be same as the current password');
				return false;
			}
			if (newPassword !== confirmNewPassword) {
				this.notifications.error('Confirm new password must match new password');
				return false;
			}
			Ember.run.debounce(this, function() {
				const deferred = Ember.RSVP.defer(),
					user = this.currentModel.self;
				this.send('sendCredentials', this.currentModel.self.get('email'), currentPassword, deferred);
				deferred.promise.then(() => {
					user.set('serializePassword', true);
					user.set('password', newPassword);
					user.save().then(() => {
						this.send('logout');
						this.notifications.success('Successfully updated password');
					}, () => {
						this.notifications.error('Could not update your password. Please try again later.');
					});
				}, () => {
					this.notifications.error('Current password is incorrect');
				});
			}, 1000);
			return false;
		}
	}
});
