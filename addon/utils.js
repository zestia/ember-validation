import { typeOf } from '@ember/utils';
const { keys, values } = Object;

export function flattenErrors(errors) {
  if (typeOf(errors) === 'null') {
    return errors;
  } else if (typeOf(errors) === 'object') {
    return flattenObjectErrors(errors);
  } else if (typeOf(errors) === 'array') {
    return flattenArrayErrors(errors);
  }
}

function flattenObjectErrors(object) {
  const errors = keys(object).reduce((errors, key) => {
    const item = object[key];

    if (typeOf(item) === 'array') {
      errors = errors.concat(flattenArrayErrors(item));
    }

    return errors;
  }, []);

  return result(errors);
}

function flattenArrayErrors(array) {
  const errors = array.reduce((errors, item) => {
    if (typeOf(item) === 'string') {
      return errors.concat(item);
    } else if (typeOf(item) === 'object') {
      return errors.concat(flattenObjectErrors(item));
    }

    return errors;
  }, []);

  return result(errors);
}

export function collateErrors(errors) {
  if (typeOf(errors) === 'null') {
    return errors;
  } else if (typeOf(errors) === 'array') {
    return collateArrayErrors(errors);
  }
}

function collateArrayErrors(array) {
  const errors = array.reduce((errors, item) => {
    if (typeOf(item) === 'null') {
      errors.push(item);
    } else if (typeOf(item) === 'object') {
      errors.push(flattenObjectErrors(item));
    }

    return errors;
  }, []);

  return result(errors);
}

export function result(errors) {
  let erred;

  if (typeOf(errors) === 'object') {
    erred = values(errors).some(Boolean);
  } else if (typeOf(errors) === 'array') {
    erred = errors.some(Boolean);
  }

  if (erred) {
    return errors;
  }

  return null;
}
