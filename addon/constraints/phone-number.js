import { isPresent } from '@ember/utils';

export default function phoneNumber(options = {}) {
  return function (value) {
    if (!isPresent(value) && options.optional) {
      return;
    }

    if (/^[0-9 \-()+.]+$/i.test(value)) {
      return;
    }

    return options.message || 'invalid phone number';
  };
}
