# @zestia/ember-validation

<a href="https://badge.fury.io/js/%40zestia%2Fember-validation"><img src="https://badge.fury.io/js/%40zestia%2Fember-validation.svg" alt="npm version" height="18"></a> &nbsp; <a href="http://travis-ci.org/zestia/ember-validation"><img src="https://travis-ci.org/zestia/ember-validation.svg?branch=master"></a> &nbsp; <a href="https://david-dm.org/zestia/ember-validation#badge-embed"><img src="https://david-dm.org/zestia/ember-validation.svg"></a> &nbsp; <a href="https://david-dm.org/zestia/ember-validation#dev-badge-embed"><img src="https://david-dm.org/zestia/ember-validation/dev-status.svg"></a> &nbsp; <a href="https://emberobserver.com/addons/@zestia/ember-validation"><img src="https://emberobserver.com/badges/-zestia-ember-validation.svg"></a>

### Overview

This addon lets you validate an object, or an array of objects. It will throw an error if anything failed a _constraint_, and if this happens the resulting error will provide you with a structured array of error messages as to why.

You can run validation and get the result as a one-off, or alternatively, you can re-compute validation automatically using a computed property.

###### Notes

* Supports promises
* Supports [adhoc constraints](tests/unit/index-test.js#L123)
* Uses [ember-cli-moment-shim](https://github.com/jasonmit/ember-cli-moment-shim) for date validation.

### Installation
```
ember install @zestia/ember-validation
```

### Example

```javascript
import validate from '@zestia/ember-validation';
import { present, maxLength, truthy, email, date } from '@zestia/ember-validation/constraints';

const person = {
  id: 1,
  name: '',
  terms: false,
  emailAddress: 'fred@smith',
  dateOfBirth: null,
  tags: [{
    id: 1,
    name: 'VIP'
  }, {
    id: 2,
    name: ''
  }]
};

const constraints = {
  name: [
    present({ message: 'Please enter your name' }),
    maxLength({ max: 255 })
  ],
  terms: [
    truthy({ message: 'Please accept the terms' })
  ],
  emailAddress: [
    present(),
    email()
  ],
  dateOfBirth: [
    present(),
    date({ format: 'L' })
  ],
  'tags[]': {
    name: [
      present()
    ]
  }
};

try {
  await validate(person, constraints);
} catch(error) {
  console.log(error.result);
  /**
   *  {
   *    "name": [
   *      "Please enter your name"
   *    ],
   *    "terms": [
   *      "Please accept the terms"
   *    ],
   *    "emailAddress": [
   *      "invalid email"
   *    ],
   *    "dateOfBirth": [
   *      "required value",
   *      "invalid date, expecting MM/DD/YYYY"
   *    ]
   *    "tags[]": [{
   *      "name": []
   *    }, {
   *      "name": ["required value"]
   *    }]
   *  }
   */
}
```

### Utils

* [`flattenMessages`](tests/unit/utils-test.js#L5)
* [`collateMessages`](tests/unit/utils-test.js#L42)

### Constraints

* bigDecimal
  * `optional`
  * `message`
  * `maxIntegerDigits`
  * `maxDecimalDigits`
* date
  * `optional`
  * `format`
  * `mesaage`
* email
  * `optional`
  * `message`
* greaterThan
  * `optional`
  * `value`
  * `mesaage`
* lessThan
  * `optional`
  * `value`
  * `mesaage`
* maxLength
  * `max`
  * `message`
* minLength
  * `min`
  * `message`
* number
  * `optional`
  * `message`
* phoneNumber
  * `optional`
  * `message`
* present
  * `message`
* truthy
  * `message`
