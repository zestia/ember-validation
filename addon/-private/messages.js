import { get } from '@ember/object';

const locale = {
  'big-decimal': {
    'must-be-a-number': 'Value must be a number',
    'value-too-large': 'Value too large',
    'max-decimal-places':
      'Value must have a maximum of {maxDecimalDigits} decimal places'
  },
  date: 'Invalid date, expecting {format}',
  email: 'Invalid email',
  'greater-than': 'Must be greater than {boundary}',
  'less-than': 'Must be less than {boundary}',
  'max-length': 'Length is too long (max {max})',
  'min-length': 'Length must be at least {min}',
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

export let t = defaultMessageFn;

export function setMessageFn(fn) {
  t = fn;
}
