export const categoriaEmoji = {
  eletrodomestico: '🏠',
  eletronica: '📱',
  automovel: '🚗',
  moveis: '🪑',
  outros: '📦',
  '': '📦'
};

export const CATEGORY_LABELS = {
  eletrodomestico: 'Eletrodomésticos',
  eletronica: 'Eletrónica',
  automovel: 'Automóvel',
  moveis: 'Móveis',
  outros: 'Outros'
};

export function formatDate(date) {
  if (!date) {
    return '—';
  }

  const parsedDate = new Date(date);

  return parsedDate.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function formatCategoria(category) {
  return CATEGORY_LABELS[category] || category;
}

export function formatCurrency(value) {
  return value > 0 ? `Kz ${value.toLocaleString('pt-PT')}` : '—';
}

export function getTodayIsoDate() {
  return new Date().toISOString().split('T')[0];
}
