import { isPresent } from '@ember/utils';
import { t } from '@zestia/ember-validation';

export default function phoneNumber(options = {}) {
  return function (value) {
    if (!isPresent(value) && options.optional) {
      return;
    }

    if (/^[0-9 \-()+.]+$/i.test(value)) {
      return;
    }

    return t('phone-number', { value });
  };
}
