import QUnit, { module, test } from 'qunit';
import { ValidationError } from '@zestia/ember-validation/errors';
import {
  date,
  email,
  number,
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
    assert.expect(1);

    const result = await validate();

    assert.deepEqual(result, null, 'no errors by default');
  });

  test('#validate (type of error)', async function(assert) {
    assert.expect(1);

    const object = {};

    const constraints = {
      foo() {
        return [present()];
      }
    };

    try {
      await validate(object, constraints);
    } catch (error) {
      assert.ok(error instanceof ValidationError);
    }
  });

  test('#validate (object constraints)', async function(assert) {
    assert.expect(1);

    const object = {};

    const constraints = object => {
      return {
        foo() {
          return [present()];
        }
      };
    };

    try {
      await validate(object, constraints);
    } catch (error) {
      assert.equal(
        error.message,
        'Assertion Failed: Constraints must be an object'
      );
    }
  });

  test('#validate (array constraints)', async function(assert) {
    assert.expect(1);

    const array = [];

    const constraints = {
      foo() {
        return [present()];
      }
    };

    try {
      await validate(array, constraints);
    } catch (error) {
      assert.equal(
        error.message,
        'Assertion Failed: Constraints must be a function'
      );
    }
  });

  test('#validate (basics)', async function(assert) {
    assert.expect(2);

    const object = {};

    const constraints = {
      name() {
        return [present()];
      }
    };

    try {
      await validate(object, constraints);
    } catch (error) {
      assert.errorEqual(
        error,
        new ValidationError(null, {
          name: ['required value']
        })
      );
    }

    object.name = 'Fred';

    const result = await validate(object, constraints);

    assert.deepEqual(result, null);
  });

  test('#validate (multiple constraints)', async function(assert) {
    assert.expect(1);

    const object = {};

    const constraints = {
      emailAddress() {
        return [present(), email()];
      }
    };

    try {
      await validate(object, constraints);
    } catch (error) {
      assert.errorEqual(
        error,
        new ValidationError(null, {
          emailAddress: ['required value', 'invalid email']
        })
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
      firstName() {
        return [present()];
      },
      emailAddress() {
        return [email()];
      },
      dob() {
        return [date({ format: 'D-M-YY' })];
      }
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
        })
      );
    }
  });

  test('#validate (adhoc constraints)', async function(assert) {
    assert.expect(3);

    const message = 'First and last name are both required';

    const hasFirstAndLastName = function(value, object) {
      if (object.firstName && object.lastName) {
        return;
      }

      return message;
    };

    const object = {
      firstName: '',
      lastName: ''
    };

    const constraints = {
      firstAndLastName() {
        return [hasFirstAndLastName];
      }
    };

    try {
      await validate(object, constraints);
    } catch (error) {
      assert.errorEqual(
        error,
        new ValidationError(null, {
          firstAndLastName: [message]
        })
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
        })
      );
    }

    object.lastName = 'Smith';

    const result = await validate(object, constraints);

    assert.deepEqual(result, null);
  });

  test('#validate (array of objects)', async function(assert) {
    assert.expect(3);

    const args = [];

    const tag1 = { name: 'foo' };
    const tag2 = { name: '' };

    const array = [tag1, tag2];

    const constraints = tag => {
      args.push(tag);

      return {
        name() {
          return [present()];
        }
      };
    };

    try {
      await validate(array, constraints);
    } catch (error) {
      assert.errorEqual(
        error,
        new ValidationError(null, [{ name: [] }, { name: ['required value'] }])
      );

      assert.deepEqual(args, [tag1, tag2]);
    }

    tag2.name = 'bar';

    const result = await validate(array, constraints);

    assert.deepEqual(result, null);
  });

  test('#validate (array of objects, individually)', async function(assert) {
    assert.expect(2);

    const starter = { name: '' };
    const main = { name: '' };
    const dessert = { name: '' };

    const meal = {
      courses: [starter, main, dessert]
    };

    const constraints = {
      'courses.0.name'() {
        return [present()];
      },
      'courses.1.name'() {
        return [present()];
      },
      'courses.2.name'() {
        return [present()];
      }
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
        })
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
        })
      );
    }
  });

  test('#validate (expecting an array of objects)', async function(assert) {
    assert.expect(1);

    const array = [{ id: 1 }, {}, null, undefined];

    const constraints = () => {
      return {
        id() {
          return [present()];
        }
      };
    };

    try {
      await validate(array, constraints);
    } catch (error) {
      assert.errorEqual(
        error,
        new ValidationError(null, [
          { id: [] },
          { id: ['required value'] },
          { id: ['required value'] },
          { id: ['required value'] }
        ])
      );
    }
  });

  test('#validate (custom error messages)', async function(assert) {
    assert.expect(1);

    const object = {};

    const constraints = {
      description() {
        return [
          present({
            message: 'You must enter a description'
          })
        ];
      }
    };

    try {
      await validate(object, constraints);
    } catch (error) {
      assert.errorEqual(
        error,
        new ValidationError(null, {
          description: ['You must enter a description']
        })
      );
    }
  });

  test('#validate (custom error message functions)', async function(assert) {
    assert.expect(2);

    let args;

    const object = {
      emailAddress: 'foo@bar'
    };

    const constraints = {
      emailAddress() {
        return [
          email({
            message(value, object) {
              args = [value, object];

              return `The email address ${value} is not valid`;
            }
          })
        ];
      }
    };

    try {
      await validate(object, constraints);
    } catch (error) {
      assert.errorEqual(
        error,
        new ValidationError(null, {
          emailAddress: ['The email address foo@bar is not valid']
        })
      );

      assert.deepEqual(args, ['foo@bar', object]);
    }
  });

  test('#validate (custom error message functions - no escaping)', async function(assert) {
    assert.expect(1);

    const object = {
      name: '<script>'
    };

    const constraints = {
      name() {
        return [
          minLength({
            min: 9,
            message(value) {
              return `Your name ${value} is too short`;
            }
          })
        ];
      }
    };

    try {
      await validate(object, constraints);
    } catch (error) {
      assert.errorEqual(
        error,
        new ValidationError(null, {
          name: ['Your name <script> is too short']
        })
      );
    }
  });

  test('#validate (path properties)', async function(assert) {
    assert.expect(1);

    const person = {
      name: '',
      organisation: {
        name: ''
      }
    };

    const constraints = {
      name() {
        return [present()];
      },

      'organisation.name'() {
        return [present(), minLength({ min: 1 })];
      }
    };

    try {
      await validate(person, constraints);
    } catch (error) {
      assert.errorEqual(
        error,
        new ValidationError(null, {
          name: ['required value'],
          'organisation.name': ['required value', 'length must be at least 1']
        })
      );
    }
  });

  test('#validate (case of properties)', async function(assert) {
    assert.expect(1);

    const object = {};

    const constraints = {
      fOoBaR() {
        return [present()];
      }
    };

    try {
      await validate(object, constraints);
    } catch (error) {
      assert.errorEqual(
        error,
        new ValidationError(null, {
          fOoBaR: ['required value']
        })
      );
    }
  });

  test('#validate (cumulative validity)', async function(assert) {
    assert.expect(1);

    const object = {
      firstName: '',
      lastName: 'Smith'
    };

    const constraints = {
      firstName() {
        return [present()];
      },
      lastName() {
        return [present()];
      }
    };

    try {
      await validate(object, constraints);
    } catch (error) {
      assert.errorEqual(
        error,
        new ValidationError(null, {
          firstName: ['required value'],
          lastName: []
        })
      );
    }
  });

  test('#validate (promises)', async function(assert) {
    assert.expect(2);

    let object = resolve({
      amount: resolve(9)
    });

    const constraints = {
      amount() {
        return [greaterThan({ value: 10 })];
      }
    };

    try {
      await validate(object, constraints);
    } catch (error) {
      assert.errorEqual(
        error,
        new ValidationError(null, {
          amount: ['must be greater than 10']
        })
      );
    }

    object = resolve({
      amount: resolve(11)
    });

    const result = await validate(object, constraints);

    assert.deepEqual(result, null);
  });

  test('readme example', async function(assert) {
    const items = [
      {
        id: 1,
        type: 'text',
        value: ''
      },
      {
        id: 2,
        type: 'number',
        value: ''
      },
      {
        id: 3,
        type: 'email',
        value: ''
      },
      {
        id: 4,
        type: 'date',
        value: ''
      },
      {
        id: 5,
        type: 'unknown',
        value: ''
      }
    ];

    const knownType = type => {
      if (!['text', 'number', 'email', 'date'].includes(type)) {
        return 'unknown type';
      }
    };

    const constraints = item => {
      return {
        type() {
          return [knownType];
        },

        value() {
          switch (item.type) {
            case 'text':
              return [present()];
            case 'number':
              return [present(), number()];
            case 'email':
              return [present(), email()];
            case 'date':
              return [present(), date({ format: 'L' })];
            default:
              return [];
          }
        }
      };
    };

    try {
      await validate(items, constraints);
    } catch (error) {
      assert.deepEqual(error.result, [
        {
          type: [],
          value: ['required value']
        },
        {
          type: [],
          value: ['required value', 'invalid number']
        },
        {
          type: [],
          value: ['required value', 'invalid email']
        },
        {
          type: [],
          value: ['required value', 'invalid date, expecting MM/DD/YYYY']
        },
        {
          type: ['unknown type'],
          value: []
        }
      ]);
    }
  });
});
