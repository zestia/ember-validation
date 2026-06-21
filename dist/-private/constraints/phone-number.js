import { isPresent } from '@ember/utils';
import '@ember/object';
import '@ember/debug';
import '@ember/array';
import { messageFor } from '../messages.js';

function phoneNumber(options = {}) {
  return function (value, object) {
    if (!isPresent(value) && options.optional) {
      return;
    }
    if (/^[0-9 \-()+.]+$/i.test(value)) {
      return;
    }
    return messageFor('phone-number', value, object, options);
  };
}

export { phoneNumber as default };
//# sourceMappingURL=phone-number.js.map
