# @zestia/ember-validation

<p>
  <a href="http://travis-ci.org/zestia/ember-validation">
    <img src="https://travis-ci.org/zestia/ember-validation.svg?branch=master">
  </a>

  <a href="https://david-dm.org/zestia/ember-validation#badge-embed">
    <img src="https://david-dm.org/zestia/ember-validation.svg">
  </a>

  <a href="https://david-dm.org/zestia/ember-validation#dev-badge-embed">
    <img src="https://david-dm.org/zestia/ember-validation/dev-status.svg">
  </a>

  <a href="https://emberobserver.com/addons/@zestia/ember-validation">
    <img src="https://emberobserver.com/badges/-zestia-ember-validation.svg">
  </a>

  <img src="https://img.shields.io/badge/Ember-%3E%3D%203.12-brightgreen">
</p>

This lightweight addon lets you validate an object, or an array of objects. It will throw an error if anything failed a _constraint_, and if this happens the resulting error will provide you with a structured array of error messages as to why.

You can run validation and get the result as a one-off, or alternatively, you can re-compute validation automatically using a computed property.

### Installation

```
ember install @zestia/ember-validation
```

## Features

- Validates objects ✔︎
- Validates arrays ✔︎
- Ember Data Friendly ✔︎
- Supports promises ✔︎
- Supports [adhoc constraints](#adhoc-constraints) ✔︎
- Supports [dynamic constraints](#dynamic-constraints) ✔︎
- Uses [date-fns](https://date-fns.org) for date validation. ✔︎
- Simple [reformatting](#utils) of error messages ✔︎

## Example

```javascript
import validate from '@zestia/ember-validation';
import {
  present,
  maxLength,
  truthy,
  email,
  date,
} from '@zestia/ember-validation/constraints';

const person = {
  id: 1,
  name: '',
  terms: false,
  emailAddress: 'joe@bloggs',
  dateOfBirth: null,
};

const constraints = {
  name() {
    return [
      present({ message: 'please enter your name' }),
      maxLength({ max: 255 }),
    ];
  },
  terms() {
    return [truthy({ message: 'please accept the terms' })];
  },
  emailAddress() {
    return [present(), email()];
  },
  dateOfBirth() {
    return [present(), date({ format: 'dd/MM/yyyy' })];
  },
};

try {
  await validate(person, constraints);
} catch (error) {
  console.log(error.result);
  /**
   *  {
   *    name: [
   *      'please enter your name'
   *    ],
   *    terms: [
   *      'please accept the terms'
   *    ],
   *    emailAddress: [
   *      'invalid email'
   *    ],
   *    dateOfBirth: [
   *      'required value',
   *      'invalid date, expecting dd/MM/yyyy'
   *    ]
   *  }
   */
}
```

## Adhoc Constraints

You can validate properties that aren't actually on the object being validated. Here is a contrived example...

```javascript
const person = {
  firstName: 'Joe',
  lastName: 'Bloggs',
};

const constraints = {
  firstName() {
    return [present()];
  },

  lastName() {
    return [present()];
  },

  name() {
    return [nameIsUnique];
  },
};

try {
  await validate(person, constraints);
} catch (error) {
  console.log(error.result);
  /**
   *  {
   *    firstName: [],
   *    lastName: [],
   *    name: ['must be unique']
   *  }
   */
}

const names = ['Joe Bloggs'];

function nameIsUnique(value, object) {
  if (names.includes(`${object.firstName} ${object.lastName}`)) {
    return;
  }

  return 'must be unique';
}
```

## Dynamic Constraints

Because constraints are functions, this allows for a very powerful approach for validating arrays of objects.
For example, imagine you have an array of items of a varying _types_.

```javascript
const items = [
  { id: 1, value: '', type: 'text' },
  { id: 2, value: '', type: 'number' },
  { id: 3, value: '', type: 'email' },
  { id: 4, value: '', type: 'date' }
];

const constraints = (item) => {
  return {
    value() {
      switch (item.type) {
        case 'text':
          return [present()];
        case 'number':
          return [present(), number()];
        case: 'email':
          return [present(), email()];
        case: 'date':
          return [present(), date({ format: 'dd/MM/yyyy' })];
        default:
          return [];
      }
    }
  };
}

try {
  await validate(items, constraints);
} catch(error) {
  console.log(error.result);
  /*
   *  [
   *    {
   *      value: ['required value']
   *    },
   *    {
   *      value: ['required value', 'invalid number']
   *    },
   *    {
   *      value: ['required value', 'invalid email']
   *    },
   *    {
   *      value: ['required value', 'invalid date, expecting dd/MM/yyyy']
   *    }
   *  ]
   */
}
```

## Utils

- [`flattenMessages`](tests/unit/utils-test.js#L5)
- [`collateMessages`](tests/unit/utils-test.js#L42)

## Constraints

- bigDecimal
  - `optional`
  - `message`
  - `maxIntegerDigits`
  - `maxDecimalDigits`
- date
  - `optional`
  - `format`
  - `mesaage`
- email
  - `optional`
  - `message`
- greaterThan
  - `optional`
  - `value`
  - `mesaage`
- lessThan
  - `optional`
  - `value`
  - `mesaage`
- maxLength
  - `max`
  - `message`
- minLength
  - `min`
  - `message`
- number
  - `optional`
  - `message`
- phoneNumber
  - `optional`
  - `message`
- present
  - `message`
- truthy
  - `message`
