import { module, test } from 'qunit';
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

module('validation', function () {
  test('#validate (defaults)', async function (assert) {
    assert.expect(1);

    const errors = await validate({}, {});

    assert.deepEqual(errors, null, 'no errors by default');
  });

  test('#validate (object constraints)', async function (assert) {
    assert.expect(1);

    const object = {};

    const constraints = (object) => {
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

  test('#validate (array constraints)', async function (assert) {
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

  test('#validate (basics)', async function (assert) {
    assert.expect(2);

    const object = {};

    const constraints = {
      name() {
        return [present()];
      }
    };

    let errors = await validate(object, constraints);

    assert.deepEqual(errors, {
      name: ['Required value']
    });

    object.name = 'Fred';

    errors = await validate(object, constraints);

    assert.strictEqual(errors, null);
  });

  test('#validate (multiple constraints)', async function (assert) {
    assert.expect(1);

    const object = {};

    const constraints = {
      emailAddress() {
        return [present(), email()];
      }
    };

    const errors = await validate(object, constraints);

    assert.deepEqual(errors, {
      emailAddress: ['Required value', 'Invalid email']
    });
  });

  test('#validate (multiple properties)', async function (assert) {
    assert.expect(1);

    const object = {
      firstName: '',
      emailAddress: '',
      dob: '22/01/1985'
    };

    const constraints = {
      firstName() {
        return [present()];
      },
      emailAddress() {
        return [email()];
      },
      dob() {
        return [date({ format: 'dd/MM/yyyy' })];
      }
    };

    const errors = await validate(object, constraints);

    assert.deepEqual(errors, {
      firstName: ['Required value'],
      emailAddress: ['Invalid email'],
      dob: null
    });
  });

  test('#validate (adhoc constraints)', async function (assert) {
    assert.expect(3);

    const message = 'First and last name are both required';

    const hasFirstAndLastName = (value, object) => {
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

    let errors = await validate(object, constraints);

    assert.deepEqual(errors, {
      firstAndLastName: [message]
    });

    object.firstName = 'Fred';

    errors = await validate(object, constraints);

    assert.deepEqual(errors, {
      firstAndLastName: [message]
    });

    object.lastName = 'Smith';

    errors = await validate(object, constraints);

    assert.strictEqual(errors, null);
  });

  test('#validate (array of objects)', async function (assert) {
    assert.expect(3);

    const args = [];

    const person1 = { firstName: 'fred', lastName: 'smith' };
    const person2 = { firstName: 'joe' };

    const array = [person1, person2];

    const constraints = (person) => {
      args.push(person);

      return {
        firstName() {
          return [present()];
        },

        lastName() {
          return [present()];
        }
      };
    };

    let errors = await validate(array, constraints);

    assert.deepEqual(errors, [
      null,
      {
        firstName: null,
        lastName: ['Required value']
      }
    ]);

    assert.deepEqual(args, [person1, person2]);

    person2.lastName = 'bloggs';

    errors = await validate(array, constraints);

    assert.strictEqual(errors, null);
  });

  test('#validate (array of objects, individually)', async function (assert) {
    assert.expect(2);

    const starter = { name: '' };
    const main = { name: '' };
    const dessert = { name: '' };
    const meal = { courses: [starter, main, dessert] };

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

    let errors = await validate(meal, constraints);

    assert.deepEqual(errors, {
      'courses.0.name': ['Required value'],
      'courses.1.name': ['Required value'],
      'courses.2.name': ['Required value']
    });

    main.name = 'Lamb';

    errors = await validate(meal, constraints);

    assert.deepEqual(errors, {
      'courses.0.name': ['Required value'],
      'courses.1.name': null,
      'courses.2.name': ['Required value']
    });
  });

  test('#validate (expecting an array of objects)', async function (assert) {
    assert.expect(1);

    const array = [{ id: 1 }, {}, null, undefined];

    const constraints = () => {
      return {
        id() {
          return [present()];
        }
      };
    };

    const errors = await validate(array, constraints);

    assert.deepEqual(errors, [
      null,
      { id: ['Required value'] },
      { id: ['Required value'] },
      { id: ['Required value'] }
    ]);
  });

  test('#validate (custom error messages)', async function (assert) {
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

    const errors = await validate(object, constraints);

    assert.deepEqual(errors, {
      description: ['You must enter a description']
    });
  });

  test('#validate (custom error message functions)', async function (assert) {
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

    const errors = await validate(object, constraints);

    assert.deepEqual(errors, {
      emailAddress: ['The email address foo@bar is not valid']
    });

    assert.deepEqual(args, ['foo@bar', object]);
  });

  test('#validate (custom error message functions - no escaping)', async function (assert) {
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

    const errors = await validate(object, constraints);

    assert.deepEqual(errors, {
      name: ['Your name <script> is too short']
    });
  });

  test('#validate (path properties)', async function (assert) {
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

    const errors = await validate(person, constraints);

    assert.deepEqual(errors, {
      name: ['Required value'],
      'organisation.name': ['Required value', 'Length must be at least 1']
    });
  });

  test('#validate (case of properties)', async function (assert) {
    assert.expect(1);

    const object = {};

    const constraints = {
      fOoBaR() {
        return [present()];
      }
    };

    const errors = await validate(object, constraints);

    assert.deepEqual(errors, {
      fOoBaR: ['Required value']
    });
  });

  test('#validate (cumulative validity)', async function (assert) {
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

    const errors = await validate(object, constraints);

    assert.deepEqual(errors, {
      firstName: ['Required value'],
      lastName: null
    });
  });

  test('#validate object (thenable)', function (assert) {
    assert.expect(1);

    const object = {};

    const constraints = {
      name() {
        return [present()];
      }
    };

    return validate(object, constraints).then((errors) => {
      assert.deepEqual(errors, {
        name: ['Required value']
      });
    });
  });

  test('#validate array (thenable)', function (assert) {
    assert.expect(1);

    const array = [{}, {}];

    const constraints = (item) => ({
      name() {
        return [present()];
      }
    });

    return validate(array, constraints).then((errors) => {
      assert.deepEqual(errors, [
        {
          name: ['Required value']
        },
        {
          name: ['Required value']
        }
      ]);
    });
  });

  test('#validate (promises)', async function (assert) {
    assert.expect(2);

    let object = resolve({
      amount: resolve(9)
    });

    const constraints = {
      amount() {
        return [greaterThan({ value: 10 })];
      }
    };

    let errors = await validate(object, constraints);

    assert.deepEqual(errors, {
      amount: ['Must be greater than 10']
    });

    object = resolve({
      amount: resolve(11)
    });

    errors = await validate(object, constraints);

    assert.strictEqual(errors, null);
  });

  test('readme example', async function (assert) {
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

    const knownType = (type) => {
      if (!['text', 'number', 'email', 'date'].includes(type)) {
        return 'Unknown type';
      }
    };

    const constraints = (item) => {
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
              return [present(), date({ format: 'dd/MM/yyyy' })];
            default:
              return [];
          }
        }
      };
    };

    const errors = await validate(items, constraints);

    assert.deepEqual(errors, [
      {
        type: null,
        value: ['Required value']
      },
      {
        type: null,
        value: ['Required value', 'Invalid number']
      },
      {
        type: null,
        value: ['Required value', 'Invalid email']
      },
      {
        type: null,
        value: ['Required value', 'Invalid date, expecting dd/MM/yyyy']
      },
      {
        type: ['Unknown type'],
        value: null
      }
    ]);
  });
});
