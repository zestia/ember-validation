import { get } from '@ember/object';
import { assert } from '@ember/debug';
import { result, isArray, isObject, isFunction } from './utils';
import { all } from 'rsvp';
const { keys } = Object;

export default async function validate(input, constraints) {
  if (isObject(input)) {
    return await validateObject(input, constraints);
  } else if (isArray(input)) {
    return await validateArray(input, constraints);
  }
}

async function validateObject(_object, _constraints) {
  assert('Constraints must be an object', isObject(_constraints));

  const object = (await _object) || {};

  const errors = await keys(_constraints).reduce(async (_errors, key) => {
    const errors = await _errors;
    const constraints = _constraints[key];
    const value = await get(object, key);

    errors[key] = applyConstraints(object, key, value, constraints(object));

    return errors;
  }, {});

  return result(errors);
}

async function validateArray(array, constraints) {
  assert('Constraints must be a function', isFunction(constraints));

  const errors = await all(
    array.map((object) => validateObject(object, constraints(object)))
  );

  return result(errors);
}

function applyConstraints(object, key, value, constraints) {
  const errors = constraints.reduce((errors, constraint) => {
    let message = constraint(value, object);

    if (isFunction(message)) {
      message = message(value, object);
    }

    if (message) {
      errors.push(message);
    }

    return errors;
  }, []);

  return result(errors);
}
