import { module, test } from 'qunit';
import number from '@zestia/ember-validation/constraints/number';

module('number', function () {
  test('is returns nothing when valid', function (assert) {
    assert.expect(1);

    assert.strictEqual(number()('123'), undefined);
  });

  test('it returns default message if invalid', function (assert) {
    assert.expect(1);

    assert.strictEqual(number()('xyz'), 'Invalid number');
  });

  test('it returns nothing if invalid, but options', function (assert) {
    assert.expect(1);

    assert.strictEqual(
      number({ optional: true })(''),
      undefined,
      'returns nothing if invalid, but optional'
    );
  });

  test('it returns custom message if invalid', function (assert) {
    assert.expect(1);

    const func = number({ message: 'bad number' });

    assert.strictEqual(func('foo@bar'), 'bad number');
  });

  test('inputs', function (assert) {
    assert.expect(7);

    assert.strictEqual(number()(), 'Invalid number');
    assert.strictEqual(number()(''), 'Invalid number');
    assert.strictEqual(number()('abc'), 'Invalid number');
    assert.strictEqual(number()('12345'), undefined);
    assert.strictEqual(number()('-12345'), undefined);
    assert.strictEqual(number()('123,456,789'), undefined);
    assert.strictEqual(number()('123.456'), undefined);
  });
});
