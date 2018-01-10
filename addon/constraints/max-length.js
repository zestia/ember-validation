export function maxLength(a, b) {
  return (a || '').length <= b;
}

export default function maxLengthConstraint(options = {}) {
  return function(value) {
    if (maxLength(value, options.max)) {
      return;
    }

    return options.message || `length is too long (max ${options.max})`;
  };
}
