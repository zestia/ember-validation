import { isArray } from '@zestia/ember-validation/-private/utils';
import { t } from '@zestia/ember-validation';

export default function maxLength(options = {}) {
  return function (_value) {
    const { max } = options;
    let value = 0;

    if (isArray(_value)) {
      value = _value.length;
    } else if (typeof _value === 'string' || typeof _value === 'number') {
      value = `${_value}`.length;
    }

    if (value <= max) {
      return;
    }

    return t('max-length', { value, max });
  };
}
