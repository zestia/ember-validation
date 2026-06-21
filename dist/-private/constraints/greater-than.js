import { isPresent } from '@ember/utils';
import '@ember/object';
import '@ember/debug';
import '@ember/array';
import { messageFor } from '../messages.js';

function greaterThan(options = {}) {
  return function (value, object) {
    if (!isPresent(value) && options.optional) {
      return;
    }
    if (value > options.value) {
      return;
    }
    return messageFor('greater-than', value, object, options);
  };
}

export { greaterThan as default };
//# sourceMappingURL=greater-than.js.map
