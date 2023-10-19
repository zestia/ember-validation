import { isArray } from '@zestia/ember-validation/-private/utils';
import { messageFor } from '@zestia/ember-validation';

export default function maxLength(options = {}) {
  return function (value) {
    let length = 0;

    if (isArray(value)) {
      length = value.length;
    } else if (typeof value === 'string' || typeof value === 'number') {
      length = `${value}`.length;
    }

    if (length <= options.max) {
      return;
    }

    return messageFor('max-length', value, options);
  };
}
