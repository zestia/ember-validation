import { isPresent } from '@ember/utils';

export default function presentConstraint(options = {}) {
  return function(value) {
    if (isPresent(value)) {
      return;
    }

    return options.message || 'required value';
  };
}
