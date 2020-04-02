import { assign } from '@ember/polyfills';
import { isPresent } from '@ember/utils';

const fullPattern = /^-?(\d+)(?:\.(\d+))?$/;
const decimalPattern = /^(\d*?)0*$/;

export default function bigDecimalConstraint(options = {}) {
  options = assign({ maxIntegerDigits: 12, maxDecimalDigits: 3 }, options);

  return function (value) {
    if (!isPresent(value) && options.optional) {
      return;
    }

    const res = fullPattern.exec(value);

    if (!res) {
      return 'value must be a number';
    }

    const integerPart = res[1];

    if (integerPart.length > options.maxIntegerDigits) {
      return 'value too large';
    }

    if (res[2]) {
      const decimalPart = decimalPattern.exec(res[2])[1];

      if (decimalPart.length > options.maxDecimalDigits) {
        // eslint-disable-next-line max-len
        return `value must have a maximum of ${options.maxDecimalDigits} decimal places`;
      }
    }

    return null;
  };
}
