import { messageFor } from '@zestia/ember-validation';

export default function truthy(options) {
  return function (value, object) {
    if (value) {
      return;
    }

    return messageFor('truthy', value, object, options);
  };
}
