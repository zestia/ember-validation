import { module, test } from 'qunit';
import { truthy } from '@zestia/ember-validation/constraints';

module('truthy', function () {
  test('it returns nothing when valid', function (assert) {
    assert.expect(1);

    assert.strictEqual(truthy()(true), undefined);
  });

  test('it returns the default message if invalid', function (assert) {
    assert.expect(1);

    assert.strictEqual(truthy()(false), 'Must be truthy');
  });
});
