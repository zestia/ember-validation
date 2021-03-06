import { module, test } from 'qunit';
import bigDecimal from '@zestia/ember-validation/constraints/big-decimal';

module('bigDecimal', function () {
  test('it allows blank values if marked as optional', function (assert) {
    assert.expect(1);

    assert.strictEqual(bigDecimal({ optional: true })(''), undefined);
  });

  test('it returns message if value is blank', function (assert) {
    assert.expect(1);

    assert.equal(
      bigDecimal({ maxIntegerDigits: 5, maxDecimalDigits: 0 })(),
      'Value must be a number'
    );
  });

  test('honours the maxIntegerDigits option', function (assert) {
    assert.expect(2);

    assert.strictEqual(
      bigDecimal({ maxIntegerDigits: 5, maxDecimalDigits: 0 })('12345'),
      undefined
    );

    assert.equal(
      bigDecimal({ maxIntegerDigits: 5, maxDecimalDigits: 0 })('123456'),
      'Value too large'
    );
  });

  test('it ignores trailing zeros when checking maxDecimalDigits of 0', function (assert) {
    assert.expect(1);

    assert.strictEqual(
      bigDecimal({ maxIntegerDigits: 5, maxDecimalDigits: 0 })('123.00'),
      undefined
    );
  });

  test('it does not count dash as part of the integer check', function (assert) {
    assert.expect(1);

    assert.strictEqual(
      bigDecimal({ maxIntegerDigits: 5, maxDecimalDigits: 0 })('-12345'),
      undefined
    );
  });

  test('decimal digits are not counted as part of maxIntegerDigits check', function (assert) {
    assert.expect(1);

    assert.equal(
      bigDecimal({ maxIntegerDigits: 5, maxDecimalDigits: 2 })('12345.67'),
      undefined
    );
  });

  test('it honours the maxDecimalDigits option', function (assert) {
    assert.expect(2);

    assert.strictEqual(
      bigDecimal({ maxIntegerDigits: 5, maxDecimalDigits: 2 })('1.23'),
      undefined
    );

    assert.equal(
      bigDecimal({ maxIntegerDigits: 5, maxDecimalDigits: 2 })('1.234'),
      'Value must have a maximum of 2 decimal places'
    );
  });

  test('it ignores trailing zeros when checking maxDecimalDigits', function (assert) {
    assert.expect(1);

    assert.strictEqual(
      bigDecimal({ maxIntegerDigits: 5, maxDecimalDigits: 2 })('1.230'),
      undefined
    );
  });

  test('it fails for alpha characters', function (assert) {
    assert.expect(1);

    assert.equal(
      bigDecimal({ maxIntegerDigits: 5, maxDecimalDigits: 2 })('bad'),
      'Value must be a number'
    );
  });

  test('it should fail for incomplete numbers', function (assert) {
    assert.expect(1);

    assert.equal(
      bigDecimal({ maxIntegerDigits: 5, maxDecimalDigits: 2 })('123.'),
      'Value must be a number'
    );
  });
});
