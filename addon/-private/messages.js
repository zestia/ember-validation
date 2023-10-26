import { get } from '@ember/object';
import { isFunction } from '@zestia/ember-validation/-private/utils';
const { keys } = Object;

// Yep, module state
let t = defaultMessageFn; // eslint-disable-line no-unused-vars

const locale = {
  'big-decimal': {
    'must-be-a-number': 'Value must be a number',
    'value-too-large': 'Value too large',
    'max-decimal-places':
      'Value must have a maximum of {_maxDecimalDigits} decimal places'
  },
  date: 'Invalid date, expecting {_format}',
  email: 'Invalid email',
  'greater-than': 'Must be greater than {_value}',
  'less-than': 'Must be less than {_value}',
  'max-length': 'Length is too long (max {_max})',
  'min-length': 'Length must be at least {_min}',
  number: 'Invalid number',
  'phone-number': 'Invalid phone number',
  present: 'Required value',
  truthy: 'Must be truthy'
};

export function defaultMessageFn(path, tokens) {
  return processMessage(get(locale, path), tokens);
}

export function processMessage(string, tokens) {
  return string.replace(/{(.*?)}/g, (match, token) => tokens[token]);
}

export function setMessageFn(fn) {
  t = fn;
}

export function messageFor(key, value, object, options = {}) {
  const tokens = keys(options).reduce(
    (all, key) => {
      all[`_${key}`] = options[key];
      return all;
    },
    { ...object, value }
  );

  const message = options.message;

  if (message) {
    if (isFunction(message)) {
      return message(tokens);
    }

    return message;
  }

  return t(options.key ?? key, tokens);
}
