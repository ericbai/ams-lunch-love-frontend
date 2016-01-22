import Ember from 'ember';

export default Ember.Component.extend({

	dragEnterAction: null,
	dragLeaveAction: null,
	dropAction: null,
	activeClass: 'active',
	sourceContentType: 'text',
	contents: null,

	classNames: 'draggable-dropzone',
	classNameBindings: ['dragClass'],
	dragClass: '',
	dragCounter: 0, // for the quirks of the drag and drop spec

	// Events
	// ------

	dragEnter: function(event) {
		event.preventDefault();
		this.incrementProperty('dragCounter');
		this.set('dragClass', this.get('activeClass'));
		if (!Ember.isNone(this.get('dragEnterAction'))) {
			this.sendAction('dragEnterAction');
		}
		return false;
	},
	dragLeave: function(event) {
		event.preventDefault();
		this.decrementProperty('dragCounter');
		if (this.get('dragCounter') === 0) {
			this.set('dragCounter', 0);
			this.set('dragClass', '');
		}
		if (!Ember.isNone(this.get('dragLeaveAction'))) {
			this.sendAction('dragLeaveAction');
		}
		return false;
	},
	dragOver: function(event) {
		event.preventDefault();
		return false;
	},
	drop: function(event) {
		event.preventDefault();
		this.set('dragCounter', 0);
		this.set('dragClass', '');
		if (!Ember.isNone(this.get('dropAction'))) {
			const sourceContentType = this.get('sourceContentType'),
				contents = this.get('contents'),
				sourceInfo = event.dataTransfer.getData(sourceContentType);
			this.sendAction('dropAction', contents, sourceInfo);
		}
		return false;
	},
});
