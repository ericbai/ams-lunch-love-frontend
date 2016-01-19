import Ember from 'ember';
import ls from 'npm:local-storage';
import UUID from 'npm:node-uuid';
import config from '../../config/environment';

export default Ember.Route.extend({
	model: function() {
		return new Ember.RSVP.hash({
			self: this.store.find('admin', ls.get('admin').email),
			admins: this.store.query('admin', {
				show: 'all',
				max: this.currentModel ? this.currentModel.admins.get('length') : 30
			}),
			pendingAdmins: this.store.query('admin', {
				show: 'pending',
				max: this.currentModel ? this.currentModel.pendingAdmins.get('length') : 30
			})
		});
	},
	addToArray: function(results, modelArray, deferred) {
		Ember.RSVP.all(results.get('content').map((el) => {
			return this.store.find('admin', el.id);
		})).then((admins) => {
			admins.forEach((admin) => {
				modelArray.pushObject(admin._internalModel);
			});
			deferred.resolve(admins);
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
			pendingAdminTotal: modelHash.pendingAdmins.get('meta.total'),
			shouldRefreshPending: 0,
			shouldRefreshAdmins: 0
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
				newAdmin = this.store.createRecord('admin', {
					name: name,
					password: tempPassword
				});
			newAdmin.set('email', email);
			newAdmin.set('serializePassword', true);
			newAdmin.save().then(() => {
				this.notifications.success('Successfully invited new admin.');
				const pendingAdmins = this.currentModel.pendingAdmins,
					foundPending = pendingAdmins.find((pending) => {
						return pending.get('email') === newAdmin.get('email');
					});
				if (!foundPending) {
					this.store.find('admin', newAdmin.get('email')).then((admin) => {
						pendingAdmins.unshiftObject(admin._internalModel);
						this.controller.incrementProperty('shouldRefreshPending');
					});
				}
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
				this.currentModel.admins.removeObject(admin);
				this.store.unloadRecord(admin);
				this.controller.incrementProperty('shouldRefreshAdmins');
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
				this.currentModel.pendingAdmins.removeObject(pending);
				this.store.unloadRecord(pending);
				this.controller.incrementProperty('shouldRefreshPending');
			}, () => {
				this.notifications.error(`Could not cancel invite to ${name}. Please try again.`);
			});
			return false;
		},
		resendInvitation: function(pending) {
			const name = pending.get('name'),
				email = pending.get('email'),
				tempPassword = UUID.v4();
			Ember.$.ajax({
				type: 'POST',
				url: `${config.host}/api/admins`,
				contentType: 'application/json',
				beforeSend: function(request) {
					request.setRequestHeader("x-access-token", ls.get("jwt"));
				},
				data: JSON.stringify({
					admin: {
						name: name,
						password: tempPassword,
						email: email
					}
				})
			}).then(() => {
				this.notifications.success(`Successfully resent invitation to ${name}`);
			}, () => {
				this.notifications.error(`Could not resend invitation to ${name}`);
			});
			return false;
		},
		loadMoreAdmins: function(offset, max, deferred) {
			this.store.query('admin', {
				admins: 'all',
				offset: offset,
				max: max
			}).then((results) => {
				this.addToArray(results, this.currentModel.admins, deferred);
			}, deferred.reject);
			return false;
		},
		loadMorePendingAdmins: function(offset, max, deferred) {
			this.store.query('admin', {
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
			const admin = this.currentModel.self;
			if (admin.get('hasDirtyAttributes')) {
				Ember.run.debounce(this, function() {
					admin.save().then(() => {
						this.notifications.success('Successfully updated settings');
						ls.set('admin', {
							name: admin.get('name'),
							email: admin.get('email'),
							clusterSize: admin.get('clusterSize'),
							overlapTolerance: admin.get('overlapTolerance')
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
					admin = this.currentModel.self;
				this.send('sendCredentials', this.currentModel.self.get('email'), currentPassword, deferred);
				deferred.promise.then(() => {
					admin.set('serializePassword', true);
					admin.set('password', newPassword);
					admin.save().then(() => {
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
