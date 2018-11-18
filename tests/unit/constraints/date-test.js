import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import dateConstraint, {
  validDate,
  getLongDateFormat
} from '@zestia/ember-validation/constraints/date';
import moment from 'moment';

module('date', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    moment.locale('en-gb');
  });

  test('#validDate', function(assert) {
    assert.expect(16);

    assert.strictEqual(validDate(), false);
    assert.strictEqual(validDate('xyz'), false);
    assert.strictEqual(validDate('2015-12-25'), true);
    assert.strictEqual(validDate('14 July 2015 00:00', 'LLL'), true);

    // Specific format

    assert.strictEqual(validDate('', 'D-M/YY'), false);
    assert.strictEqual(validDate('1-22/85', 'D-M/YY'), false);
    assert.strictEqual(validDate('22-1/85', 'D-M/YY'), true);

    // Multiple specific formats

    assert.strictEqual(validDate('1/85', ['M.YY', 'M-YY']), false);
    assert.strictEqual(validDate('1.85', ['M.YY', 'M-YY']), true);
    assert.strictEqual(validDate('1-85', ['M.YY', 'M-YY']), true);

    // Specific local format

    assert.strictEqual(validDate('', 'L'), false);
    assert.strictEqual(validDate('01/22/1985', 'L'), false);
    assert.strictEqual(validDate('22/01/1985', 'L'), true);

    moment.locale('en-us');

    assert.strictEqual(validDate('', 'L'), false);
    assert.strictEqual(validDate('22/01/1985', 'L'), false);
    assert.strictEqual(validDate('01/22/1985', 'L'), true);
  });

  test('#getLongDateFormat', function(assert) {
    assert.expect(4);

    assert.equal(getLongDateFormat('L'), 'DD/MM/YYYY', 'converts shorthand to longhand');

    moment.locale('en-us');

    assert.equal(
      getLongDateFormat('L'),
      'MM/DD/YYYY',
      'converts shorthand to longhand, responds to change of locale'
    );

    assert.equal(getLongDateFormat('XYZ'), 'XYZ', 'lets incorrect formats pass through');

    assert.equal(getLongDateFormat(), null, 'does not blow up');
  });

  test('#dateConstraint', function(assert) {
    assert.expect(6);

    let func;

    func = dateConstraint({ format: 'D-M/YY' });

    assert.equal(func('1-12/98'), null, 'returns nothing when valid');

    assert.equal(
      func('foo'),
      'invalid date, expecting D-M/YY',
      'returns default message if invalid including specified format'
    );

    func = dateConstraint({ format: 'L' });

    assert.equal(
      func('foo'),
      'invalid date, expecting DD/MM/YYYY',
      'returns default message if invalid including parsed format'
    );

    moment.locale('en-us');

    assert.equal(
      func('foo'),
      'invalid date, expecting MM/DD/YYYY',
      'returns default message if invalid, including localised format'
    );

    func = dateConstraint({ optional: true });

    assert.equal(func(''), null, 'returns nothing if invalid, but optional');

    func = dateConstraint({ message: 'bad date', optional: true });

    assert.equal(func('xyz'), 'bad date', 'returns custom message if invalid');
  });
});
