import { isPresent } from '@ember/utils';
import { isValid, parse } from 'date-fns/esm';

export function validDate(value, format, referenceDate, options) {
  if (!isPresent(value)) {
    return false;
  }

  if (!referenceDate) {
    referenceDate = new Date();
  }

  return isValid(parse(value, format, referenceDate, options));
}

export default function dateConstraint(options) {
  return function (value) {
    if (!isPresent(value) && options.optional) {
      return;
    }

    if (validDate(value, options.format, options.referenceDate, options)) {
      return;
    }

    return options.message || `invalid date, expecting ${options.format}`;
  };
}
