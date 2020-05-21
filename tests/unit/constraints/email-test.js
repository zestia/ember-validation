import { module, test } from 'qunit';
import email from '@zestia/ember-validation/constraints/email';

module('email', function () {
  test('it returns nothing when valid', function (assert) {
    assert.expect(1);

    assert.equal(email()('foo@bar.com'), undefined);
  });

  test('it returns default message if invalid', function (assert) {
    assert.expect(1);

    assert.equal(email()(''), 'invalid email');
  });

  test('it returns nothing if invalid, but optional', function (assert) {
    assert.expect(1);

    assert.strictEqual(email({ optional: true })(''), undefined);
  });

  test('it returns custom message if invalid', function (assert) {
    assert.expect(1);

    assert.equal(email({ message: 'bad email' })('foo@bar'), 'bad email');
  });

  test('inputs', function (assert) {
    assert.expect(8);

    assert.equal(email()(), 'invalid email');
    assert.equal(email()(''), 'invalid email');
    assert.equal(email()('a'), 'invalid email');
    assert.equal(email()('@'), 'invalid email');
    assert.equal(email()('a@b'), 'invalid email');
    assert.strictEqual(email()('a@b.com'), undefined);
    assert.strictEqual(email()('fred.smith@some-uni.ac.uk'), undefined);
    assert.strictEqual(email()('john.jones+test@example.com'), undefined);
  });
});
