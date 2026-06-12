export function bindSearchInput(inputId, onSearch) {
  const input = document.getElementById(inputId);

  if (!input) {
    return null;
  }

  input.addEventListener('input', (event) => {
    onSearch(event.target.value.toLowerCase().trim(), event);
  });

  return input;
}
