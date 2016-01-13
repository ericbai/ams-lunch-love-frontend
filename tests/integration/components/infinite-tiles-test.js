import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('infinite-tiles', 'Integration | Component | infinite tiles', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{infinite-tiles}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#infinite-tiles}}
      template block text
    {{/infinite-tiles}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
