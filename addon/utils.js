import { assert } from '@ember/debug';

const { keys, values } = Object;

export const isArray = Array.isArray;

export function isNull(input) {
  return input === null;
}

export function isString(input) {
  return typeof input === 'string';
}

export function isFunction(input) {
  return typeof input === 'function';
}

export function isObject(input) {
  return typeof input === 'object' && !isNull(input) && !isArray(input);
}

export function flattenErrors(errors) {
  if (isNull(errors)) {
    return errors;
  } else if (isObject(errors)) {
    return flattenObjectErrors(errors);
  } else if (isArray(errors)) {
    return flattenArrayErrors(errors);
  }
}

function flattenObjectErrors(object) {
  const errors = keys(object).reduce((errors, key) => {
    const item = object[key];

    if (isArray(item)) {
      errors = errors.concat(flattenArrayErrors(item));
    }

    return errors;
  }, []);

  return result(errors);
}

function flattenArrayErrors(array) {
  const errors = array.reduce((errors, item) => {
    if (isString(item)) {
      return errors.concat(item);
    } else if (isObject(item)) {
      return errors.concat(flattenObjectErrors(item));
    }

    return errors;
  }, []);

  return result(errors);
}

export function collateErrors(errors) {
  if (isNull(errors)) {
    return errors;
  } else if (isArray(errors)) {
    return collateArrayErrors(errors);
  } else {
    assert('Errors must be an array');
  }
}

function collateArrayErrors(array) {
  const errors = array.reduce((errors, item) => {
    if (isNull(item)) {
      errors.push(item);
    } else if (isObject(item)) {
      errors.push(flattenObjectErrors(item));
    }

    return errors;
  }, []);

  return result(errors);
}

export function result(errors) {
  let erred;

  if (isObject(errors)) {
    erred = values(errors).some(Boolean);
  } else if (isArray(errors)) {
    erred = errors.some(Boolean);
  }

  if (erred) {
    return errors;
  }

  return null;
}
