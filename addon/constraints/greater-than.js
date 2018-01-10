export function greaterThan(a, b) {
  return a > b;
}

export default function greaterThanConstraint(options = {}) {
  return function(value) {
    if (greaterThan(value, options.value)) {
      return;
    }

    return options.message || `must be greater than ${options.value}`;
  };
}
