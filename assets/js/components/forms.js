import { getTodayIsoDate } from '../core/utils.js';

export function setButtonLoading(button, loadingText) {
  if (!button) {
    return;
  }

  button.disabled = true;
  button.textContent = loadingText;
}

export function resetButton(button, defaultText) {
  if (!button) {
    return;
  }

  button.disabled = false;
  button.textContent = defaultText;
}

export function setDateInputMaxToday(inputId) {
  const input = document.getElementById(inputId);

  if (!input) {
    return;
  }

  input.max = getTodayIsoDate();
}
