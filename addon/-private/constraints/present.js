import { isPresent } from '@ember/utils';

export default function present(options = {}) {
  return function (value) {
    if (isPresent(value)) {
      return;
    }

    return options.message || 'Required value';
  };
}
