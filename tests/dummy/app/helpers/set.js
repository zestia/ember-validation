export default function set(object, key) {
  return (event) => {
    object[key] =
      event.target.getAttribute('type') === 'checkbox'
        ? event.target.checked
        : event.target.value;
  };
}
