import '@ember/object';
import '@ember/debug';
import '@ember/array';
import { messageFor } from '../messages.js';

function truthy(options) {
  return function (value, object) {
    if (value) {
      return;
    }
    return messageFor('truthy', value, object, options);
  };
}

export { truthy as default };
//# sourceMappingURL=truthy.js.map
