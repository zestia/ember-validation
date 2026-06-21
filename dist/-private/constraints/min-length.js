import { isArray } from '../utils.js';
import '@ember/object';
import '@ember/debug';
import { messageFor } from '../messages.js';

function minLength(options = {}) {
  return function (value, object) {
    let length = 0;
    if (isArray(value)) {
      length = value.length;
    } else if (typeof value === 'string' || typeof value === 'number') {
      length = `${value}`.length;
    }
    if (length >= options.min) {
      return;
    }
    return messageFor('min-length', value, object, options);
  };
}

export { minLength as default };
//# sourceMappingURL=min-length.js.map
