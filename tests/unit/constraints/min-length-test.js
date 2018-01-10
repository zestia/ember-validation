import { module, test } from 'qunit';
import minLengthConstraint, {
  minLength
} from '@zestia/ember-validation/constraints/min-length';

module('min-length', function() {
  test('#minLength', function(assert) {
    assert.expect(13);

    assert.strictEqual(minLength(undefined), false);
    assert.strictEqual(minLength(null), false);
    assert.strictEqual(minLength(''), false);
    assert.strictEqual(minLength('', 1), false);
    assert.strictEqual(minLength('', 0), true);
    assert.strictEqual(minLength('a', 0), true);
    assert.strictEqual(minLength('a', 1), true);
    assert.strictEqual(minLength('ab', 1), true);
    assert.strictEqual(minLength('abc', 4), false);
    assert.strictEqual(minLength('abcd', 4), true);
    assert.strictEqual(minLength(10, 2), false);
    assert.strictEqual(minLength([], 2), false);
    assert.strictEqual(minLength(['a', 'b'], 2), true);
  });

  test('#minLengthConstraint', function(assert) {
    assert.expect(3);

    let func;

    func = minLengthConstraint({ min: 4 });

    assert.equal(func('hiya'), null,
      'returns nothing when valid');

    assert.equal(func('hi'), 'length must be at least 4',
      'returns default message if invalid');

    func = minLengthConstraint({ min: 6, message: 'too short' });

    assert.equal(func('hello'), 'too short',
      'returns custom message if invalid');
  });
});
