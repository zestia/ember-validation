import { isPresent } from '@ember/utils';
import { isValid, parse } from 'date-fns/esm';

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

    if (isValid(parse(value, format, referenceDate, options))) {
      return;
    }

    return options.message || `invalid date, expecting ${format}`;
  };
}
