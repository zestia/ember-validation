import QUnit, { module, test, skip } from 'qunit';
import EmberObject from '@ember/object';
/* eslint-disable */
import { readOnly } from '@ember/object/computed';
/* eslint-enable */
import { ValidationError } from '@zestia/ember-validation/errors';
import {
  date,
  email,
  lessThan,
  greaterThan,
  minLength,
  present
} from '@zestia/ember-validation/constraints';
import validate from '@zestia/ember-validation';
import { resolve } from 'rsvp';
const { assert } = QUnit;

module('validation', function() {
  assert.errorEqual = function(a, b, message) {
    assert.deepEqual(a.result, b.result, message);
  };

  test('#validate (defaults)', async function(assert) {
    assert.expect(2);

    const result = await validate();

    assert.strictEqual(result, null, 'no errors by default');

    try {
      await validate(null, { foo: [present()] });
    } catch (error) {
      assert.strictEqual(error instanceof ValidationError, true, 'throws a validation error');
    }
  });

  test('#validate (basics)', async function(assert) {
    assert.expect(2);

    const object = {};

    const constraints = {
      name: [present()]
    };

    try {
      await validate(object, constraints);
    } catch (error) {
      assert.errorEqual(
        error,
        new ValidationError(null, {
          name: ['required value']
        }),
        'resolves an object matching the original constraints structure with an ' +
          'array of error messages'
      );
    }

    object.name = 'Fred';

    const result = await validate(object, constraints);

    assert.strictEqual(result, null, 'resolves null when validation passes');
  });

  test('#validate (multiple constraints)', async function(assert) {
    assert.expect(1);

    const constraints = {
      emailAddress: [present(), email()]
    };

    try {
      await validate(null, constraints);
    } catch (error) {
      assert.errorEqual(
        error,
        new ValidationError(null, {
          emailAddress: ['required value', 'invalid email']
        }),
        "multiple constraints are applied to the object's properties"
      );
    }
  });

  test('#validate (multiple properties)', async function(assert) {
    assert.expect(1);

    const object = {
      firstName: '',
      emailAddress: '',
      dob: '22-1-85'
    };

    const constraints = {
      firstName: [present()],
      emailAddress: [email()],
      dob: [date({ format: 'D-M-YY' })]
    };

    try {
      await validate(object, constraints);
    } catch (error) {
      assert.errorEqual(
        error,
        new ValidationError(null, {
          firstName: ['required value'],
          emailAddress: ['invalid email'],
          dob: []
        }),
        "constraints are applied to the object's properties"
      );
    }
  });

  test('#validate (made-up properties)', async function(assert) {
    assert.expect(3);

    const message = 'First and last name are both required';

    const hasFirstAndLastName = function() {
      return function() {
        if (this.firstName && this.lastName) {
          return;
        }

        return message;
      };
    };

    const object = {
      firstName: '',
      lastName: ''
    };

    const constraints = {
      firstAndLastName: [hasFirstAndLastName()]
    };

    try {
      await validate(object, constraints);
    } catch (error) {
      assert.errorEqual(
        error,
        new ValidationError(null, {
          firstAndLastName: [message]
        }),
        'can provide an adhoc constraint'
      );
    }

    object.firstName = 'Fred';

    try {
      await validate(object, constraints);
    } catch (error) {
      assert.errorEqual(
        error,
        new ValidationError(null, {
          firstAndLastName: [message]
        }),
        'precondition: still invalid'
      );
    }

    object.lastName = 'Smith';

    const result = await validate(object, constraints);

    assert.strictEqual(result, null, 'the adhoc constraint works');
  });

  test('#validate (array of objects)', async function(assert) {
    assert.expect(3);

    const tag1 = { name: '' };
    const tag2 = { name: '' };
    const tag3 = { name: 'Family' };

    const person = {
      name: '',
      tags: resolve([tag1, tag2])
    };

    const constraints = {
      name: [present()],
      tags: [
        minLength({
          min: 3,
          message: 'you must have at least 3 tags'
        })
      ],
      'tags[]': {
        name: [present()]
      }
    };

    try {
      await validate(person, constraints);
    } catch (error) {
      assert.errorEqual(
        error,
        new ValidationError(null, {
          name: ['required value'],
          tags: ['you must have at least 3 tags'],
          'tags[]': [{ name: ['required value'] }, { name: ['required value'] }]
        }),
        'square brackets [] indicates an array of objects to validate'
      );
    }

    person.name = 'Fred';
    tag1.name = 'Friend';
    person.tags = [tag1, tag2, tag3];

    try {
      await validate(person, constraints);
    } catch (error) {
      assert.errorEqual(
        error,
        new ValidationError(null, {
          name: [],
          tags: [],
          'tags[]': [{ name: [] }, { name: ['required value'] }, { name: [] }]
        })
      );
    }

    person.tags[1].name = 'Acquaintance';

    const result = await validate(person, constraints);

    assert.strictEqual(result, null, 'validating an array of objects works OK');
  });

  test('#validate (array of objects, individually)', async function(assert) {
    assert.expect(2);

    const starter = { name: '' };
    const main = { name: '' };
    const dessert = { name: '' };

    const meal = {
      courses: [
        starter,
        main,
        dessert
      ]
    };

    const constraints = {
      'courses.0.name': [present()],
      'courses.1.name': [present()],
      'courses.2.name': [present()]
    };

    try {
      await validate(meal, constraints);
    } catch (error) {
      assert.errorEqual(
        error,
        new ValidationError(null, {
          'courses.0.name': ['required value'],
          'courses.1.name': ['required value'],
          'courses.2.name': ['required value']
        }),
        'error has correct keys and error messages'
      );
    }

    main.name = 'Lamb';

    try {
      await validate(meal, constraints);
    } catch (error) {
      assert.errorEqual(
        error,
        new ValidationError(null, {
          'courses.0.name': ['required value'],
          'courses.1.name': [],
          'courses.2.name': ['required value']
        }),
        'error has correct keys and error messages'
      );
    }
  });

  test('#validate (expecting an array of objects)', async function(assert) {
    assert.expect(1);

    const person = {
      name: ''
    };

    const constraints = {
      name: [present()],
      'tags[]': {
        name: [present()]
      }
    };

    try {
      await validate(person, constraints);
    } catch (error) {
      assert.errorEqual(
        error,
        new ValidationError(null, {
          name: ['required value'],
          'tags[]': []
        }),
        'does not blow up if array not found'
      );
    }
  });

  skip('#validate (aliasing array errors)', async function(assert) {
    assert.expect(1);

    // Deprecated ember-meta.descriptor-on-object
    // https://deprecations-app-prod.herokuapp.com/deprecations/v3.x/#toc_use-defineProperty-to-define-computed-properties

    const foo = EmberObject.create({
      thingErrors: readOnly('errors.things[]'),

      things: [{ name: '' }, { name: 'foo' }, { name: '' }],

      constraints: {
        'things[]': {
          name: [present()]
        }
      },

      async validate() {
        try {
          await validate(this, this.constraints);
        } catch (error) {
          this.set('errors', error.result);
        }
      }
    });

    await foo.validate();

    assert.errorEqual(
      foo.thingErrors,
      [{ name: ['required value'] }, { name: [] }, { name: ['required value'] }],
      'alias still works with square bracket syntax'
    );
  });

  test('#validate (custom error messages)', async function(assert) {
    assert.expect(1);

    const constraints = {
      description: [
        present({
          message: 'You must enter a description'
        })
      ]
    };

    try {
      await validate(null, constraints);
    } catch (error) {
      assert.errorEqual(
        error,
        new ValidationError(null, {
          description: ['You must enter a description']
        }),
        'can override the default constraint message'
      );
    }
  });

  test('#validate (dynamic error messages)', async function(assert) {
    assert.expect(3);

    const object = {
      emailAddress: 'foo@bar'
    };

    const constraints = {
      emailAddress: [
        email({
          message(value) {
            assert.strictEqual(
              value,
              'foo@bar',
              'custom message function receives value being validated'
            );

            assert.deepEqual(
              this,
              object,
              'custom message function is called in the context of the object being validated'
            );

            return `The email address ${value} is not valid`;
          }
        })
      ]
    };

    try {
      await validate(object, constraints);
    } catch (error) {
      assert.errorEqual(
        error,
        new ValidationError(null, {
          emailAddress: ['The email address foo@bar is not valid']
        }),
        'can specify a function to build a custom error message'
      );
    }
  });

  test('#validate (dynamic error message escaping)', async function(assert) {
    assert.expect(1);

    const object = {
      name: '<script>'
    };

    const constraints = {
      name: [
        minLength({
          min: 9,
          message(value) {
            return `Your name ${value} is too short`;
          }
        })
      ]
    };

    try {
      await validate(object, constraints);
    } catch (error) {
      assert.errorEqual(
        error,
        new ValidationError(null, {
          name: ['Your name <script> is too short']
        }),
        'it is not the concern of the validator to be escaping messages'
      );
    }
  });

  test('#validate (path properties)', async function(assert) {
    assert.expect(1);

    const person = {
      name: '',
      organisation: {
        name: '',
        tags: [
          {
            name: 'client',
            description: null
          }
        ]
      }
    };

    const constraints = {
      name: [present()],
      'organisation.name': [present(), minLength({ min: 1 })],
      'organisation.tags': [minLength({ min: 2 })],
      'organisation.tags[]': {
        name: [present(), minLength({ min: 1 })],
        description: [present()]
      }
    };

    try {
      await validate(person, constraints);
    } catch (error) {
      assert.errorEqual(
        error,
        new ValidationError(null, {
          name: ['required value'],
          'organisation.name': ['required value', 'length must be at least 1'],
          'organisation.tags': ['length must be at least 2'],
          'organisation.tags[]': [
            {
              name: [],
              description: ['required value']
            }
          ]
        }),
        'validation works with key paths'
      );
    }
  });

  test('#validate (case of properties)', async function(assert) {
    assert.expect(1);

    const constraints = {
      fOoBaR: [present()]
    };

    try {
      await validate(null, constraints);
    } catch (error) {
      assert.errorEqual(
        error,
        new ValidationError(null, {
          fOoBaR: ['required value']
        }),
        'case of keys in result errors object is retained'
      );
    }
  });

  test('#validate (dodgy object)', async function(assert) {
    assert.expect(2);

    const constraints = {
      length: [lessThan({ value: 4 })]
    };

    try {
      await validate('norf', constraints);
    } catch (error) {
      assert.errorEqual(
        error,
        new ValidationError(null, {
          length: ['must be less than 4']
        }),
        'returns errors as expected'
      );
    }

    const result = await validate('foo', constraints);

    assert.strictEqual(result, null, 'validates the value as if it were an object');
  });

  test('#validate (cumulative validity)', async function(assert) {
    assert.expect(1);

    const object = {
      firstName: '',
      lastName: 'Smith'
    };

    const constraints = {
      firstName: [present()],
      lastName: [present()]
    };

    try {
      await validate(object, constraints);
    } catch (error) {
      assert.errorEqual(
        error,
        new ValidationError(null, {
          firstName: ['required value'],
          lastName: []
        }),
        'regression: validity is not just of the last value processed'
      );
    }
  });

  test('#validate (promises)', async function(assert) {
    assert.expect(3);

    let object = resolve({
      amount: resolve(9)
    });

    const constraints = {
      amount: [greaterThan({ value: 10 })]
    };

    try {
      await validate(object, constraints);
    } catch (error) {
      assert.errorEqual(
        error,
        new ValidationError(null, {
          amount: ['must be greater than 10']
        }),
        'resolves the object and its values, and rejects with the errors'
      );

      assert.equal(error.message, 'Validation failed', 'has a default error message');
    }

    object = resolve({
      amount: resolve(11)
    });

    const result = await validate(object, constraints);

    assert.strictEqual(result, null, 'resolves with no errors');
  });

  test('#validate (array)', async function(assert) {
    assert.expect(2);

    const array = [
      {
        foo: 'Hello World',
        bar: null
      },
      {
        foo: null,
        bar: 'hello@world.com'
      }
    ];

    try {
      await validate(array);
    } catch (error) {
      assert.equal(
        error.message,
        `
  Validation is for named errors, validate your array like so: {
    'myArray': [minLength({ min: 2 })],
    'myArray[]': {
      foo: [present()],
      bar: [email()]
    }
  }
`
      );
    }

    const object = {
      myArray: array
    };

    const constraints = {
      'myArray[]': {
        foo: [present()],
        bar: [email()]
      }
    };

    try {
      await validate(object, constraints);
    } catch (error) {
      assert.deepEqual(
        error.result['myArray[]'],
        [
          {
            foo: [],
            bar: ['invalid email']
          },
          {
            foo: ['required value'],
            bar: []
          }
        ],
        'validates items in the array'
      );
    }
  });
});
