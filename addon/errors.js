import EmberError from '@ember/error';

export class ValidationError extends EmberError {
  constructor(message, result) {
    super(...arguments);
    this.message = message;
    this.result = result;
  }

  get message() {
    return this.customMessage || this.defaultMessage;
  }

  set message(message) {
    this.customMessage = message;
  }

  get defaultMessage() {
    return 'Validation failed';
  }
}
