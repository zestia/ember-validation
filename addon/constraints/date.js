import { isPresent } from '@ember/utils';
import { isValid, parse } from 'date-fns/esm';

export function validDate(value) {
  if (!isPresent(value)) {
    return false;
  }

  return isValid(parse(...arguments));
}

export default function dateConstraint(options) {
  return function (value) {
    const format = options.format;
    const referenceDate = options.referenceDate || new Date();
    const dateFnsOptions = { ...options };

    delete dateFnsOptions.format;
    delete dateFnsOptions.referenceDate;

    if (!isPresent(value) && options.optional) {
      return;
    }

    if (validDate(value, format, referenceDate, options)) {
      return;
    }

    return options.message || `invalid date, expecting ${options.format}`;
  };
}
