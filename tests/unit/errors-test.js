import { module, test } from 'qunit';
import EmberError from '@ember/error';
import { ValidationError } from 'ember-validation/errors';

class FooValidationError extends ValidationError {
  get defaultMessage() {
    return 'My default message';
  }
}

module('errors', function() {
  test('ValidationError', function(assert) {
    assert.expect(1);

    const error = new FooValidationError;

    assert.ok(error instanceof EmberError,
      'Validation errors extend Ember errors');
  });

  test('ValidationError (default message)', function(assert) {
    assert.expect(1);

    const error = new FooValidationError;

    assert.equal(error.message, 'My default message',
      'the main message property proxies the default message');
  });

  test('ValidationError (constructor)', function(assert) {
    assert.expect(2);

    const error = new FooValidationError('My custom message');

    assert.equal(error.customMessage, 'My custom message',
      'specifying a message via the constructor sets a custom message');

    assert.equal(error.message, 'My custom message',
      'the main message property proxies the custom message');
  });

  test('ValidationError (setter)', function(assert) {
    assert.expect(2);

    const error = new FooValidationError;

    error.message = 'My custom message';

    assert.equal(error.customMessage, 'My custom message',
      "setting via the message setter, sets a 'private' custom message");

    assert.equal(error.message, 'My custom message',
      'the main message property proxies the custom message');
  });

  test('ValidationError', function(assert) {
    assert.expect(2);

    const result = {
      myField: ['Not present', 'Must be longer than 10']
    };

    const error = new ValidationError(null, result);

    assert.equal(error.message, 'Validation failed',
      'has a default message');

    assert.deepEqual(error.result, result,
      'constructor can set the related validation result');
  });
});
