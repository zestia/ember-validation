import { isPresent } from '@ember/utils';
import { messageFor } from '@zestia/ember-validation';

export default function phoneNumber(options = {}) {
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
