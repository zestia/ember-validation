import { module, test } from 'qunit';
import truthy from '@zestia/ember-validation/constraints/truthy';

module('truthy', function () {
  test('it returns nothing when valid', function (assert) {
    assert.expect(1);

    const func = truthy();

    assert.equal(func(true), null);
  });

  test('it returns the default message if invalid', function (assert) {
    assert.expect(1);

    const func = truthy();

    assert.equal(func(false), 'must be truthy');
  });

  test('it returns a custom message if invalid', function (assert) {
    assert.expect(1);

    const func = truthy({ message: 'please accept the terms' });

    assert.equal(func(), 'please accept the terms');
  });
});
