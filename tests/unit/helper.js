import {
  processMessage,
  defaultMessageFn
} from '@zestia/ember-validation/-private/messages';

const testLocale = {
  'must-enter-description': 'You must enter a description',
  'date-year': '{value} should be in {format} format',
  'is-fred': 'Must be Fred',
  'bad-email': '{value} is not valid',
  'not-bigger': '{value} is not bigger than {boundary}'
};

export function testMessageFn(key, tokens) {
  return processMessage(testLocale[key], tokens);
}

export { defaultMessageFn };
