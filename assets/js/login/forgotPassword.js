import { resetPasswordForEmail } from '../core/auth.js';

export async function forgotPassword() {
  const email = window.prompt('Insere o teu email para recuperar a palavra-passe:');

  if (!email) {
    return;
  }

  const { error } = await resetPasswordForEmail(
    email,
    `${window.location.origin}/reset-password.html`
  );

  if (error) {
    window.alert(`Erro: ${error.message}`);
  } else {
    window.alert('✅ Email de recuperação enviado!');
  }
}
