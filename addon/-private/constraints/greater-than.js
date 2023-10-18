import { isPresent } from '@ember/utils';

export default function greaterThan(options = {}) {
  return function (value) {
    if (!isPresent(value) && options.optional) {
      return;
    }

    if (value > options.value) {
      return;
    }

    return options.message || `Must be greater than ${options.value}`;
  };
}
