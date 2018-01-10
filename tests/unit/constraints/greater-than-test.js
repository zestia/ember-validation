import { module, test } from 'qunit';
import greaterThanConstraint, {
  greaterThan
} from '@zestia/ember-validation/constraints/greater-than';

module('greater-than', function() {
  test('#greaterThan', function(assert) {
    assert.expect(8);

    assert.strictEqual(greaterThan(undefined), false);
    assert.strictEqual(greaterThan(null), false);
    assert.strictEqual(greaterThan(1, 2), false);
    assert.strictEqual(greaterThan(2, 1), true);
    assert.strictEqual(greaterThan(3, 3), false);
    assert.strictEqual(greaterThan(-10, -5), false);
    assert.strictEqual(greaterThan('a', 'aa'), false);
    assert.strictEqual(greaterThan('aa', 'a'), true);
  });

  test('#greaterThanConstraint', function(assert) {
    assert.expect(3);

    let func;

    func = greaterThanConstraint({ value: 10 });

    assert.equal(func(11), null,
      'returns nothing when valid');

    assert.equal(func(10), 'must be greater than 10',
      'returns default message if invalid');

    func = greaterThanConstraint({ value: 2, message: 'not big enough' });

    assert.equal(func(2), 'not big enough',
      'returns custom message if invalid');
  });
});
