import { module, test } from 'qunit';
import emailConstraint, { validEmail } from '@zestia/ember-validation/constraints/email';

module('email', function() {
  test('#validEmail', function(assert) {
    assert.expect(8);

    assert.strictEqual(validEmail(), false);
    assert.strictEqual(validEmail(''), false);
    assert.strictEqual(validEmail('a'), false);
    assert.strictEqual(validEmail('@'), false);
    assert.strictEqual(validEmail('a@b'), false);
    assert.strictEqual(validEmail('a@b.com'), true);
    assert.strictEqual(validEmail('fred.smith@some-uni.ac.uk'), true);
    assert.strictEqual(validEmail('john.jones+test@example.com'), true);
  });

  test('#emailConstraint', function(assert) {
    assert.expect(4);

    let func;

    func = emailConstraint();

    assert.equal(func('foo@bar.com'), null,
      'returns nothing when valid');

    assert.equal(func(''), 'invalid email',
      'returns default message if invalid');

    func = emailConstraint({ optional: true });

    assert.equal(func(''), null,
      'returns nothing if invalid, but optional');

    func = emailConstraint({ message: 'bad email', optional: true });

    assert.equal(func('foo@bar'), 'bad email',
      'returns custom message if invalid');
  });
});
