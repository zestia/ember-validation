import { module, test } from 'qunit';
import { present } from '@zestia/ember-validation/constraints';
import { setMessageFn } from '@zestia/ember-validation';
import { testMessageFn } from '../helper';

module('present', function () {
  test('it returns nothing when valid', function (assert) {
    assert.expect(1);

    assert.strictEqual(present()('hi'), undefined);
  });

  test('it returns default message if invalid', function (assert) {
    assert.expect(1);

    assert.strictEqual(present()(''), 'Required value');
  });

  test('it returns custom message if invalid', function (assert) {
    assert.expect(1);

    setMessageFn(testMessageFn);

    assert.strictEqual(
      present({ key: 'present.nothing-there' })(),
      'nothing there'
    );
  });
});
