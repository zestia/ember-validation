const phoneNumberPattern = /^[0-9 \-()+.]+$/i;

export function validPhoneNumber(value) {
  return phoneNumberPattern.test(value);
}

export default function phoneNumberConstraint(options = {}) {
  return function(value) {
    if (!value && options.optional) {
      return;
    }

    if (validPhoneNumber(value)) {
      return;
    }

    return options.message || 'invalid phone number';
  };
}
