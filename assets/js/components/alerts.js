import { closeModal, openModal } from './modal.js';
import { formatDate } from '../core/utils.js';

export function renderAlertsList(containerId, items, { limit = null } = {}) {
  const container = document.getElementById(containerId);

  if (!container) {
    return;
  }

  const expiringItems = items
    .filter((item) => item.diasRestantes > 0 && item.diasRestantes <= 60)
    .sort((left, right) => left.diasRestantes - right.diasRestantes);

  const list = limit ? expiringItems.slice(0, limit) : expiringItems;

  if (list.length === 0) {
    container.innerHTML = '<div class="empty-state"><div>✅</div><p>Nenhum alerta de momento.</p></div>';
    return;
  }

  container.innerHTML = list
    .map((item) => {
      const urgent = item.diasRestantes <= 14;
      const badge = urgent
        ? '<div class="alert-badge alert-urgent">Urgente</div>'
        : '<div class="alert-badge alert-soon">Em breve</div>';

      return `
        <div class="alert-card">
          <div>
            ${badge}
            <h4 class="alert-title">${item.nome} — ${item.marca}</h4>
            <p class="alert-copy">
              Garantia expira em <strong>${item.diasRestantes} dias</strong>
              (${formatDate(item.dataExpiracao)})
            </p>
          </div>
          <button class="btn-primary btn-primary--compact u-ml-auto u-nowrap" data-open-item="${item.id}">Ver detalhes</button>
        </div>
      `;
    })
    .join('');
}

export function showErrorAlert(message) {
  window.alert(message);
}

let confirmModalBound = false;
let pendingConfirmResolve = null;

function getConfirmElements() {
  return {
    overlay: document.getElementById('confirmModal'),
    title: document.getElementById('confirmModalTitle'),
    message: document.getElementById('confirmModalMessage'),
    confirmButton: document.getElementById('confirmModalConfirm'),
    cancelButton: document.getElementById('confirmModalCancel')
  };
}

function settleConfirm(result) {
  if (!pendingConfirmResolve) {
    return;
  }

  const resolve = pendingConfirmResolve;
  pendingConfirmResolve = null;
  closeModal('confirmModal');
  resolve(result);
}

function bindConfirmModal() {
  if (confirmModalBound) {
    return;
  }

  const { overlay, confirmButton, cancelButton } = getConfirmElements();

  if (!overlay || !confirmButton || !cancelButton) {
    return;
  }

  confirmModalBound = true;

  confirmButton.addEventListener('click', () => {
    settleConfirm(true);
  });

  cancelButton.addEventListener('click', () => {
    settleConfirm(false);
  });

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      settleConfirm(false);
    }
  });

  overlay.addEventListener('click', (event) => {
    const closeTrigger = event.target.closest('[data-confirm-cancel]');

    if (closeTrigger) {
      settleConfirm(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && overlay.classList.contains('open')) {
      settleConfirm(false);
    }
  });
}

export function confirmAction(optionsOrMessage) {
  bindConfirmModal();

  const { overlay, title, message, confirmButton, cancelButton } = getConfirmElements();

  if (!overlay || !title || !message || !confirmButton || !cancelButton) {
    const fallbackMessage =
      typeof optionsOrMessage === 'string'
        ? optionsOrMessage
        : optionsOrMessage?.message || 'Tens a certeza?';

    return Promise.resolve(window.confirm(fallbackMessage));
  }

  if (pendingConfirmResolve) {
    settleConfirm(false);
  }

  const options =
    typeof optionsOrMessage === 'string'
      ? {
          title: 'Confirmar ação',
          message: optionsOrMessage,
          confirmLabel: 'Confirmar',
          cancelLabel: 'Cancelar'
        }
      : {
          title: 'Confirmar ação',
          message: 'Tens a certeza?',
          confirmLabel: 'Confirmar',
          cancelLabel: 'Cancelar',
          ...optionsOrMessage
        };

  title.textContent = options.title;
  message.textContent = options.message;
  confirmButton.textContent = options.confirmLabel;
  cancelButton.textContent = options.cancelLabel;

  openModal('confirmModal');

  return new Promise((resolve) => {
    pendingConfirmResolve = resolve;
  });
}
