const { isArray } = Array;

export function maxLength(a, b) {
  let length;

  if (isArray(a)) {
    length = a.length;
  } else {
    length = `${a}`.length;
  }

  return length <= b;
}

export default function maxLengthConstraint(options = {}) {
  return function(value) {
    if (maxLength(value, options.max)) {
      return;
    }

    return options.message || `length is too long (max ${options.max})`;
  };
}
