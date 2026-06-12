import { bindSearchInput } from '../components/search.js';
import { getState, setCurrentCategory, setCurrentSearchTerm } from '../core/state.js';

export function getCategoryFilteredItems(items) {
  const { currentCategory, currentSearchTerm } = getState();
  let filteredItems = items;

  if (currentCategory !== 'todos') {
    filteredItems = filteredItems.filter((item) => item.categoria === currentCategory);
  }

  if (currentSearchTerm) {
    filteredItems = filteredItems.filter(
      (item) =>
        item.nome.toLowerCase().includes(currentSearchTerm) ||
        item.marca.toLowerCase().includes(currentSearchTerm)
    );
  }

  return filteredItems;
}

export function getSearchFilteredItems(items) {
  const { currentSearchTerm } = getState();

  if (!currentSearchTerm) {
    return items;
  }

  return items.filter(
    (item) =>
      item.nome.toLowerCase().includes(currentSearchTerm) ||
      item.marca.toLowerCase().includes(currentSearchTerm) ||
      (item.categoria || '').toLowerCase().includes(currentSearchTerm)
  );
}

export function initFilters({ onCategoryChange, onSearchChange }) {
  const categoryTabs = document.getElementById('categoryTabs');

  categoryTabs?.addEventListener('click', (event) => {
    const tab = event.target.closest('[data-category]');

    if (!tab) {
      return;
    }

    setCurrentCategory(tab.dataset.category);
    document.querySelectorAll('.cat-tab').forEach((button) => button.classList.remove('active'));
    tab.classList.add('active');
    onCategoryChange?.();
  });

  bindSearchInput('searchBar', (value) => {
    setCurrentSearchTerm(value);
    onSearchChange?.();
  });
}
