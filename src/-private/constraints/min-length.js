import { isArray } from '../utils.js';
import { messageFor } from '../../index.js';

export default function minLength(options = {}) {
  return function (value, object) {
    let length = 0;

    if (isArray(value)) {
      length = value.length;
    } else if (typeof value === 'string' || typeof value === 'number') {
      length = `${value}`.length;
    }

    if (length >= options.min) {
      return;
    }

    return messageFor('min-length', value, object, options);
  };
}
