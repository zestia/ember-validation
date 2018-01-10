# @zestia/ember-validation

<a href="http://emberobserver.com/addons/ember-validation"><img src="http://emberobserver.com/badges/ember-validation.svg"></a> &nbsp; <a href="https://david-dm.org/zestia/ember-validation#badge-embed"><img src="https://david-dm.org/zestia/ember-validation.svg"></a> &nbsp; <a href="https://david-dm.org/zestia/ember-validation#dev-badge-embed"><img src="https://david-dm.org/zestia/ember-validation/dev-status.svg"></a> &nbsp; <a href="http://travis-ci.org/zestia/ember-validation"><img src="https://travis-ci.org/zestia/ember-validation.svg?branch=master"></a>

### Overview

* Provides simple validation utils
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
  'tags[]': [
    name: [
      present()
    ]
  ]
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
  * `value`
  * `mesaage`
* lessThan
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
