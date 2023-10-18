import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { date } from '@zestia/ember-validation/constraints';
import enGB from 'date-fns/locale/en-GB';
import enUS from 'date-fns/locale/en-US';

module('date', function (hooks) {
  setupTest(hooks);

  test('it returns nothing when valid', function (assert) {
    assert.expect(1);

    assert.strictEqual(date({ format: 'dd/MM/yyyy' })('25/12/2020'), undefined);
  });

  test('it returns default message if invalid', function (assert) {
    assert.expect(1);

    assert.strictEqual(
      date({ format: 'dd/MM/yyyy' })('12/25/2020'),
      'Invalid date, expecting dd/MM/yyyy'
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

    assert.strictEqual(
      date({ message: 'bad date', format: 'dd/MM/yyyy' })('xyz'),
      'bad date'
    );
  });

  test('inputs', function (assert) {
    assert.expect(9);

    assert.strictEqual(
      date({ format: 'yyyy-MM-dd' })(''),
      'Invalid date, expecting yyyy-MM-dd'
    );

    assert.strictEqual(date({ format: 'yyyy-MM-dd' })('2020-12-25'), undefined);

    assert.strictEqual(
      date({ format: 'yyyy-MM-dd' })('2020-13-25'),
      'Invalid date, expecting yyyy-MM-dd'
    );

    assert.strictEqual(date({ format: 'dd/MM/yyyy' })('25/12/2020'), undefined);

    assert.strictEqual(
      date({ format: 'dd/MM/yyyy' })('12/25/2020'),
      'Invalid date, expecting dd/MM/yyyy'
    );

    assert.strictEqual(date({ format: 'MM/dd/yyyy' })('12/25/2020'), undefined);

    assert.strictEqual(
      date({ format: 'P', locale: enGB })('25/12/2020'),
      undefined
    );

    assert.strictEqual(
      date({ format: 'P', locale: enUS })('25/12/2020'),
      'Invalid date, expecting P'
    );

    assert.strictEqual(
      date({ format: 'P', locale: enUS })('12/25/2020'),
      undefined
    );
  });
});
