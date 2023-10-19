import { isPresent } from '@ember/utils';
import { messageFor } from '@zestia/ember-validation';

export default function lessThan(options = {}) {
  return function (value) {
    if (!isPresent(value) && options.optional) {
      return;
    }

    if (value < options.value) {
      return;
    }

    return messageFor('less-than', value, options);
  };
}
