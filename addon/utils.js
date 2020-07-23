import { typeOf } from '@ember/utils';
const { keys } = Object;

export function flattenMessages(errors) {
  let messages;

  if (typeOf(errors) === 'object') {
    messages = _flattenObjectMessages(errors);
  } else if (typeOf(errors) === 'array') {
    messages = _flattenArrayMessages(errors);
  }

  return messages && messages.length > 0 ? messages : null;
}

function _flattenObjectMessages(object) {
  return keys(object).reduce((messages, key) => {
    const item = object[key];

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
  let messages;

  if (typeOf(errors) === 'array') {
    messages = _collateArrayMessages(errors);
  }

  return messages && messages.length > 0 ? messages : null;
}

function _collateArrayMessages(array) {
  return array.reduce((messages, object) => {
    const msgs = _flattenObjectMessages(object);
    messages.push(msgs.length > 0 ? msgs : null);
    return messages;
  }, []);
}
