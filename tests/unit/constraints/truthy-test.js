import { module, test } from 'qunit';
import truthy from '@zestia/ember-validation/constraints/truthy';

module('truthy', function () {
  test('it returns nothing when valid', function (assert) {
    assert.expect(1);

    assert.strictEqual(truthy()(true), undefined);
  });

  test('it returns the default message if invalid', function (assert) {
    assert.expect(1);

    assert.equal(truthy()(false), 'must be truthy');
  });

  test('it returns a custom message if invalid', function (assert) {
    assert.expect(1);

    assert.equal(
      truthy({ message: 'please accept the terms' })(),
      'please accept the terms'
    );
  });
});
