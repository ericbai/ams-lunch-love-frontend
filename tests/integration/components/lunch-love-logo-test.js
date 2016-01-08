import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('lunch-love-logo', 'Integration | Component | lunch love logo', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{lunch-love-logo}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#lunch-love-logo}}
      template block text
    {{/lunch-love-logo}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
