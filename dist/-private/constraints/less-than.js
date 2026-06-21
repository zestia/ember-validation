import { isPresent } from '@ember/utils';
import '@ember/object';
import '@ember/debug';
import '@ember/array';
import { messageFor } from '../messages.js';

function lessThan(options = {}) {
  return function (value, object) {
    if (!isPresent(value) && options.optional) {
      return;
    }
    if (value < options.value) {
      return;
    }
    return messageFor('less-than', value, object, options);
  };
}

export { lessThan as default };
//# sourceMappingURL=less-than.js.map
