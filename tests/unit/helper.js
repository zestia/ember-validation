import { get } from '@ember/object';
import {
  processMessage,
  defaultMessageFn
} from '@zestia/ember-validation/-private/messages';

const testLocale = {
  present: {
    'nothing-there': 'nothing there'
  },
  date: {
    year: '{value} should be in {_format} format'
  },
  email: {
    bad: '{value} is not valid'
  },
  'greater-than': {
    'not-bigger': '{value} is not bigger than {_value}'
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
  },
  test: {
    umami: 'Not umami',
    file: {
      size: '{name} is must be less than {_value} bytes'
    }
  }
};

export function testMessageFn(path, tokens) {
  return processMessage(get(testLocale, path), tokens);
}

export { defaultMessageFn };
