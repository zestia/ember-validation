import { isArray } from '../utils.js';
import '@ember/object';
import '@ember/debug';
import { messageFor } from '../messages.js';

function maxLength(options = {}) {
  return function (value, object) {
    let length = 0;
    if (isArray(value)) {
      length = value.length;
    } else if (typeof value === 'string' || typeof value === 'number') {
      length = `${value}`.length;
    }
    if (length <= options.max) {
      return;
    }
    return messageFor('max-length', value, object, options);
  };
}

export { maxLength as default };
//# sourceMappingURL=max-length.js.map
