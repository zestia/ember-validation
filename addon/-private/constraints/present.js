import { isPresent } from '@ember/utils';
import { messageFor } from '@zestia/ember-validation';

export default function present(options) {
  return function (value) {
    if (isPresent(value)) {
      return;
    }

    return messageFor('present', value, options);
  };
}
