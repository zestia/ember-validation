import { module, test } from 'qunit';
import { flattenErrors, collateErrors } from '@zestia/ember-validation/utils';

module('utils', function (hooks) {
  hooks.beforeEach(function () {
    this.errors = {
      name: null,
      description: [
        'recipe must have a description',
        'description is too short'
      ],
      ingredients: [
        {
          name: ['ingredient name required'],
          quantity: ['quantity too small']
        },
        null,
        {
          name: null,
          quantity: ['quantity required', 'invalid unit']
        }
      ]
    };
  });

  module('#flattenErrors', function () {
    test('it flattens the object into an array of messages', function (assert) {
      assert.expect(1);

      assert.deepEqual(flattenErrors(this.errors), [
        'recipe must have a description',
        'description is too short',
        'ingredient name required',
        'quantity too small',
        'quantity required',
        'invalid unit'
      ]);
    });

    test('it flattens the array into an array of messages', function (assert) {
      assert.expect(1);

      assert.deepEqual(flattenErrors(this.errors.ingredients), [
        'ingredient name required',
        'quantity too small',
        'quantity required',
        'invalid unit'
      ]);
    });

    test('it returns null when there are no errors', function (assert) {
      assert.expect(3);

      assert.deepEqual(flattenErrors(null), null);
      assert.deepEqual(flattenErrors({}), null);
      assert.deepEqual(flattenErrors([]), null);
    });
  });

  module('#collateErrors', function () {
    test('it throws the object keys away, and retains the array structure', function (assert) {
      assert.expect(1);

      assert.deepEqual(collateErrors(this.errors.ingredients), [
        ['ingredient name required', 'quantity too small'],
        null,
        ['quantity required', 'invalid unit']
      ]);
    });

    test('it returns null when there are no errors', function (assert) {
      assert.expect(2);

      assert.deepEqual(collateErrors(null), null);
      assert.deepEqual(collateErrors([]), null);
    });

    test('it only supports arrays', function (assert) {
      assert.expect(1);
      assert.throws(() => collateErrors({}), 'Errors must be an array');
    });
  });
});
