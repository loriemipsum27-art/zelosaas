import { categoriaEmoji, formatDate } from '../core/utils.js';

function applyProgressWidths(container) {
  container.querySelectorAll('[data-progress-width]').forEach((element) => {
    element.style.width = `${element.dataset.progressWidth}%`;
  });
}

export function renderItemsGrid(
  containerId,
  items,
  {
    emptyIcon = '📦',
    emptyMessage = 'Nenhum item encontrado.',
    emptyLinkHref = 'addItem.html',
    emptyLinkLabel = 'Adicionar o primeiro →'
  } = {}
) {
  const container = document.getElementById(containerId);

  if (!container) {
    return;
  }

  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-state empty-state--grid">
        <div>${emptyIcon}</div>
        <p>${emptyMessage}<br><a href="${emptyLinkHref}" class="u-text-green">${emptyLinkLabel}</a></p>
      </div>
    `;
    return;
  }

  container.innerHTML = items
    .map((item) => {
      const percentage = item.percentagem;
      let barClass = 'bar-green';

      if (percentage <= 10) {
        barClass = 'bar-red';
      } else if (percentage <= 30) {
        barClass = 'bar-amber';
      }

      const emoji = categoriaEmoji[item.categoria] || '📦';

      return `
        <div class="item-card" data-open-item="${item.id}">
          <div class="item-image">${emoji}</div>
          <div class="item-info">
            <div class="item-name">${item.nome}</div>
            <div class="item-meta">${item.marca} • ${formatDate(item.data_compra)} • ${item.garantia_meses} meses</div>
            <div class="guarantee-bar-wrap">
              <div class="guarantee-bar-label">
                <span>Garantia</span>
                <span>${item.diasRestantes > 0 ? `${item.diasRestantes} dias restantes` : 'Expirada'}</span>
              </div>
              <div class="guarantee-bar-bg">
                <div class="guarantee-bar-fill ${barClass}" data-progress-width="${percentage}"></div>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  applyProgressWidths(container);
}
