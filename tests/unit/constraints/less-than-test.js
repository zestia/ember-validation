import { module, test } from 'qunit';
import { lessThan } from '@zestia/ember-validation/constraints';
import { setMessageFn } from '@zestia/ember-validation';
import { testMessageFn, defaultMessageFn } from 'dummy/tests/unit/helper';

module('lessThan', function () {
  test('it returns nothing when valid', function (assert) {
    assert.expect(1);

    assert.strictEqual(lessThan({ value: 10 })(9), undefined);
  });

  test('it returns default message if invalid', function (assert) {
    assert.expect(1);

    assert.strictEqual(lessThan({ value: 10 })(10), 'Must be less than 10');
  });

  test('it returns custom message if invalid', function (assert) {
    assert.expect(1);

    setMessageFn(testMessageFn);

    assert.strictEqual(
      lessThan({ value: 2, key: 'less-than.not-small-enough' })(2),
      'not small enough'
    );
  });

  test('optional', function (assert) {
    assert.expect(2);

    setMessageFn(defaultMessageFn);

    assert.strictEqual(
      lessThan({ value: 0, optional: true })(0),
      'Must be less than 0'
    );

    assert.strictEqual(lessThan({ value: 0, optional: true })(''), undefined);
  });

  test('inputs', function (assert) {
    assert.expect(6);

    assert.strictEqual(lessThan({ value: 'a' })('aa'), 'Must be less than a');
    assert.strictEqual(lessThan({ value: 1 })(2), 'Must be less than 1');
    assert.strictEqual(lessThan({ value: 3 })(3), 'Must be less than 3');
    assert.strictEqual(lessThan({ value: -5 })(-10), undefined);
    assert.strictEqual(lessThan({ value: 'aa' })('a'), undefined);
    assert.strictEqual(lessThan({ value: 2 })(1), undefined);
  });
});
