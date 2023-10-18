import { module, test, skip } from 'qunit';
import {
  date,
  email,
  number,
  greaterThan,
  minLength,
  present
} from '@zestia/ember-validation/constraints';
import validate, { setMessageBuilder } from '@zestia/ember-validation';
import { setupTest } from 'ember-qunit';
import EmberObject from '@ember/object';
import { resolve } from 'rsvp';

module('#validate', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.store = this.owner.lookup('service:store');
  });

  test('it returns no errors by default', async function (assert) {
    assert.expect(1);

    const errors = await validate({}, {});

    assert.deepEqual(errors, null);
  });

  test('it checks the objects constraints', function (assert) {
    assert.expect(1);

    const object = {};

    const constraints = () => {
      return {
        name() {
          return [present()];
        }
      };
    };

    assert.rejects(
      validate(object, constraints),
      /Assertion Failed: Constraints must be an object/
    );
  });

  test('it checks the array constraints', function (assert) {
    assert.expect(1);

    const array = [];

    const constraints = {
      name() {
        return [present()];
      }
    };

    assert.rejects(
      validate(array, constraints),
      /Assertion Failed: Constraints must be a function/
    );
  });

  test('it validates single constraints', async function (assert) {
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

  test('it validates multiple constraints', async function (assert) {
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

  test('it validates multiple properties', async function (assert) {
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

  test('it allows adhoc constraints', async function (assert) {
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

  test('it allows async constraints', async function (assert) {
    assert.expect(2);

    const message = 'Please enter a lucky number';

    const isLucky = async (value) => {
      value = await value;

      if (value === 7) {
        return;
      }

      return message;
    };

    const object = {
      number: 0
    };

    const constraints = {
      number() {
        return [isLucky];
      }
    };

    let errors = await validate(object, constraints);

    assert.deepEqual(errors, {
      number: [message]
    });

    object.number = 7;

    errors = await validate(object, constraints);

    assert.strictEqual(errors, null);
  });

  test('it validates an array of objects', async function (assert) {
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

  test('it validates an array of objects via individual keys', async function (assert) {
    assert.expect(3);

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

    starter.name = 'Pâté';
    dessert.name = 'Crème caramel';

    errors = await validate(meal, constraints);

    assert.strictEqual(errors, null);
  });

  test('it handles non objects', async function (assert) {
    assert.expect(1);

    const array = [{ name: 1 }, {}, null, undefined];

    const constraints = () => {
      return {
        name() {
          return [present()];
        }
      };
    };

    const errors = await validate(array, constraints);

    assert.deepEqual(errors, [
      null,
      { name: ['Required value'] },
      { name: ['Required value'] },
      { name: ['Required value'] }
    ]);
  });

  test('it allows custom error messages', async function (assert) {
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

  test('it allows custom error message functions', async function (assert) {
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

  test('it does not escape messages', async function (assert) {
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

  test('it supports path properties', async function (assert) {
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

  test('it retains the case of the properties', async function (assert) {
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

  test('cumulative validity', async function (assert) {
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

  test('validating an object is thenable', function (assert) {
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

  test('validating an array is thenable', function (assert) {
    assert.expect(1);

    const array = [{}, {}];

    const constraints = () => ({
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

  test('it resolves the object and its properties', async function (assert) {
    assert.expect(2);

    let object = resolve({
      amount: resolve(10)
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

  test('it resolves the array and its objects', async function (assert) {
    assert.expect(2);

    let array = resolve([resolve({ amount: resolve(10) })]);

    const constraints = () => ({
      amount() {
        return [greaterThan({ value: 10 })];
      }
    });

    let errors = await validate(array, constraints);

    assert.deepEqual(errors, [
      {
        amount: ['Must be greater than 10']
      }
    ]);

    array = resolve([resolve({ amount: resolve(11) })]);

    errors = await validate(array, constraints);

    assert.strictEqual(errors, null);
  });

  test('it supports instances', async function (assert) {
    assert.expect(1);

    const object = EmberObject.create();

    const constraints = {
      name() {
        return [present()];
      }
    };

    const errors = await validate(object, constraints);

    assert.deepEqual(errors, {
      name: ['Required value']
    });
  });

  test('it supports ember data record arrays', async function (assert) {
    assert.expect(1);

    const foo = this.store.createRecord('foo');

    const constraints = {
      bars() {
        return [minLength({ min: 1 })];
      }
    };

    const errors = await validate(foo, constraints);

    assert.deepEqual(errors, {
      bars: ['Length must be at least 1']
    });
  });

  test('the readme example', async function (assert) {
    assert.expect(1);

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

  skip('internationalisation', async function (assert) {
    assert.expect(1);

    const object = {};

    const constraints = {
      name() {
        return [present()];
      }
    };

    const locale = {
      validation: {
        constraints: {
          present: 'Valor requerido'
        }
      }
    };

    setMessageBuilder((constraint) => {
      return locale.validation.constraints[constraint];
    });

    const errors = await validate(object, constraints);

    assert.deepEqual(errors, {});
  });
});
