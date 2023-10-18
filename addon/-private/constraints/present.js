import { isPresent } from '@ember/utils';
import { t } from '@zestia/ember-validation';

export default function present() {
  return function (value) {
    if (isPresent(value)) {
      return;
    }

    return t('present', { value });
  };
}
