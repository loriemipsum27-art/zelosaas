export function openModal(id) {
  document.getElementById(id)?.classList.add('open');
  document.body.classList.add('no-scroll');
}

export function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
  document.body.classList.remove('no-scroll');
}

let modalSystemReady = false;

export function initModalSystem() {
  if (modalSystemReady) {
    return;
  }

  modalSystemReady = true;

  document.addEventListener('click', (event) => {
    const closeTrigger = event.target.closest('[data-close-modal]');

    if (closeTrigger) {
      closeModal(closeTrigger.dataset.closeModal);
    }
  });

  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', function onOverlayClick(event) {
      if (event.target === this) {
        this.classList.remove('open');
      }
    });
  });
}
