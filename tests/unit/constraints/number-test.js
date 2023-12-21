import { module, test } from 'qunit';
import { number } from '@zestia/ember-validation/constraints';
import { setMessageFn } from '@zestia/ember-validation';
import { testMessageFn, defaultMessageFn } from 'dummy/tests/unit/helper';

module('number', function (hooks) {
  hooks.afterEach(function () {
    setMessageFn(defaultMessageFn);
  });

  test('it returns nothing when valid', function (assert) {
    assert.expect(1);

    assert.strictEqual(number()('123'), undefined);
  });

  test('it returns default message if invalid', function (assert) {
    assert.expect(1);

    assert.strictEqual(number()('xyz'), 'Invalid number');
  });

  test('it returns nothing if invalid, but optional', function (assert) {
    assert.expect(1);

    assert.strictEqual(
      number({ optional: true })(''),
      undefined,
      'returns nothing if invalid, but optional'
    );
  });

  test('it returns default message if negative with natural option', function (assert) {
    assert.expect(1);

    assert.strictEqual(number({ natural: true })('-24'), 'Invalid number');
  });

  test('it returns default message if fractional with natural option', function (assert) {
    assert.expect(1);

    assert.strictEqual(number({ natural: true })('2.4'), 'Invalid number');
  });

  test('it returns custom message if invalid', function (assert) {
    assert.expect(1);

    setMessageFn(testMessageFn);

    const func = number({ key: 'number.bad-number' });

    assert.strictEqual(func('foo@bar'), 'bad number');
  });

  test('inputs', function (assert) {
    assert.expect(9);

    assert.strictEqual(number()(), 'Invalid number');
    assert.strictEqual(number()(''), 'Invalid number');
    assert.strictEqual(number()('abc'), 'Invalid number');
    assert.strictEqual(number()(12345), undefined);
    assert.strictEqual(number()('12345'), undefined);
    assert.strictEqual(number()('-12345'), undefined);
    assert.strictEqual(number()('123,456,789'), undefined);
    assert.strictEqual(number()('123.456'), undefined);
    assert.strictEqual(number()('0'), undefined);
  });

  test('inputs, natural', function (assert) {
    assert.expect(10);

    const options = { natural: true };

    assert.strictEqual(number(options)(), 'Invalid number');
    assert.strictEqual(number(options)(''), 'Invalid number');
    assert.strictEqual(number(options)('abc'), 'Invalid number');
    assert.strictEqual(number(options)('-12345'), 'Invalid number');
    assert.strictEqual(number(options)('123.45'), 'Invalid number');
    assert.strictEqual(number(options)('01'), 'Invalid number');
    assert.strictEqual(number(options)(12345), undefined);
    assert.strictEqual(number(options)('12345'), undefined);
    assert.strictEqual(number(options)('123,456,789'), undefined);
    assert.strictEqual(number(options)('0'), undefined);
  });
});
