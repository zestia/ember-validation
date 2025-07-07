import { get } from '@ember/object';
import { assert } from '@ember/debug';
import {
  result,
  isArray,
  isObject,
  isFunction
} from '@zestia/ember-validation/-private/utils';
const { keys } = Object;

export default async function validate(_input, constraints) {
  const input = await _input;

  if (isObject(input)) {
    return validateObject(input, constraints);
  } else if (isArray(input)) {
    return validateArray(input, constraints);
  }
}

async function validateObject(_object, _constraints) {
  assert('Constraints must be an object', isObject(_constraints));

  const object = (await _object) ?? {};

  const errors = await keys(_constraints).reduce(async (_errors, key) => {
    const errors = await _errors;
    const constraints = _constraints[key](object);
    const value = await get(object, key);

    errors[key] = await applyConstraints(object, key, value, constraints);

    return errors;
  }, {});

  return result(errors);
}

async function validateArray(array, constraints) {
  assert('Constraints must be a function', isFunction(constraints));

  const errors = await Promise.all(
    array.map((object) => validateObject(object, constraints(object)))
  );

  return result(errors);
}

async function applyConstraints(object, key, value, constraints) {
  const errors = await constraints.reduce(async (_errors, constraint) => {
    const errors = await _errors;
    const message = await constraint(value, object);

    if (message) {
      errors.push(message);
    }

    return errors;
  }, []);

  return result(errors);
}
