import { isPresent } from '@ember/utils';
import '@ember/object';
import '@ember/debug';
import '@ember/array';
import { messageFor } from '../messages.js';

function present(options) {
  return function (value, object) {
    if (isPresent(value)) {
      return;
    }
    return messageFor('present', value, object, options);
  };
}

export { present as default };
//# sourceMappingURL=present.js.map
