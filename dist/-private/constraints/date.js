import { isPresent } from '@ember/utils';
import { isValid } from 'date-fns/isValid';
import { parse } from 'date-fns/parse';
import '@ember/object';
import '@ember/debug';
import '@ember/array';
import { messageFor } from '../messages.js';

function date(options) {
  return function (_value, object) {
    const value = _value || '';
    const format = options.format;
    const referenceDate = options.referenceDate ?? new Date();
    const dateFnsOptions = {
      ...options
    };
    delete dateFnsOptions.format;
    delete dateFnsOptions.referenceDate;
    if (!isPresent(value) && options.optional) {
      return;
    }
    if (isValid(parse(value, format, referenceDate, dateFnsOptions))) {
      return;
    }
    return messageFor('date', value, object, options);
  };
}

export { date as default };
//# sourceMappingURL=date.js.map
