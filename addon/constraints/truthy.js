export default function truthy(options = {}) {
  return function (value) {
    if (value) {
      return;
    }

    return options.message || 'Must be truthy';
  };
}
