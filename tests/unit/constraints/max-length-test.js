import { module, test } from 'qunit';
import maxLength from '@zestia/ember-validation/constraints/max-length';

module('maxLength', function () {
  test('it returns nothing when valid', function (assert) {
    assert.expect(1);

    assert.strictEqual(maxLength({ max: 2 })('hi'), undefined);
  });

  test('it returns default message if invalid', function (assert) {
    assert.expect(1);

    assert.equal(maxLength({ max: 3 })('hiya'), 'length is too long (max 3)');
  });

  test('it returns custom message if invalid', function (assert) {
    assert.expect(1);

    assert.equal(
      maxLength({ max: 4, message: 'exceeds max' })('hello'),
      'exceeds max'
    );
  });

  test('inputs', function (assert) {
    assert.expect(15);

    assert.equal(maxLength({ max: 0 })('a'), 'length is too long (max 0)');
    assert.equal(maxLength({ max: 1 })('ab', 1), 'length is too long (max 1)');
    assert.equal(
      maxLength({ max: 1 })(['a', 'b'], 1),
      'length is too long (max 1)'
    );
    assert.equal(maxLength({ max: 2 })(100), 'length is too long (max 2)');
    assert.strictEqual(maxLength({ max: 0 })(''), undefined);
    assert.strictEqual(maxLength({ max: 1 })(''), undefined);
    assert.strictEqual(maxLength({ max: 1 })('a'), undefined);
    assert.strictEqual(maxLength({ max: 4 })('abc'), undefined);
    assert.strictEqual(maxLength({ max: 4 })('abcd'), undefined);
    assert.strictEqual(maxLength({ max: 2 })(['a', 'b']), undefined);
    assert.strictEqual(maxLength({ max: 2 })(10), undefined);
    assert.strictEqual(maxLength({ max: 0 })(null), undefined);
    assert.strictEqual(maxLength({ max: 4 })(null), undefined);
    assert.strictEqual(maxLength({ max: 0 })(), undefined);
    assert.strictEqual(maxLength({ max: 9 })(), undefined);
  });
});
