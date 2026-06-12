import { setButtonLoading, resetButton } from '../components/forms.js';
import { signUp } from '../core/auth.js';
import { showError, showSuccess } from './messages.js';

export async function register() {
  const nome = document.getElementById('regNome').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const button = document.getElementById('registerBtn');

  if (!nome || !email || !password) {
    showError('Preenche todos os campos.');
    return;
  }

  if (password.length < 6) {
    showError('A palavra-passe deve ter pelo menos 6 caracteres.');
    return;
  }

  setButtonLoading(button, 'A criar conta...');

  const { error } = await signUp({ email, password, nome });

  if (error) {
    showError(error.message);
    resetButton(button, 'Criar conta gratuita');
  } else {
    showSuccess('✅ Conta criada! Verifica o teu email para confirmar.');
    resetButton(button, 'Criar conta gratuita');
  }
}
