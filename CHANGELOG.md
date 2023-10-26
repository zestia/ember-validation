# Changelog

## 5.1.0

- Ensure message functions receive the object context
- Avoid clashes of message tokens by prefixing options with underscore

## 5.0.0

- Change import path for `collateErrors` and `flattenErrors` from
  `@zestia/ember-validation/utils`, to just `@zestia/ember-validation`
- Makes internationalisation possible by exposing `setMessageFn`, and `messageFor`
- Changes the signature of the message function

## 4.4.2

- Update `@zestia` scoped packages

## 4.4.1

- Re-release of 4.4.0 but published to GH Packages instead of NPM

## 4.4.0

- Run `ember-cli-update`

## 4.3.0

- Ember Auto Import 2x
- Upgrade dependencies
- Run ember-cli-update

## 4.2.0

- Add support for async constraints

## 4.1.0

- Upgrade dependencies
- Support record arrays
- Add Embroider support

## 4.0.6

- Upgrade dependencies

## 4.0.5

- Upgrade dependencies

## 4.0.4

- Upgrade dependencies
- Run ember-cli-update

## 4.0.3

- Upgrade dependencies
- Use named imports to retain tree shaking ([Issue](https://github.com/ef4/ember-auto-import/issues/121))

## 4.0.2

- Upgrade dependencies

## 4.0.1

- Upgrade dependencies

## 4.0.0

- Does not throw if validation fails.<br>
  This is to avoid using the error for flow control, and will make testing in Ember apps easier. Background information available [here](https://github.com/emberjs/ember-qunit/issues/592).

## 3.0.4

- Upgrade dependencies

## 3.0.3

- Upgrade dependencies

## 3.0.2

- Capitalise first letter of validation error messages

## 3.0.1

- Upgrade dependencies

## 3.0.0

- Migrate away from moment.js for date validation to date-fns
- Private functions that backed the constraints are no longer exposed
- Drops support for reverse parsing in custom validation messages. Previously, with moment `L` would be converted to the corresponding localised structure for example `DD/MM/YYYY`. Whereas with date-fns `P` (`L`'s equivalent) will not be converted.

## 2.0.11

- Upgrade dependencies

## 2.0.10

- Upgrade dependencies

## 2.0.9

- Fix min/max length constraints converting `null` and `undefined` into strings.

## 2.0.8

- Upgrade dependencies

## 2.0.7

- Upgrade dependencies

## 2.0.6

- Upgrade dependencies

## 2.0.5

- Upgrade dependencies

## 2.0.4

- Upgrade dependencies

## 2.0.3

- Upgrade dependencies

## 2.0.2

- Allow negative numbers

## 2.0.1

- Upgrade dependencies

## 2.0.0

- Breaking change: Constraints should now be a function that returns an object, rather than just an object.
- Introduce ability to validate an array of objects

## 1.1.1

- Upgrade dependencies

## 1.1.0

- Fix min and max length with numbers

## 1.0.11

- Upgrade dependencies

## 1.0.10

- Upgrade ember-cli

## 1.0.9

- Make greater and lesser than constraints be optional

## 1.0.6

- Upgrade ember-cli

## 1.0.5

- Fix travis builds
- Fix dependencies

## 1.0.4

- Lint everything

## 1.0.3

- Use `rsvp`

## 1.0.2

- Make sure arrays are resolved

## 1.0.1

- Coerce to an array when expecting an array of things to validate
