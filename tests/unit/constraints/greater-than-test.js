import { module, test } from 'qunit';
import { greaterThan } from '@zestia/ember-validation/constraints';
import { setMessageFn } from '@zestia/ember-validation';
import { testMessageFn, defaultMessageFn } from 'dummy/tests/unit/helper';

module('greaterThan', function (hooks) {
  hooks.afterEach(function () {
    setMessageFn(defaultMessageFn);
  });

  test('it returns nothing when valid', function (assert) {
    assert.expect(1);

    assert.strictEqual(greaterThan({ value: 10 })(11), undefined);
  });

  test('it returns default message if invalid', function (assert) {
    assert.expect(1);

    assert.strictEqual(
      greaterThan({ value: 10 })(10),
      'Must be greater than 10'
    );
  });

  test('it returns custom message if invalid', function (assert) {
    assert.expect(1);

    setMessageFn(testMessageFn);

    assert.strictEqual(
      greaterThan({ value: 2, key: 'greater-than.not-bigger' })(1),
      '1 is not bigger than 2'
    );
  });

  test('optional', function (assert) {
    assert.expect(2);

    assert.strictEqual(
      greaterThan({ value: 0, optional: true })(0),
      'Must be greater than 0'
    );

    assert.strictEqual(
      greaterThan({ value: 0, optional: true })(''),
      undefined
    );
  });

  test('inputs', function (assert) {
    assert.expect(6);

    assert.strictEqual(
      greaterThan({ value: -5 })(-10),
      'Must be greater than -5'
    );
    assert.strictEqual(
      greaterThan({ value: 'aa' })('a'),
      'Must be greater than aa'
    );
    assert.strictEqual(greaterThan({ value: 2 })(1), 'Must be greater than 2');
    assert.strictEqual(greaterThan({ value: 3 })(3), 'Must be greater than 3');
    assert.strictEqual(greaterThan({ value: 'a' })('aa'), undefined);
    assert.strictEqual(greaterThan({ value: 1 })(2), undefined);
  });
});
