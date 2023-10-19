import { isPresent } from '@ember/utils';
import { t } from '@zestia/ember-validation';

export default function present(options) {
  return function (value) {
    if (isPresent(value)) {
      return;
    }

    return t(options.key ?? 'present', { value });
  };
}
