import { isArray } from '../utils.js';
import { messageFor } from '../../index.js';

export default function maxLength(options = {}) {
  return function (value, object) {
    let length = 0;

    if (isArray(value)) {
      length = value.length;
    } else if (typeof value === 'string' || typeof value === 'number') {
      length = `${value}`.length;
    }

    if (length <= options.max) {
      return;
    }

    return messageFor('max-length', value, object, options);
  };
}
