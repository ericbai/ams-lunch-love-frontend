import Ember from 'ember';
import AuthMixin from '../../../mixins/auth';
import { module, test } from 'qunit';

module('Unit | Mixin | auth');

// Replace this with your real tests.
test('it works', function(assert) {
  let AuthObject = Ember.Object.extend(AuthMixin);
  let subject = AuthObject.create();
  assert.ok(subject);
});
