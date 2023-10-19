import { isPresent } from '@ember/utils';
import { t } from '@zestia/ember-validation';

export default function greaterThan(options = {}) {
  return function (value) {
    const boundary = options.value;

    if (!isPresent(value) && options.optional) {
      return;
    }

    if (value > boundary) {
      return;
    }

    return t(options.key ?? 'greater-than', { value, boundary });
  };
}
