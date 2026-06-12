import { confirmAction, showErrorAlert } from '../components/alerts.js';
import { closeModal, openModal } from '../components/modal.js';
import { getState, setAllItems } from '../core/state.js';
import { categoriaEmoji, formatCategoria, formatDate } from '../core/utils.js';
import { sb } from '../core/supabase.js';
import { getCategoryFilteredItems } from './filters.js';
import { renderItemsGrid } from './render.js';
import { hydrateWarrantyData } from './warranty.js';

let rerenderDashboard = () => {};
let itemEventsBound = false;
let editingItemId = null;

function applyProgressWidths(container) {
  container.querySelectorAll('[data-progress-width]').forEach((element) => {
    element.style.width = `${element.dataset.progressWidth}%`;
  });
}

export async function loadItems() {
  const { currentUser } = getState();

  const { data, error } = await sb
    .from('items')
    .select('*')
    .eq('user_id', currentUser.id)
    .order('created_at', { ascending: false });

  if (!error && data) {
    setAllItems(data.map(hydrateWarrantyData));
  }
}

export function renderItemsByCategory() {
  const { allItems } = getState();
  renderItemsGrid('allItemsGrid', getCategoryFilteredItems(allItems));
}

export function renderAutomovel() {
  const { allItems } = getState();
  const items = allItems.filter((item) => item.categoria === 'automovel');

  renderItemsGrid('automovelGrid', items, {
    emptyIcon: '🚗',
    emptyMessage: 'Nenhum automóvel registado.',
    emptyLinkLabel: 'Adicionar →'
  });
}

export function openItemDetail(id) {
  const { allItems } = getState();
  const item = allItems.find((entry) => entry.id === id);

  if (!item) {
    return;
  }

  const percentage = item.percentagem;
  let barClass = 'bar-green';
  let statusClass = 'warranty-status--active';
  let statusText = 'Ativa';

  if (item.diasRestantes <= 0) {
    barClass = 'bar-red';
    statusClass = 'warranty-status--expired';
    statusText = 'Expirada';
  } else if (percentage <= 10) {
    barClass = 'bar-red';
    statusClass = 'warranty-status--critical';
    statusText = 'Crítica';
  } else if (percentage <= 30) {
    barClass = 'bar-amber';
    statusClass = 'warranty-status--risk';
    statusText = 'Em risco';
  }

  const emoji = categoriaEmoji[item.categoria] || '📦';

  document.getElementById('modalContent').innerHTML = `
    <div class="modal-emoji">${emoji}</div>
    <div class="modal-title">${item.nome}</div>
    <div class="modal-brand">${item.marca}</div>

    <div class="detail-row">
      <span class="detail-label">Categoria</span>
      <span class="detail-value">${formatCategoria(item.categoria)}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Data de compra</span>
      <span class="detail-value">${formatDate(item.data_compra)}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Garantia</span>
      <span class="detail-value">${item.garantia_meses} meses</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Data de expiração</span>
      <span class="detail-value">${formatDate(item.dataExpiracao)}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Estado da garantia</span>
      <span class="warranty-status ${statusClass}">${statusText}</span>
    </div>
    ${item.serial ? `<div class="detail-row">
      <span class="detail-label">Número de série</span>
      <span class="detail-value detail-value--mono">${item.serial}</span>
    </div>` : ''}
    ${item.preco ? `<div class="detail-row">
      <span class="detail-label">Preço</span>
      <span class="detail-value">Kz ${parseFloat(item.preco).toLocaleString('pt-PT')}</span>
    </div>` : ''}
    ${item.notas ? `<div class="detail-row">
      <span class="detail-label">Notas</span>
      <span class="detail-value">${item.notas}</span>
    </div>` : ''}

    <div class="guarantee-bar-wrap guarantee-bar-wrap--modal">
      <div class="guarantee-bar-label">
        <span>Garantia restante</span>
        <span>${percentage}% (${item.diasRestantes} dias)</span>
      </div>
      <div class="guarantee-bar-bg guarantee-bar-bg--tall">
        <div class="guarantee-bar-fill ${barClass}" data-progress-width="${percentage}"></div>
      </div>
    </div>

    <div class="modal-actions">
      <button class="btn-primary" data-action="edit-item" data-item-id="${item.id}">✏️ Editar</button>
      <button class="btn-danger" data-action="delete-item" data-item-id="${item.id}">🗑 Eliminar</button>
    </div>
  `;

  applyProgressWidths(document.getElementById('modalContent'));

  openModal('itemModal');
}

export function editItem(id) {
  const { allItems } = getState();

  const item = allItems.find(
    (entry) => entry.id === id
  );

  if (!item) {
    return;
  }

  editingItemId = id;

  document.getElementById('editItemNome').value =
    item.nome || '';

  document.getElementById('editItemMarca').value =
    item.marca || '';

  document.getElementById('editItemNotas').value =
    item.notas || '';

  openModal('editItemModal');
}

export async function saveItemChanges() {
  if (!editingItemId) {
    return;
  }

  const nome =
    document.getElementById('editItemNome')
      .value
      .trim();

  const marca =
    document.getElementById('editItemMarca')
      .value
      .trim();

  const notas =
    document.getElementById('editItemNotas')
      .value
      .trim();

  const { error } = await sb
    .from('items')
    .update({
      nome,
      marca,
      notas
    })
    .eq('id', editingItemId);

  if (error) {
    showErrorAlert(
      `Erro ao editar: ${error.message}`
    );

    return;
  }

  closeModal('editItemModal');
  closeModal('itemModal');

  editingItemId = null;

  await loadItems();
  await rerenderDashboard();
}

export async function deleteItem(id) {
  const { allItems } = getState();
  const item = allItems.find((entry) => entry.id === id);
  const confirmed = await confirmAction({
    title: 'Eliminar item?',
    message: item
      ? `Tens a certeza que queres eliminar "${item.nome}" do teu inventário? Esta ação não pode ser desfeita.`
      : 'Tens a certeza que queres eliminar este item? Esta ação não pode ser desfeita.',
    confirmLabel: 'Eliminar',
    cancelLabel: 'Cancelar'
  });

  if (!confirmed) {
    return;
  }

  const { error } = await sb.from('items').delete().eq('id', id);

  if (!error) {
    closeModal('itemModal');
    await loadItems();
    await rerenderDashboard();
  } else {
    showErrorAlert(`Erro ao eliminar: ${error.message}`);
  }
}

export function bindItemEvents({ onItemsChanged }) {
  rerenderDashboard = onItemsChanged || rerenderDashboard;

  if (itemEventsBound) {
    return;
  }

  itemEventsBound = true;

  document.addEventListener('click', async (event) => {
    const openTrigger = event.target.closest('[data-open-item]');

    const saveTrigger =
    event.target.closest('#saveItemChangesBtn');

    if (saveTrigger) {
    await saveItemChanges();
    return;
    
    }

    if (openTrigger) {
      openItemDetail(openTrigger.dataset.openItem);
      return;
    }

    const editTrigger = event.target.closest('[data-action="edit-item"]');

    if (editTrigger) {
      await editItem(editTrigger.dataset.itemId);
      return;
    }

    const deleteTrigger = event.target.closest('[data-action="delete-item"]');

    if (deleteTrigger) {
      await deleteItem(deleteTrigger.dataset.itemId);
    }
  });
}
