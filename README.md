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

This lightweight addon lets you validate an object, or an array of objects. It will return a structured response with error messages for anything that failed a _constraint_.

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
- Simple [restructuring](#utils) of error messages ✔︎

## Example

```javascript
import validate from '@zestia/ember-validation';
import {
  present,
  maxLength,
  truthy,
  email,
  date
} from '@zestia/ember-validation/constraints';

const person = {
  id: 1,
  name: '',
  terms: false,
  emailAddress: 'joe@bloggs',
  dateOfBirth: null
};

const constraints = {
  name() {
    return [
      present({ message: 'Please enter your name' }),
      maxLength({ max: 255 })
    ];
  },
  terms() {
    return [truthy({ message: 'Please accept the terms' })];
  },
  emailAddress() {
    return [present(), email()];
  },
  dateOfBirth() {
    return [present(), date({ format: 'dd/MM/yyyy' })];
  }
};

const errors = await validate(person, constraints);

/**
 *  {
 *    name: [
 *      'Please enter your name'
 *    ],
 *    terms: [
 *      'Please accept the terms'
 *    ],
 *    emailAddress: [
 *      'Invalid email'
 *    ],
 *    dateOfBirth: [
 *      'Required value',
 *      'Invalid date, expecting dd/MM/yyyy'
 *    ]
 *  }
 */
```

## Adhoc Constraints

You can validate properties that aren't actually on the object being validated. Here is a contrived example...

```javascript
const person = {
  firstName: 'Joe',
  lastName: 'Bloggs'
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
  }
};

const errors = await validate(person, constraints);

/**
 *  {
 *    firstName: null,
 *    lastName: null,
 *    name: ['Must be unique']
 *  }
 */

const names = ['Joe Bloggs'];

function nameIsUnique(value, object) {
  if (names.includes(`${object.firstName} ${object.lastName}`)) {
    return;
  }

  return 'Must be unique';
}
```

## Dynamic Constraints

Because constraints are functions, this allows for a very powerful approach for validating arrays of objects.
For example, imagine you have an array of items of a _varying types_.

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

const errors = await validate(items, constraints);

/*
 *  [
 *    {
 *      value: ['Required value']
 *    },
 *    {
 *      value: ['Required value', 'Invalid number']
 *    },
 *    {
 *      value: ['Required value', 'Invalid email']
 *    },
 *    {
 *      value: ['Required value', 'Invalid date, expecting dd/MM/yyyy']
 *    }
 *  ]
 */
```

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

## Utils

- [`flattenMessages`](tests/unit/utils-test.js#L32)<br>
  Flatten a messages object (or an array of objects) into a single array of _all_ the message strings.

- [`collateMessages`](tests/unit/utils-test.js#L66)<br>
  Flatten a messages array of objects into an array of message strings.
