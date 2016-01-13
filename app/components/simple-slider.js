import Ember from 'ember';

export default Ember.Component.extend({
	sliderClasses: 'simple-slider-body-default',
	triggerClasses: 'simple-slider-trigger-default',
	triggerContent: '<b>Simple Slider</b>',
	showCaret: false,
	containerClass: 'simple-slider',
	classNameBindings: ['containerClass'],
	startOpen: false, //set this programmatically to trigger slider status to change
	clickOutToClose: true,

	/////////////////////////
	// Computed properties //
	/////////////////////////

	unescapedTriggerContent: function() {
		return this.get('triggerContent').htmlSafe();
	}.property('triggerContent'),

	////////////////////
	// DOM references //
	////////////////////

	internalBodyClass: 'simple-slider-body',
	internalTriggerClass: 'simple-slider-trigger',
	sliderObj: function() {
		return this.$().find(`.${this.get('internalBodyClass')}`)
	}.property('internalBodyClass'),
	triggerObj: function() {
		return this.$().find(`.${this.get('internalTriggerClass')}`)
	}.property('internalTriggerClass'),
	guid: Ember.guidFor(this),

	////////////
	// Events //
	////////////

	didInsertElement: function() {
		const sliderObj = this.get('sliderObj'),
			triggerObj = this.get('triggerObj'),
			guid = this.get('guid');
		//bind event handlers
		if (!this.get('startOpen')) {
			sliderObj.hide();
		}
		triggerObj.on(`click.${guid}`, () => {
			sliderObj.slideToggle();
		});
		if (this.get('clickOutToClose')) {
			Ember.$(document).on(`click.${guid}`, function(event) {
				if (!Ember.$(event.target).closest('.simple-slider').length) {
					sliderObj.slideUp();
				}
			});
		}
	},
	willDestroyElement: function() {
		const guid = this.get('guid');
		this.get('sliderObj').off(`.${guid}`);
		this.get('triggerObj').off(`.${guid}`);
		Ember.$(document).off(`.${guid}`);
	}
});
