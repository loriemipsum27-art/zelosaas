import { setButtonLoading, resetButton } from '../components/forms.js';
import { redirectIfAuthenticated, signInWithPassword } from '../core/auth.js';
import { forgotPassword } from './forgotPassword.js';
import { showError } from './messages.js';
import { register } from './register.js';
import { initTabs } from './tabs.js';

export async function login() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const button = document.getElementById('loginBtn');

  if (!email || !password) {
    showError('Preenche todos os campos.');
    return;
  }

  setButtonLoading(button, 'A entrar...');

  const { error } = await signInWithPassword({ email, password });

  if (error) {
    showError('Email ou palavra-passe incorretos.');
    resetButton(button, 'Entrar na minha conta');
  } else {
    window.location.href = 'dashboard.html';
  }
}

let loginEventsBound = false;

function bindEvents() {
  if (loginEventsBound) {
    return;
  }

  loginEventsBound = true;

  document.getElementById('loginBtn')?.addEventListener('click', login);
  document.getElementById('registerBtn')?.addEventListener('click', register);
  document.getElementById('forgotPasswordLink')?.addEventListener('click', (event) => {
    event.preventDefault();
    forgotPassword();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const isLoginTab = document.getElementById('panel-login').classList.contains('active');
      isLoginTab ? login() : register();
    }
  });
}

export async function init() {
  await redirectIfAuthenticated('dashboard.html');
  initTabs();
  bindEvents();
}
