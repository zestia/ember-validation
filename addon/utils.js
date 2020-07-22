import { typeOf } from '@ember/utils';
const { keys } = Object;

export function flattenMessages(errors) {
  if (typeOf(errors) === 'array') {
    return errors.reduce((messages, object) => {
      return messages.concat(_gatherMessages(object));
    }, []);
  } else if (typeOf(errors) === 'object') {
    return _gatherMessages(errors);
  } else {
    return null;
  }
}

export function collateMessages(errors) {
  if (typeOf(errors) === 'array') {
    return errors.reduce((messages, object) => {
      messages.push(_gatherMessages(object));
      return messages;
    }, []);
  } else {
    return null;
  }
}

function _gatherMessages(object) {
  return keys(object).reduce((messages, key) => {
    const msgs = object[key].reduce((msgs, value) => {
      if (typeof value === 'string') {
        return msgs.concat(value);
      } else {
        return msgs.concat(_gatherMessages(value));
      }
    }, []);
    return messages.concat(msgs);
  }, []);
}
