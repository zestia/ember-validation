import { module, test } from 'qunit';
import bigDecimaConstraint from '@zestia/ember-validation/constraints/big-decimal';

module('big-decimal', function() {
  test('#bigDecimaConstraint', function(assert) {
    assert.expect(12);

    let func;

    func = bigDecimaConstraint({ optional: true });

    assert.equal(func(''), null, 'allows blank values if marked as optional');

    func = bigDecimaConstraint({ maxIntegerDigits: 5, maxDecimalDigits: 0 });

    assert.equal(func(), 'value must be a number', 'returns validation message if value is blank');

    assert.equal(func('12345'), null, 'honours the maxIntegerDigits setting (pass)');

    assert.equal(func('123456'), 'value too large', 'honours the maxIntegerDigits setting (fail)');

    assert.equal(
      func('123.00'),
      null,
      'ignores trailing zeroes when applying maxDecimalDigits check of 0'
    );

    assert.equal(func('-12345'), null, 'does not count "-" as part of the integer part check');

    func = bigDecimaConstraint({ maxIntegerDigits: 5, maxDecimalDigits: 2 });

    assert.equal(
      func('12345.67'),
      null,
      'decimal digits are not counted as part of the maxIntegerDigits check'
    );

    assert.equal(func('1.23'), null, 'honours the maxDecimalDigits setting (pass)');

    assert.equal(
      func('1.234'),
      'value must have a maximum of 2 decimal places',
      'honours the maxDecimalDigits setting (fail)'
    );

    assert.equal(
      func('1.230'),
      null,
      'ignores trailing zeroes when applying maxDecimalDigits check'
    );

    assert.equal(func('bad'), 'value must be a number', 'should fail for alpha characters');

    assert.strictEqual(
      func('123.'),
      'value must be a number',
      'should fail for incomplete numbers'
    );
  });
});
