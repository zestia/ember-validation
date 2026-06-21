import { isPresent } from '@ember/utils';
import '@ember/object';
import '@ember/debug';
import '@ember/array';
import { messageFor } from '../messages.js';

function number(options = {}) {
  return function (value, object) {
    if (!isPresent(value) && options.optional) {
      return;
    }
    if (options.whole) {
      if (/^([0-9,]+)$/i.test(value)) {
        return;
      }
    } else if (/^-?[0-9,.]+$/i.test(value)) {
      return;
    }
    return messageFor('number', value, object, options);
  };
}

export { number as default };
//# sourceMappingURL=number.js.map
