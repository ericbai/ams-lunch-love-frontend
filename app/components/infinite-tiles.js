import Ember from 'ember';

export default Ember.Component.extend({
	itemSelector: '.tile-wrapper',
	layoutMode: 'fitRows',
	shouldRefresh: null,
	total: null,
	max: 10,

	doneClass: 'infinite-tiles-done',
	loaderClass: 'infinite-tiles-loader',
	itemsContainerClass: 'infinite-tiles-container',
	classNames: ['infinite-tiles', 'custom-scroll'],

	loadMoreAction: 'loadMore',
	closeThreshold: 150, //pixels

	isLoading: false,
	loadedAll: false,


	////////////
	// Events //
	////////////

	doRefresh: function() {
		this.refresh();
	}.on('init').observes('shouldRefresh'),
	itemsContainer: function() {
		return this.$().find(`.${this.get('itemsContainerClass')}`);
	}.property('itemsContainerClass'),
	scrollContainer: function() {
		return this.$();
	}.property(),
	guid: Ember.guidFor(this),
	didInsertElement: function() {
		const scrollContainer = this.get('scrollContainer'),
			itemsContainer = this.get('itemsContainer'),
			guid = this.get('guid');
		//initialize isotope
		itemsContainer.isotope({
			itemSelector: this.get('itemSelector'),
			layoutMode: this.get('layoutMode')
		});
		//load more if no overflow yet
		this.loadMoreIfNoScroll();

		//Add event handlers
		scrollContainer.on(`scroll.${guid}`, () => {
			const near = this.isNearEdge(),
				loading = this.get('isLoading'),
				loadedAll = this.get('loadedAll');
			if (near && !loading && !loadedAll) {
				Ember.run.debounce(this, this.loadMore, 1000);
			}
		});
	},
	willDestroyElement: function() {
		this.get('itemsContainer').isotope('destroy');
		this.get('scrollContainer').off(`.${this.get('guid')}`);
	},
	didUpdateAttrs: function() {
		this.set('isLoading', false);
		this.set('loadedAll', false);
		this.loadMoreIfNoScroll().then(() => {
			this.refresh();
		});
	},

	////////////
	// Scroll //
	////////////

	isNearEdge: function() {
		const cEl = this.get('scrollContainer')[0];
		return Math.abs(cEl.scrollTop + cEl.clientHeight - cEl.scrollHeight) < this.get('closeThreshold');
	},
	canScroll: function() {
		const cEl = this.get('scrollContainer')[0];
		return cEl.scrollHeight > cEl.clientHeight;
	},
	loadMoreIfNoScroll: function() {
		return new Ember.RSVP.Promise((resolve) => {
			if (!this.canScroll() && !this.get('loadedAll') && !this.get('isLoading')) {
				this.loadMore().then(() => {
					this.loadMoreIfNoScroll();
				});
				// this.loadMore();
				resolve();
			} else {
				resolve();
			}
		});
	},
	loadMore: function() {
		return new Ember.RSVP.Promise((resolve) => {
			const deferred = Ember.RSVP.defer(),
				max = this.get('max'),
				total = this.get('total'),
				itemsContainer = this.get('itemsContainer'),
				numItems = itemsContainer.isotope('getItemElements').length;
			if (numItems >= total) {
				this.set('loadedAll', true);
				return resolve();
			}
			this.set('isLoading', true);
			this.sendAction('loadMoreAction', numItems, max, deferred);
			deferred.promise.then((results) => {
				this.set('isLoading', false);
				if (Ember.isNone(results) || (Ember.isArray(results.objects) && results.objects.get('length') === 0)) {
					this.set('loadedAll', true);
				}
				this.refresh();
			}, resolve);
		});
	},
	refresh: function() {
		Ember.run.scheduleOnce('afterRender', () => {
			this.get('itemsContainer').isotope('reloadItems') //incorporate changes to DOM
				.isotope(); //redo layouts
		});
	}
});
