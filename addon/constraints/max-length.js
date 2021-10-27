import { isArray } from '../utils';

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

    return options.message || `Length is too long (max ${options.max})`;
  };
}
