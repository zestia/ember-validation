import { get } from '@ember/object';
import { typeOf } from '@ember/utils';
import { assert } from '@ember/debug';
import { result } from './utils';
import { all, resolve } from 'rsvp';
const { keys } = Object;

export default function validate(object, constraints) {
  if (typeOf(object) === 'object') {
    return validateObject(object, constraints);
  } else if (typeOf(object) === 'array') {
    return validateArray(object, constraints);
  }
}

async function validateObject(_object, _constraints) {
  assert('Constraints must be an object', typeOf(_constraints) === 'object');

  const object = (await _object) || {};

  const errors = await keys(_constraints).reduce(async (_errors, key) => {
    const errors = await _errors;
    const constraints = _constraints[key];
    const value = await get(object, key);

    errors[key] = applyConstraints(object, key, value, constraints(object));

    return errors;
  }, {});

  return resolve(result(errors));
}

async function validateArray(array, constraints) {
  assert('Constraints must be a function', typeOf(constraints) === 'function');

  const errors = await all(
    array.map((object) => validateObject(object, constraints(object)))
  );

  return resolve(result(errors));
}

function applyConstraints(object, key, value, constraints) {
  const errors = constraints.reduce((errors, constraint) => {
    let message = constraint(value, object);

    if (typeOf(message) === 'function') {
      message = message(value, object);
    }

    if (message) {
      errors.push(message);
    }

    return errors;
  }, []);

  return result(errors);
}
