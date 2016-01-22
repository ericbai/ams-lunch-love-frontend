import Ember from 'ember';

export default Ember.Component.extend({

	dragStartAction: null,
	dragEndAction: null,
	contents: null,
	activeClass: 'active',
	contentType: 'text',

	classNames: 'draggable-item',
	classNameBindings: ['dragClass'],
	dragClass: '',
	attributeBindings: ['draggable'],
	draggable: 'true',

	// Events
	// ------

	dragStart: function(event) {
		const contentType = this.get('contentType'),
			contents = this.get('contents');
		event.dataTransfer.setData(contentType, contents);
		this.set('dragClass', this.get('activeClass'));
		if (!Ember.isNone(this.get('dragStartAction'))) {
			this.sendAction('dragStartAction', contents);
		}
	},
	dragEnd: function() {
		this.set('dragClass', '');
		if (!Ember.isNone(this.get('dragEndAction'))) {
			this.sendAction('dragEndAction', this.get('contents'));
		}
	},
});
