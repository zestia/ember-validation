'use strict';

module.exports = {
  ...require('@zestia/eslint-config/ember-addon'),

  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'date-fns',
            message:
              "Please use individual named date-fns imports instead, e.g. `import isValid from 'date-fns/isValid'`"
          },
          {
            name: 'date-fns/esm',
            message:
              "Please use individual named date-fns imports instead, e.g. `import isValid from 'date-fns/isValid'`"
          }
        ]
      }
    ]
  }
};
