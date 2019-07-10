export class ValidationError extends Error {
  constructor(message, result) {
    super(message || 'Validation failed');
    this.result = result;
  }
}
