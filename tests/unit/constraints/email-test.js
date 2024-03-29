import { module, test } from 'qunit';
import { email } from '@zestia/ember-validation/constraints';
import { setMessageFn } from '@zestia/ember-validation';
import { testMessageFn, defaultMessageFn } from 'dummy/tests/unit/helper';

module('email', function (hooks) {
  hooks.afterEach(function () {
    setMessageFn(defaultMessageFn);
  });

  test('it returns nothing when valid', function (assert) {
    assert.expect(1);

    assert.strictEqual(email()('foo@bar.com'), undefined);
  });

  test('it returns default message if invalid', function (assert) {
    assert.expect(1);

    assert.strictEqual(email()(''), 'Invalid email');
  });

  test('it returns nothing if invalid, but optional', function (assert) {
    assert.expect(1);

    assert.strictEqual(email({ optional: true })(''), undefined);
  });

  test('it returns custom message if invalid', function (assert) {
    assert.expect(1);

    setMessageFn(testMessageFn);

    assert.strictEqual(
      email({ key: 'email.bad' })('foo@bar'),
      'foo@bar is not valid'
    );
  });

  test('inputs', function (assert) {
    assert.expect(8);

    assert.strictEqual(email()(), 'Invalid email');
    assert.strictEqual(email()(''), 'Invalid email');
    assert.strictEqual(email()('a'), 'Invalid email');
    assert.strictEqual(email()('@'), 'Invalid email');
    assert.strictEqual(email()('a@b'), 'Invalid email');
    assert.strictEqual(email()('a@b.com'), undefined);
    assert.strictEqual(email()('fred.smith@some-uni.ac.uk'), undefined);
    assert.strictEqual(email()('john.jones+test@example.com'), undefined);
  });
});
