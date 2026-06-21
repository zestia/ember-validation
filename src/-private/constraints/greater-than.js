import { isPresent } from '@ember/utils';
import { messageFor } from '../../index.js';

export default function greaterThan(options = {}) {
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
