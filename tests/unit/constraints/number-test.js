import { module, test } from 'qunit';
import numberConstraint, { validNumber } from 'ember-validation/constraints/number';

module('number', function() {
  test('#validNumber', function(assert) {
    assert.expect(6);

    assert.strictEqual(validNumber(), false);
    assert.strictEqual(validNumber(''), false);
    assert.strictEqual(validNumber('12345'), true);
    assert.strictEqual(validNumber('123,456,789'), true);
    assert.strictEqual(validNumber('123.456'), true);
    assert.strictEqual(validNumber('abc'), false);
  });

  test('#numberConstraint', function(assert) {
    assert.expect(4);

    let func;

    func = numberConstraint();

    assert.equal(func('123'), null,
      'returns nothing when valid');

    assert.equal(func('xyz'), 'invalid number',
      'returns default message if invalid');

    func = numberConstraint({ optional: true });

    assert.equal(func(''), null,
      'returns nothing if invalid, but optional');

    func = numberConstraint({ message: 'bad number', optional: true });

    assert.equal(func('foo@bar'), 'bad number',
      'returns custom message if invalid');
  });
});
