import { module, test } from 'qunit';
import { number } from '@zestia/ember-validation/constraints';
import { setMessageFn } from '@zestia/ember-validation';
import { testMessageFn, defaultMessageFn } from '../helper';

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

  test('it returns default message if negative with whole option', function (assert) {
    assert.expect(1);

    assert.strictEqual(number({ whole: true })('-24'), 'Invalid number');
  });

  test('it returns default message if fractional with whole option', function (assert) {
    assert.expect(1);

    assert.strictEqual(number({ whole: true })('2.4'), 'Invalid number');
  });

  test('it returns custom message if invalid', function (assert) {
    assert.expect(1);

    setMessageFn(testMessageFn);

    const func = number({ key: 'number.bad-number' });

    assert.strictEqual(func('foo@bar'), 'bad number');
  });

  test('inputs, non-whole', function (assert) {
    assert.expect(15);

    const validExamples = [
      12345,
      '12345',
      -12345,
      '-12345',
      '123,456,789',
      123.45,
      '123.45',
      '01',
      0,
      '0',
      10,
      '10'
    ];
    const invalidExamples = [null, '', 'abc'];

    testInputs(assert, {}, validExamples, invalidExamples);
  });

  test('inputs, whole', function (assert) {
    assert.expect(15);

    const options = { whole: true };
    const validExamples = [
      0,
      '0',
      12345,
      '12345',
      123456789,
      '123,456,789',
      10,
      '10'
    ];
    const invalidExamples = [
      null,
      '',
      'abc',
      -12345,
      '-12345',
      123.45,
      '123.45'
    ];

    testInputs(assert, options, validExamples, invalidExamples);
  });

  function testInputs(assert, options, validExamples, invalidExamples) {
    validExamples.forEach((input) => {
      assert.strictEqual(number(options)(input), undefined);
    });

    invalidExamples.forEach((input) => {
      assert.strictEqual(number(options)(input), 'Invalid number');
    });
  }
});
