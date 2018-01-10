import { module, test } from 'qunit';
import lessThanConstraint, {
  lessThan
} from 'ember-validation/constraints/less-than';

module('less-than', function() {
  test('#lessThan', function(assert) {
    assert.expect(8);

    assert.strictEqual(lessThan(undefined), false);
    assert.strictEqual(lessThan(null), false);
    assert.strictEqual(lessThan(1, 2), true);
    assert.strictEqual(lessThan(2, 1), false);
    assert.strictEqual(lessThan(3, 3), false);
    assert.strictEqual(lessThan(-10, -5), true);
    assert.strictEqual(lessThan('a', 'aa'), true);
    assert.strictEqual(lessThan('aa', 'a'), false);
  });

  test('#lessThanConstraint', function(assert) {
    assert.expect(3);

    let func;

    func = lessThanConstraint({ value: 10 });

    assert.equal(func(9), null,
      'returns nothing when valid');

    assert.equal(func(10), 'must be less than 10',
      'returns default message if invalid');

    func = lessThanConstraint({ value: 2, message: 'not small enough' });

    assert.equal(func(2), 'not small enough',
      'returns custom message if invalid');
  });
});
