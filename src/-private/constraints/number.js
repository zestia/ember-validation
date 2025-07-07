import { isPresent } from '@ember/utils';
import { messageFor } from '@zestia/ember-validation';

export default function number(options = {}) {
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
