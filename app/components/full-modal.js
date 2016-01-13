import Ember from 'ember';

export default Ember.Component.extend({
	headerIcon: null,
	okAction: null,
	closeAction: null,
	model: null,
	title: '',
	okLabel: 'Ok',
	closeLabel: 'Close',
	okButtonClass: 'btn-primary',

	////////////
	// Events //
	////////////

	didInsertElement: function() {
		this.$(".modal").modal({
			backdrop: 'static'
		}).on("hidden.bs.modal", () => {
			this.sendAction("closeAction");
		});
	},
	willDestroyElement: function() {
		this.$('.modal').modal('hide');
	},
	actions: {
		ok: function() {
			const m = this.get('model');
			if (m) {
				this.sendAction('okAction', m);
			} else {
				this.sendAction('okAction');
			}
		}
	}
});