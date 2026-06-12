import { setButtonLoading, resetButton } from '../components/forms.js';
import { getSession } from '../core/auth.js';
import { sb } from '../core/supabase.js';

export function initSubmitItem({ toast, previewController }) {
  const form = document.getElementById('addItemForm');

  if (!form) {
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = document.getElementById('submitBtn');
    setButtonLoading(submitButton, 'A guardar...');

    try {
      const session = await getSession();

      if (!session) {
        toast.show(
          'error',
          'Sessão expirada',
          'Precisas iniciar sessão para continuar.'
        );
        resetButton(submitButton, 'Adicionar ao meu inventário');
        return;
      }

      const user = session.user;
      const item = {
        user_id: user.id,
        nome: form.nome.value.trim(),
        marca: form.marca.value.trim(),
        data_compra: form.dataCompra.value,
        garantia_meses: parseInt(form.garantia.value, 10),
        serial: form.serial.value.trim(),
        categoria: form.categoria.value,
        notas: form.notas.value.trim()
      };

      const { error } = await sb.from('items').insert([item]);

      if (error) {
        console.error(error);
        toast.show('error', 'Erro ao guardar', error.message);
        resetButton(submitButton, 'Adicionar ao meu inventário');
        return;
      }

      toast.show(
        'success',
        'Item adicionado ✨',
        'O item foi guardado no teu inventário com sucesso.'
      );

      form.reset();
      previewController?.clear();

      window.setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1800);
    } catch (error) {
      console.error(error);
      toast.show(
        'error',
        'Erro inesperado',
        'Algo correu mal. Tenta novamente.'
      );
      resetButton(submitButton, 'Adicionar ao meu inventário');
    }
  });
}
