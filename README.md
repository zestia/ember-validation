# ember-validation

<!--
<a href="http://emberobserver.com/addons/ember-validation"><img src="http://emberobserver.com/badges/ember-validation.svg"></a> &nbsp; <a href="https://david-dm.org/amk221/ember-validation#badge-embed"><img src="https://david-dm.org/amk221/ember-validation.svg"></a> &nbsp; <a href="https://david-dm.org/amk221/ember-validation#dev-badge-embed"><img src="https://david-dm.org/amk221/ember-validation/dev-status.svg"></a> &nbsp; <a href="http://travis-ci.org/amk221/ember-validation"><img src="https://travis-ci.org/amk221/ember-validation.svg?branch=master"></a>
-->

### Installation
```
ember install ember-validation
```

### Example

```javascript
import validate from 'ember-validation';
import { present, maxLength, truthy, email, date } from 'ember-validation/constraints';

const object = {}

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
  ]
};

try {
  await validate(object, constraints);
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
   *      "required value",
   *      "invalid email"
   *    ],
   *    "dateOfBirth": [
   *      "required value",
   *      "invalid date, expecting MM/DD/YYYY"
   *    ]
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
