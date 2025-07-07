import { module, test } from 'qunit';
import { truthy } from '@zestia/ember-validation/constraints';
import { setMessageFn } from '@zestia/ember-validation';
import { testMessageFn, defaultMessageFn } from '../helper';

module('truthy', function (hooks) {
  hooks.afterEach(function () {
    setMessageFn(defaultMessageFn);
  });

  test('it returns nothing when valid', function (assert) {
    assert.expect(1);

    assert.strictEqual(truthy()(true), undefined);
  });

  test('it returns the default message if invalid', function (assert) {
    assert.expect(1);

    assert.strictEqual(truthy()(false), 'Must be truthy');
  });

  test('it returns a custom message if invalid', function (assert) {
    assert.expect(1);

    setMessageFn(testMessageFn);

    assert.strictEqual(
      truthy({ key: 'truthy.please-accept-the-terms' })(),
      'please accept the terms'
    );
  });
});
