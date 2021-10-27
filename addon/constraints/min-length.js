import { isArray } from '../utils';

export default function minLength(options = {}) {
  return function (value) {
    let length = 0;

    if (isArray(value)) {
      length = value.length;
    } else if (typeof value === 'string' || typeof value === 'number') {
      length = `${value}`.length;
    }

    if (length >= options.min) {
      return;
    }

    return options.message || `Length must be at least ${options.min}`;
  };
}
