import { isPresent } from '@ember/utils';

const fullPattern = /^-?(\d+)(?:\.(\d+))?$/;
const decimalPattern = /^(\d*?)0*$/;

export default function bigDecimal(_options = {}) {
  const options = {
    maxIntegerDigits: 12,
    maxDecimalDigits: 3,
    ..._options
  };

  return function (value) {
    if (!isPresent(value) && options.optional) {
      return;
    }

    const result = fullPattern.exec(value);

    if (!result) {
      return 'Value must be a number';
    }

    const integerPart = result[1];

    if (integerPart.length > options.maxIntegerDigits) {
      return 'Value too large';
    }

    if (result[2]) {
      const decimalPart = decimalPattern.exec(result[2])[1];

      if (decimalPart.length > options.maxDecimalDigits) {
        return `Value must have a maximum of ${options.maxDecimalDigits} decimal places`;
      }
    }
  };
}
