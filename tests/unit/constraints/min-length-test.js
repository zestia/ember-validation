import { module, test } from 'qunit';
import minLength from '@zestia/ember-validation/constraints/min-length';

module('minLength', function () {
  test('it returns nothing when valid', function (assert) {
    assert.expect(1);

    assert.strictEqual(minLength({ min: 4 })('hiya'), undefined);
  });

  test('it returns default message if invalid', function (assert) {
    assert.expect(1);

    assert.equal(minLength({ min: 3 })('hi'), 'length must be at least 3');
  });

  test('it returns custom message if invalid', function (assert) {
    assert.expect(1);

    assert.equal(
      minLength({ min: 6, message: 'too short' })('hello'),
      'too short',
      'returns custom message if invalid'
    );
  });

  test('inputs', function (assert) {
    assert.expect(14);

    assert.equal(minLength({ min: 1 })(''), 'length must be at least 1');
    assert.equal(minLength({ min: 1 })(), 'length must be at least 1');
    assert.equal(minLength({ min: 2 })(['a']), 'length must be at least 2');
    assert.equal(minLength({ min: 4 })('abc'), 'length must be at least 4');
    assert.strictEqual(minLength({ min: 0 })(''), undefined);
    assert.strictEqual(minLength({ min: 0 })('a'), undefined);
    assert.strictEqual(minLength({ min: 0 })(), undefined);
    assert.strictEqual(minLength({ min: 0 })(null), undefined);
    assert.strictEqual(minLength({ min: 1 })('a'), undefined);
    assert.strictEqual(minLength({ min: 1 })('ab'), undefined);
    assert.strictEqual(minLength({ min: 1 })('abcd'), undefined);
    assert.strictEqual(minLength({ min: 2 })(['a', 'b']), undefined);
    assert.strictEqual(minLength({ min: 2 })(10), undefined);
    assert.strictEqual(minLength({ min: 2 })(100), undefined);
  });
});
