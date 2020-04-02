export default function truthyConstraint(options = {}) {
  return function (value) {
    if (value) {
      return;
    }

    return options.message || 'must be truthy';
  };
}
