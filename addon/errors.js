export class ValidationError extends Error {
  constructor(message, result) {
    super(...arguments);
    this.message = message || 'Validation failed';
    this.result = result;
  }
}
