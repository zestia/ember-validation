import { module, test } from 'qunit';
import maxLengthConstraint, { maxLength } from '@zestia/ember-validation/constraints/max-length';

module('max-length', function() {
  test('#maxLength', function(assert) {
    assert.expect(14);

    assert.strictEqual(maxLength(undefined), false);
    assert.strictEqual(maxLength(null), false);
    assert.strictEqual(maxLength(''), false);
    assert.strictEqual(maxLength('', 1), true);
    assert.strictEqual(maxLength('', 0), true);
    assert.strictEqual(maxLength('a', 0), false);
    assert.strictEqual(maxLength('a', 1), true);
    assert.strictEqual(maxLength('ab', 1), false);
    assert.strictEqual(maxLength('abc', 4), true);
    assert.strictEqual(maxLength('abcd', 4), true);
    assert.strictEqual(maxLength(10, 2), false);
    assert.strictEqual(maxLength([], 2), true);
    assert.strictEqual(maxLength(['a', 'b'], 2), true);
    assert.strictEqual(maxLength(['a', 'b', 'c'], 2), false);
  });

  test('#maxLengthConstraint', function(assert) {
    assert.expect(3);

    let func;

    func = maxLengthConstraint({ max: 2 });

    assert.equal(func('hi'), null, 'returns nothing when valid');

    assert.equal(func('hiya'), 'length is too long (max 2)', 'returns default message if invalid');

    func = maxLengthConstraint({ max: 4, message: 'exceeds max' });

    assert.equal(func('hello'), 'exceeds max', 'returns custom message if invalid');
  });
});
