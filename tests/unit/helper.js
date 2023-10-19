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
  'not-bigger': '{value} is not bigger than {boundary}',
  'big-decimal': {
    'must-be-a-number': '{value} must be a number'
  }
};

export function testMessageFn(path, tokens) {
  return processMessage(get(testLocale, path), tokens);
}

export { defaultMessageFn };