export function showError(message) {
  const errorElement = document.getElementById('errorMsg');
  const successElement = document.getElementById('successMsg');

  errorElement.textContent = message;
  errorElement.style.display = 'block';
  successElement.style.display = 'none';
}

export function showSuccess(message) {
  const errorElement = document.getElementById('errorMsg');
  const successElement = document.getElementById('successMsg');

  successElement.textContent = message;
  successElement.style.display = 'block';
  errorElement.style.display = 'none';
}

export function hideMessages() {
  document.getElementById('errorMsg').style.display = 'none';
  document.getElementById('successMsg').style.display = 'none';
}
