import { typeOf } from '@ember/utils';
const { keys } = Object;

export function flattenMessages(errors) {
  if (typeOf(errors) === 'object') {
    return _flattenObjectMessages(errors);
  } else if (typeOf(errors) === 'array') {
    return _flattenArrayMessages(errors);
  } else {
    return null;
  }
}

function _flattenObjectMessages(errors) {
  return keys(errors).reduce((messages, key) => {
    const item = errors[key];

    if (typeOf(item) === 'array') {
      messages = messages.concat(_flattenArrayMessages(item));
    }

    return messages;
  }, []);
}

function _flattenArrayMessages(array) {
  return array.reduce((messages, item) => {
    if (typeOf(item) === 'string') {
      return messages.concat(item);
    } else if (typeOf(item) === 'object') {
      return messages.concat(_flattenObjectMessages(item));
    }
  }, []);
}

export function collateMessages(errors) {
  if (typeOf(errors) === 'array') {
    return errors.reduce((messages, object) => {
      messages.push(_collateObjectMessages(object));
      return messages;
    }, []);
  } else {
    return null;
  }
}

function _collateObjectMessages(object) {
  const messages = _flattenObjectMessages(object);
  return messages.length > 0 ? messages : null;
}
