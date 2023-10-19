import { isPresent } from '@ember/utils';
import { messageFor } from '@zestia/ember-validation';

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
      return messageFor('big-decimal.must-be-a-number', value, options);
    }

    const integerPart = result[1];

    if (integerPart.length > options.maxIntegerDigits) {
      return messageFor('big-decimal.value-too-large', value, options);
    }

    if (result[2]) {
      const decimalPart = decimalPattern.exec(result[2])[1];

      if (decimalPart.length > options.maxDecimalDigits) {
        return messageFor('big-decimal.max-decimal-places', value, options);
      }
    }
  };
}
