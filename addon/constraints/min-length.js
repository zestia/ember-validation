export function minLength(a, b) {
  return (a || '').length >= b;
}

export default function minLengthConstraint(options = {}) {
  return function(value) {
    if (minLength(value, options.min)) {
      return;
    }

    return options.message || `length must be at least ${options.min}`;
  };
}
