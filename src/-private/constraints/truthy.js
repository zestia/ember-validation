import { messageFor } from '../../index.js';

export default function truthy(options) {
  return function (value, object) {
    if (value) {
      return;
    }

    return messageFor('truthy', value, object, options);
  };
}
