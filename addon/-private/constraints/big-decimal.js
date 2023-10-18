import { isPresent } from '@ember/utils';
import { t } from '@zestia/ember-validation';

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
    const data = { value, ...options };

    if (!result) {
      return t('big-decimal.must-be-a-number', data);
    }

    const integerPart = result[1];

    if (integerPart.length > options.maxIntegerDigits) {
      return t('big-decimal.value-too-large', data);
    }

    if (result[2]) {
      const decimalPart = decimalPattern.exec(result[2])[1];

      if (decimalPart.length > options.maxDecimalDigits) {
        return t('big-decimal.max-decimal-places', data);
      }
    }
  };
}
