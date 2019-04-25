const { isArray } = Array;

export function minLength(a, b) {
  let length;

  if (isArray(a)) {
    length = a.length;
  } else {
    length = `${a}`.length;
  }

  return length >= b;
}

export default function minLengthConstraint(options = {}) {
  return function(value) {
    if (minLength(value, options.min)) {
      return;
    }

    return options.message || `length must be at least ${options.min}`;
  };
}
