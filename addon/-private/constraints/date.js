import { isPresent } from '@ember/utils';
import isValid from 'date-fns/isValid';
import parse from 'date-fns/parse';

export default function date(options) {
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

    return options.message || `Invalid date, expecting ${format}`;
  };
}
