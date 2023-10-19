import { get } from '@ember/object';
import {
  processMessage,
  defaultMessageFn
} from '@zestia/ember-validation/-private/messages';

const testLocale = {
  'is-foo': 'validation failed for {value}. Extra data: {baz}',
  present: {
    'must-enter-description': 'You must enter a description',
    'nothing-there': 'nothing there'
  },
  date: {
    year: '{value} should be in {format} format'
  },
  email: {
    bad: '{value} is not valid'
  },
  'greater-than': {
    'not-bigger': '{value} is not bigger than {otherValue}'
  },
  'big-decimal': {
    'must-be-a-number': '{value} must be a number'
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
