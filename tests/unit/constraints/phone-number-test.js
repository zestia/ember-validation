import { module, test } from 'qunit';
import phoneNumber from '@zestia/ember-validation/constraints/phone-number';

module('phone-number', function () {
  test('it returns nothing when valid', function (assert) {
    assert.expect(1);

    assert.strictEqual(phoneNumber()('079123456789'), undefined);
  });

  test('it returns default message if invalid', function (assert) {
    assert.expect(1);

    assert.equal(phoneNumber()('xyz'), 'Invalid phone number');
  });

  test('it returns nothing if invalid, but is optional', function (assert) {
    assert.expect(1);

    assert.strictEqual(phoneNumber({ optional: true })(''), undefined);
  });

  test('it returns custom message if invalid', function (assert) {
    assert.expect(1);

    assert.equal(phoneNumber({ message: 'bad phone' })('foo@bar'), 'bad phone');
  });

  test('inputs', function (assert) {
    assert.expect(7);

    assert.equal(phoneNumber()(), 'Invalid phone number');
    assert.equal(phoneNumber()(''), 'Invalid phone number');
    assert.equal(phoneNumber()('a'), 'Invalid phone number');
    assert.equal(phoneNumber()('abc123'), 'Invalid phone number');
    assert.strictEqual(phoneNumber()('012345'), undefined);
    assert.strictEqual(phoneNumber()('(123) 456-789'), undefined);
    assert.strictEqual(phoneNumber()('123.456.789'), undefined);
  });
});
