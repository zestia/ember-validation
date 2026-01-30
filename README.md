# @zestia/ember-validation

<!-- [![Ember Observer][ember-observer-badge]][ember-observer-url] -->
<!-- [![GitHub Actions][github-actions-badge]][github-actions-url] -->

[npm-badge]: https://img.shields.io/npm/v/@zestia/ember-validation.svg
[npm-badge-url]: https://www.npmjs.com/package/@zestia/ember-validation
[github-actions-badge]: https://github.com/zestia/ember-validation/workflows/CI/badge.svg
[github-actions-url]: https://github.com/zestia/ember-validation/actions
[ember-observer-badge]: https://emberobserver.com/badges/-zestia-ember-validation.svg
[ember-observer-url]: https://emberobserver.com/addons/@zestia/ember-validation

This lightweight addon lets you validate an object, or an array of objects.

It works by running one or more functions against each property on the object (or array of objects), and returns a matching structure containing an array of messages that describe each property.

### Installation

```
ember install @zestia/ember-validation
```

Add the following to `~/.npmrc` to pull @zestia scoped packages from Github instead of NPM.

```
@zestia:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=<YOUR_GH_TOKEN>
```

## Demo

https://zestia.github.io/ember-validation

## Features

- Validates objects ✔︎
- Validates arrays ✔︎
- [Internationalisation](#internationalisation) ✔︎
- [async constraints](#constraints) ✔︎
- [adhoc constraints](#adhoc-constraints) ✔︎
- [dynamic constraints](#dynamic-constraints) ✔︎
- Uses [date-fns](https://date-fns.org) for date validation. ✔︎
- Simple [restructuring](#utils) of error messages ✔︎

## Notes

- Making a constraint is as simple as writing a function that returns nothing if it passes, or a string if it fails.

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
  emailAddress: 'joe@bloggs',
  dateOfBirth: null,
  terms: false
};

const constraints = {
  name() {
    return [
      present({ message: 'Please enter your name' }),
      maxLength({ max: 255 })
    ];
  },

  emailAddress() {
    return [present(), email()];
  },

  dateOfBirth() {
    return [present(), date({ format: 'dd/MM/yyyy' })];
  },

  terms() {
    return [truthy({ message: 'Please accept the terms' })];
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

The following constraints come with this addon. Creating a constraint is as simple as making a function that returns a string if the constraint has failed. Constraints can be asynchronous too.

- `bigDecimal`
- `date`
- `email`
- `greaterThan`
- `lessThan`
- `maxLength`
- `minLength`
- `number`
- `phoneNumber`
- `present`
- `truthy`

## Internationalisation

There are a few approaches you can take to internationalise the error messages. The most obvious one would be to set the message property as the translated string, e.g. This only works if there are no dynamic parts:

```javascript
message: this.intl.t('too-large');
```

Alternatively, you could set the message just as the key, and internationalise it later in the template, e.g.

```javascript
message: 'too-large';
```

```hbs
{{t this.error}}
```

Or, you can provide a key, e.g.

```javascript
key: tKey('too-large');
```

...along with a function that will be called for each failed constraint, e.g.

```javascript
import { setMessageFn } from '@zestia/ember-validation';

export function initialize(appInstance) {
  const intl = this.owner.lookup('service:intl');

  setMessageFn((key, tokens) => intl.t(key, tokens));
}
```

This effectively hands off translation to ember-intl.

## Utils

- `setMessageFn`<br>
  Sets the function that will build a string for a given constraint

- `messageFor`<br>
  Should be used as the return value of constraint function

- `flattenErrors`<br>
  Flattens a validation result into a single array of _all_ the messages

- `collateErrors`<br>
  Flattens a validation result into an array of the messages for each field
