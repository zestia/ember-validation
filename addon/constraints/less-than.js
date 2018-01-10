export function lessThan(a, b) {
  return a < b;
}

export default function lessThanConstraint(options = {}) {
  return function(value) {
    if (lessThan(value, options.value)) {
      return;
    }

    return options.message || `must be less than ${options.value}`;
  };
}
