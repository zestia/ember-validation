import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import dateConstraint, {
  validDate,
} from '@zestia/ember-validation/constraints/date';
import { enGB, enUS } from 'date-fns/esm/locale';

module('date', function (hooks) {
  setupTest(hooks);

  test('#validDate', function (assert) {
    assert.expect(9);

    const ref = new Date();

    assert.strictEqual(validDate('', 'yyyy-MM-dd', ref), false);
    assert.strictEqual(validDate('2020-12-25', 'yyyy-MM-dd', ref), true);
    assert.strictEqual(validDate('2020-13-25', 'yyyy-MM-dd', ref), false);
    assert.strictEqual(validDate('25/12/2020', 'dd/MM/yyyy', ref), true);
    assert.strictEqual(validDate('12/25/2020', 'dd/MM/yyyy', ref), false);
    assert.strictEqual(validDate('12/25/2020', 'MM/dd/yyyy', ref), true);
    assert.strictEqual(
      validDate('25/12/2020', 'P', ref, { locale: enGB }),
      true
    );
    assert.strictEqual(
      validDate('25/12/2020', 'P', ref, { locale: enUS }),
      false
    );
    assert.strictEqual(
      validDate('12/25/2020', 'P', ref, { locale: enUS }),
      true
    );
  });

  test('#dateConstraint', function (assert) {
    assert.expect(4);

    let func;

    func = dateConstraint({ format: 'dd/MM/yyyy' });

    assert.equal(func('25/12/2020'), null, 'returns nothing when valid');

    assert.equal(
      func('12/25/2020'),
      'invalid date, expecting dd/MM/yyyy',
      'returns default message if invalid including specified format'
    );

    func = dateConstraint({ optional: true });

    assert.equal(func(''), null, 'returns nothing if invalid, but optional');

    func = dateConstraint({ message: 'bad date', optional: true });

    assert.equal(func('xyz'), 'bad date', 'returns custom message if invalid');
  });
});
