export function initCTAForm() {
  const form = document.querySelector('.cta-form');

  if (!form) {
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const emailInput = form.querySelector('input[type="email"]');

    if (!emailInput || !emailInput.checkValidity()) {
      form.reportValidity();
      return;
    }

    form.dataset.state = 'submitted';
    emailInput.blur();
  });
}
