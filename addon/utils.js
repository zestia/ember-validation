const { isArray } = Array;
const { keys } = Object;

export function flattenMessages(result) {
  if (isArray(result)) {
    return result.reduce((messages, object) => {
      return messages.concat(_gatherMessages(object));
    }, []);
  } else {
    return _gatherMessages(result);
  }
}

export function collateMessages(array) {
  return array.reduce((messages, object) => {
    messages.push(_gatherMessages(object));
    return messages;
  }, []);
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
