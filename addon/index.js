import { get } from '@ember/object';
import { typeOf } from '@ember/utils';
import { assert } from '@ember/debug';
const { keys, values } = Object;

export default async function validate(object, constraints = {}) {
  let messages;
  let erred = false;

  switch (typeOf(object)) {
    case 'array':
      messages = await _validateArray(object, constraints);
      erred = messages.some((object) => values(object).some(Boolean));
      break;
    default:
      messages = await _validateObject(object, constraints);
      erred = values(messages).some(Boolean);
      break;
  }

  if (erred) {
    return messages;
  }

  return null;
}

async function _validateObject(_object, _constraints) {
  assert('Constraints must be an object', typeOf(_constraints) === 'object');

  const object = (await _object) || {};
  const messages = {};

  for (const key of keys(_constraints)) {
    const constraints = _constraints[key];
    const value = await get(object, key);
    messages[key] = _applyConstraints(object, key, value, constraints(object));
  }

  return messages;
}

async function _validateArray(array, constraints) {
  assert('Constraints must be a function', typeOf(constraints) === 'function');

  const messages = [];

  for (const object of array) {
    messages.push(await _validateObject(object, constraints(object)));
  }

  return messages;
}

function _applyConstraints(object, key, value, constraints) {
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

  return messages.length > 0 ? messages : null;
}
