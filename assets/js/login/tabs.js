import { hideMessages } from './messages.js';

export function switchTab(tab) {
  document.querySelectorAll('.tab').forEach((button, index) => {
    button.classList.toggle(
      'active',
      (index === 0 && tab === 'login') || (index === 1 && tab === 'register')
    );
  });

  document.getElementById('panel-login').classList.toggle('active', tab === 'login');
  document.getElementById('panel-register').classList.toggle('active', tab === 'register');
  hideMessages();
}

export function initTabs() {
  document.querySelector('.tabs')?.addEventListener('click', (event) => {
    const tabButton = event.target.closest('[data-tab]');

    if (tabButton) {
      switchTab(tabButton.dataset.tab);
    }
  });
}
