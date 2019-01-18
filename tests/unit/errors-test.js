import { module, test } from 'qunit';
import { ValidationError } from '@zestia/ember-validation/errors';

class FooValidationError extends ValidationError {
  constructor() {
    super('My default message');
  }
}

module('errors', function() {
  test('ValidationError', function(assert) {
    assert.expect(1);

    const error = new ValidationError();

    assert.ok(error instanceof Error, 'Validation errors extend Error');
  });

  test('ValidationError (constructor)', function(assert) {
    assert.expect(1);

    const error = new ValidationError('My custom message');

    assert.equal(
      error.message,
      'My custom message',
      'can set the message via the constructor'
    );
  });

  test('ValidationError (default message)', function(assert) {
    assert.expect(2);

    const error = new FooValidationError('My custom message');

    assert.equal(
      error.message,
      'My default message',
      'can use a technique for default messages, constructor is ignored'
    );

    error.message = 'My custom message';

    assert.equal(
      error.message,
      'My custom message',
      'can still set the message property'
    );
  });

  test('ValidationError (result argument)', function(assert) {
    assert.expect(2);

    const result = {
      myField: ['Not present', 'Must be longer than 10']
    };

    const error = new ValidationError(null, result);

    assert.equal(error.message, 'Validation failed', 'has a default message');

    assert.deepEqual(error.result, result, 'constructor can set the related validation result');
  });
});
