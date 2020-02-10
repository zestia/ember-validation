const { isArray } = Array;

export function minLength(a, b) {
  let length = 0;

  if (isArray(a)) {
    length = a.length;
  } else if (typeof a === 'string' || typeof a === 'number') {
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
