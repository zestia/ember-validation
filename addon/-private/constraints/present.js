import { isPresent } from '@ember/utils';
import { messageFor } from '@zestia/ember-validation';

export default function present(options) {
  return function (value, object) {
    if (isPresent(value)) {
      return;
    }

    return messageFor('present', value, object, options);
  };
}
