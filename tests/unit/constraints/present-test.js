import { module, test } from 'qunit';
import present from '@zestia/ember-validation/constraints/present';

module('present', function () {
  test('it returns nothing when valid', function (assert) {
    assert.expect(1);

    assert.strictEqual(present()('hi'), undefined);
  });

  test('it returns default message if invalid', function (assert) {
    assert.expect(1);

    assert.equal(present()(''), 'required value');
  });

  test('it returns custom message if invalid', function (assert) {
    assert.expect(1);

    assert.equal(present({ message: 'nothing there' })(), 'nothing there');
  });
});
