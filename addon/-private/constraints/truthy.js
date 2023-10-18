import { t } from '@zestia/ember-validation';

export default function truthy() {
  return function (value) {
    if (value) {
      return;
    }

    return t('truthy', { value });
  };
}
