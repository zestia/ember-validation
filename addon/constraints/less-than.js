import { isPresent } from '@ember/utils';

export default function lessThan(options = {}) {
  return function (value) {
    if (!isPresent(value) && options.optional) {
      return;
    }

    if (value < options.value) {
      return;
    }

    return options.message || `must be less than ${options.value}`;
  };
}
