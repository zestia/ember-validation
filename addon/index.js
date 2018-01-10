import { get } from '@ember/object';
import { ValidationError } from './errors';
import { makeArray } from '@ember/array';
const { isArray } = Array;
const { keys } = Object;

const example = `
  Validation is for named errors, validate your array like so: {
    'myArray': [minLength({ min: 2 })],
    'myArray[]': {
      foo: [present()],
      bar: [email()]
    }
  }
`;

export default async function validate(object = {}, constraints = {}) {
  if (isArray(object)) {
    throw new Error(example);
  }
  const result = await _validateObject(object, constraints);
  if (_hasErrors(result)) {
    throw new ValidationError(null, result);
  } else {
    return null;
  }
}

async function _validateObject(object, constraints) {
  const result = {};
  for (const key of keys(constraints)) {
    result[key] = await _validateProperty(object, key, constraints[key]);
  }
  return result;
}

async function _validateProperty(object, key, constraints) {
  object = await object;
  const arrayKey = _arrayKey(key);

  if (arrayKey) {
    const objects = makeArray(get(object, arrayKey));
    const results = [];
    for (object of objects) {
      const result = await _validateObject(object, constraints);
      results.push(result);
    }
    return results;
  } else {
    return _applyConstraints(object, key, constraints);
  }
}

function _arrayKey(key = '') {
  const matches = key.match(/^([\w.]+)\[\]$/);
  return matches ? matches[1] : null;
}

function _hasErrors(result) {
  return keys(result).reduce((hasErrors, key) => {
    if (_arrayKey(key)) {
      hasErrors = hasErrors || result[key].some(_hasErrors);
    } else if (result[key].length > 0) {
      hasErrors = true;
    }
    return hasErrors;
  }, false);
}

async function _applyConstraints(object, key, constraints) {
  const messages = [];

  for (const constraint of constraints) {
    const value = await get(object || {}, key);
    let message = constraint.call(object, value);

    if (typeof message === 'function') {
      message = message.call(object, value);
    }

    if (message) {
      messages.push(message);
    }
  }

  return messages;
}
