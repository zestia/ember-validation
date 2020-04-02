const { isArray } = Array;

export function maxLength(a, b) {
  let length = 0;

  if (isArray(a)) {
    length = a.length;
  } else if (typeof a === 'string' || typeof a === 'number') {
    length = `${a}`.length;
  }

  return length <= b;
}

export default function maxLengthConstraint(options = {}) {
  return function (value) {
    if (maxLength(value, options.max)) {
      return;
    }

    return options.message || `length is too long (max ${options.max})`;
  };
}
