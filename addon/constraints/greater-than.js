import { isPresent } from '@ember/utils';

export default function greaterThanConstraint(options = {}) {
  return function (value) {
    if (!isPresent(value) && options.optional) {
      return;
    }

    if (value > options.value) {
      return;
    }

    return options.message || `must be greater than ${options.value}`;
  };
}
