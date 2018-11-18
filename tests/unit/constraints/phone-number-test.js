import { module, test } from 'qunit';
import phoneNumberConstraint, {
  validPhoneNumber
} from '@zestia/ember-validation/constraints/phone-number';

module('phone-number', function() {
  test('#validPhoneNumber', function(assert) {
    assert.expect(7);

    assert.strictEqual(validPhoneNumber(), false);
    assert.strictEqual(validPhoneNumber(''), false);
    assert.strictEqual(validPhoneNumber('a'), false);
    assert.strictEqual(validPhoneNumber('abc123'), false);
    assert.strictEqual(validPhoneNumber('012345'), true);
    assert.strictEqual(validPhoneNumber('(123) 456-789'), true);
    assert.strictEqual(validPhoneNumber('123.456.789'), true);
  });

  test('#phoneNumberConstraint', function(assert) {
    assert.expect(4);

    let func;

    func = phoneNumberConstraint();

    assert.equal(func('079123456789'), null, 'returns nothing when valid');

    assert.equal(func('xyz'), 'invalid phone number', 'returns default message if invalid');

    func = phoneNumberConstraint({ optional: true });

    assert.equal(func(''), null, 'returns nothing if invalid, but optional');

    func = phoneNumberConstraint({ message: 'bad phone', optional: true });

    assert.equal(func('foo@bar'), 'bad phone', 'returns custom message if invalid');
  });
});
