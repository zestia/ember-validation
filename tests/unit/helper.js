import { get } from '@ember/object';
import {
  processMessage,
  defaultMessageFn
} from '@zestia/ember-validation/-private/messages';

const testLocale = {
  'must-enter-description': 'You must enter a description',
  'date-year': '{value} should be in {format} format',
  'is-fred': 'Must be Fred',
  'bad-email': '{value} is not valid',
  'not-bigger': '{value} is not bigger than {otherValue}',
  'big-decimal': {
    'must-be-a-number': '{value} must be a number'
  },
  present: {
    'nothing-there': 'nothing there'
  },
  truthy: {
    'please-accept-the-terms': 'please accept the terms'
  },
  'less-than': {
    'not-small-enough': 'not small enough'
  },
  'max-length': {
    'exceeds-max': 'exceeds max'
  },
  'min-length': {
    'too-short': 'too short'
  },
  number: {
    'bad-number': 'bad number'
  },
  'phone-number': {
    'bad-phone': 'bad phone'
  }
};

export function testMessageFn(path, tokens) {
  return processMessage(get(testLocale, path), tokens);
}

export { defaultMessageFn };
