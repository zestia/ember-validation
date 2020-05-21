import { module, test } from 'qunit';
import lessThan from '@zestia/ember-validation/constraints/less-than';

module('lessThan', function () {
  test('it returns nothing when valid', function (assert) {
    assert.expect(1);

    assert.strictEqual(lessThan({ value: 10 })(9), undefined);
  });

  test('it returns default message if invalid', function (assert) {
    assert.expect(1);

    assert.equal(lessThan({ value: 10 })(10), 'must be less than 10');
  });

  test('it returns custom message if invalid', function (assert) {
    assert.expect(1);

    assert.equal(
      lessThan({ value: 2, message: 'not small enough' })(2),
      'not small enough'
    );
  });

  test('optional', function (assert) {
    assert.expect(2);

    assert.equal(
      lessThan({ value: 0, optional: true })(0),
      'must be less than 0'
    );

    assert.equal(lessThan({ value: 0, optional: true })(''), undefined);
  });

  test('inputs', function (assert) {
    assert.expect(6);

    assert.equal(lessThan({ value: 'a' })('aa'), 'must be less than a');
    assert.equal(lessThan({ value: 1 })(2), 'must be less than 1');
    assert.equal(lessThan({ value: 3 })(3), 'must be less than 3');
    assert.strictEqual(lessThan({ value: -5 })(-10), undefined);
    assert.strictEqual(lessThan({ value: 'aa' })('a'), undefined);
    assert.strictEqual(lessThan({ value: 2 })(1), undefined);
  });
});
