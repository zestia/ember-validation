import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import date from '@zestia/ember-validation/constraints/date';
import { enGB, enUS } from 'date-fns/esm/locale';

module('date', function (hooks) {
  setupTest(hooks);

  test('it returns nothing when valid', function (assert) {
    assert.expect(1);

    assert.strictEqual(date({ format: 'dd/MM/yyyy' })('25/12/2020'), undefined);
  });

  test('it returns default message if invalid', function (assert) {
    assert.expect(1);

    assert.equal(
      date({ format: 'dd/MM/yyyy' })('12/25/2020'),
      'invalid date, expecting dd/MM/yyyy'
    );
  });

  test('it returns nothing if invalid, but optional', function (assert) {
    assert.expect(1);

    assert.strictEqual(
      date({ optional: true, format: 'dd/MM/yyyy' })(''),
      undefined
    );
  });

  test('it returns custom message if invalid', function (assert) {
    assert.expect(1);

    assert.equal(
      date({ message: 'bad date', format: 'dd/MM/yyyy' })('xyz'),
      'bad date'
    );
  });

  test('inputs', function (assert) {
    assert.expect(9);

    assert.equal(
      date({ format: 'yyyy-MM-dd' })(''),
      'invalid date, expecting yyyy-MM-dd'
    );

    assert.strictEqual(date({ format: 'yyyy-MM-dd' })('2020-12-25'), undefined);

    assert.strictEqual(
      date({ format: 'yyyy-MM-dd' })('2020-13-25'),
      'invalid date, expecting yyyy-MM-dd'
    );

    assert.strictEqual(date({ format: 'dd/MM/yyyy' })('25/12/2020'), undefined);

    assert.strictEqual(
      date({ format: 'dd/MM/yyyy' })('12/25/2020'),
      'invalid date, expecting dd/MM/yyyy'
    );

    assert.strictEqual(date({ format: 'MM/dd/yyyy' })('12/25/2020'), undefined);

    assert.strictEqual(
      date({ format: 'P', locale: enGB })('25/12/2020'),
      undefined
    );

    assert.equal(
      date({ format: 'P', locale: enUS })('25/12/2020'),
      'invalid date, expecting P'
    );

    assert.strictEqual(
      date({ format: 'P', locale: enUS })('12/25/2020'),
      undefined
    );
  });
});
