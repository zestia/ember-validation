import { isPresent } from '@ember/utils';
import { messageFor } from '@zestia/ember-validation';

export default function number(options = {}) {
  return function (value) {
    if (!isPresent(value) && options.optional) {
      return;
    }

    if (/^-?[0-9,.]+$/i.test(value)) {
      return;
    }

    return messageFor('number', value, options);
  };
}
