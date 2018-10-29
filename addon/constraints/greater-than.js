import { isPresent } from '@ember/utils';

export function greaterThan(a, b) {
  return a > b;
}

export default function greaterThanConstraint(options = {}) {
  return function(value) {
    if (!isPresent(value) && options.optional) {
      return;
    }

    if (greaterThan(value, options.value)) {
      return;
    }

    return options.message || `must be greater than ${options.value}`;
  };
}
