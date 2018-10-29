import { isPresent } from '@ember/utils';

const numberPattern = /^[0-9,.]+$/i;

export function validNumber(value) {
  return numberPattern.test(value);
}

export default function numberConstraint(options = {}) {
  return function(value) {
    if (!isPresent(value) && options.optional) {
      return;
    }

    if (validNumber(value)) {
      return;
    }

    return options.message || 'invalid number';
  };
}
