import { get } from '@ember/object';
import { typeOf } from '@ember/utils';
import { assert } from '@ember/debug';
const { keys, values } = Object;

export default function validate(object, constraints) {
  switch (typeOf(object)) {
    case 'array':
      return validateArray(object, constraints);
    default:
      return validateObject(object, constraints);
  }
}

async function validateObject(_object, _constraints) {
  assert('Constraints must be an object', typeOf(_constraints) === 'object');

  const object = (await _object) || {};
  const messages = {};

  for (const key of keys(_constraints)) {
    const constraints = _constraints[key];
    const value = await get(object, key);

    messages[key] = applyConstraints(object, key, value, constraints(object));
  }

  if (values(messages).some(Boolean)) {
    return messages;
  }

  return null;
}

async function validateArray(array, constraints) {
  assert('Constraints must be a function', typeOf(constraints) === 'function');

  const messages = [];

  for (const object of array) {
    messages.push(await validateObject(object, constraints(object)));
  }

  if (messages.some(Boolean)) {
    return messages;
  }

  return null;
}

function applyConstraints(object, key, value, constraints) {
  const messages = [];

  for (const constraint of constraints) {
    let message = constraint(value, object);

    if (typeOf(message) === 'function') {
      message = message(value, object);
    }

    if (message) {
      messages.push(message);
    }
  }

  if (messages.some(Boolean)) {
    return messages;
  }

  return null;
}
