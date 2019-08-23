import { module, test } from 'qunit';
import {
  flattenMessages,
  collateMessages
} from '@zestia/ember-validation/utils';

module('utils', function() {
  test('#flattenMessages', function(assert) {
    assert.expect(2);

    const result = {
      'recipe.description': [
        'recipe must have a description',
        'description is too short'
      ],
      'recipe.ingredients': [
        {
          name: ['ingredient name required'],
          quantity: ['quantity too small']
        },
        {
          name: [],
          quantity: []
        },
        {
          name: [],
          quantity: ['quantity required', 'invalid unit']
        }
      ]
    };

    assert.deepEqual(
      flattenMessages(result),
      [
        'recipe must have a description',
        'description is too short',
        'ingredient name required',
        'quantity too small',
        'quantity required',
        'invalid unit'
      ],
      'flattens the entire error result into just the messages'
    );

    assert.deepEqual(
      flattenMessages(result['recipe.ingredients']),
      [
        'ingredient name required',
        'quantity too small',
        'quantity required',
        'invalid unit'
      ],
      'flattens the array of error results into just the messages'
    );
  });

  test('#collateMessages', function(assert) {
    assert.expect(1);

    const result = {
      'recipe.ingredients': [
        {
          name: [],
          quantity: ['quantity required', 'invalid unit']
        },
        {
          name: [],
          quantity: []
        },
        {
          name: ['ingredient name required'],
          quantity: ['quantity too small']
        }
      ]
    };

    assert.deepEqual(
      collateMessages(result['recipe.ingredients']),
      [
        ['quantity required', 'invalid unit'],
        [],
        ['ingredient name required', 'quantity too small']
      ],
      'collates the array of error results into just the messages ' +
        'whilst retaining the array structure'
    );
  });
});
