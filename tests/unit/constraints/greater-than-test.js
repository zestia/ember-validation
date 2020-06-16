import { module, test } from 'qunit';
import greaterThan from '@zestia/ember-validation/constraints/greater-than';

module('greaterThan', function () {
  test('it returns nothing when valid', function (assert) {
    assert.expect(1);

    assert.strictEqual(greaterThan({ value: 10 })(11), undefined);
  });

  test('it returns default message if invalid', function (assert) {
    assert.expect(1);

    assert.equal(greaterThan({ value: 10 })(10), 'Must be greater than 10');
  });

  test('it returns custom message if invalid', function (assert) {
    assert.expect(1);

    assert.equal(
      greaterThan({ value: 2, message: 'not big enough' })(2),
      'not big enough'
    );
  });

  test('optional', function (assert) {
    assert.expect(2);

    assert.equal(
      greaterThan({ value: 0, optional: true })(0),
      'Must be greater than 0'
    );

    assert.equal(greaterThan({ value: 0, optional: true })(''), null);
  });

  test('inputs', function (assert) {
    assert.expect(6);

    assert.equal(greaterThan({ value: -5 })(-10), 'Must be greater than -5');
    assert.equal(greaterThan({ value: 'aa' })('a'), 'Must be greater than aa');
    assert.equal(greaterThan({ value: 2 })(1), 'Must be greater than 2');
    assert.equal(greaterThan({ value: 3 })(3), 'Must be greater than 3');
    assert.strictEqual(greaterThan({ value: 'a' })('aa'), undefined);
    assert.strictEqual(greaterThan({ value: 1 })(2), undefined);
  });
});
