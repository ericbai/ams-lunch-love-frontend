import Ember from 'ember';

export default Ember.Component.extend({
    mouseport: 'document',
    yparallax: true,
    xparallax: true,
    yorigin: 0.5,
    xorigin: 0.5,

    classNames: 'parallax-layer',

    ////////////
    // Events //
    ////////////

    didInsertElement: function() {
        const container = this.$(),
            images = this.$().find('img');
        images.one('load', () => {
            Ember.run.next(this, function() {
                container.parallax({
                    mouseport: Ember.$(this.get('mouseport')),
                    yparallax: this.get('yparallax'),
                    xparallax: this.get('xparallax'),
                    yorigin: this.get('yorigin'),
                    xorigin: this.get('xorigin'),
                });
                container.trigger('mouseover');
            });
        });
    },
});