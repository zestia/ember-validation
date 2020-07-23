import { module, test } from 'qunit';
import {
  flattenMessages,
  collateMessages
} from '@zestia/ember-validation/utils';

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
        {
          name: null,
          quantity: null
        },
        {
          name: null,
          quantity: ['quantity required', 'invalid unit']
        }
      ]
    };
  });

  module('#flattenMessages', function () {
    test('it flattens the object into an array of messages', function (assert) {
      assert.expect(1);

      assert.deepEqual(flattenMessages(this.errors), [
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

      assert.deepEqual(flattenMessages(this.errors.ingredients), [
        'ingredient name required',
        'quantity too small',
        'quantity required',
        'invalid unit'
      ]);
    });

    test('it returns null when there are no errors', function (assert) {
      assert.expect(3);

      assert.deepEqual(flattenMessages(null), null);
      assert.deepEqual(flattenMessages({}), null);
      assert.deepEqual(flattenMessages([]), null);
    });
  });

  module('#collateMessages', function () {
    test('it throws the object keys away, and retains the array structure', function (assert) {
      assert.expect(1);

      assert.deepEqual(collateMessages(this.errors.ingredients), [
        ['ingredient name required', 'quantity too small'],
        null,
        ['quantity required', 'invalid unit']
      ]);
    });

    test('it returns null when there are no errors', function (assert) {
      assert.expect(2);
      assert.deepEqual(collateMessages(null), null);
      assert.deepEqual(collateMessages([]), null);
    });
  });
});
