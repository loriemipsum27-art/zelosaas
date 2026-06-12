import { renderAlertsList } from '../components/alerts.js';
import { initModalSystem } from '../components/modal.js';
import { requireSession, signOut } from '../core/auth.js';
import { getState, setCurrentUser } from '../core/state.js';
import { initFilters, getSearchFilteredItems } from './filters.js';
import { bindItemEvents, loadItems, renderAutomovel, renderItemsByCategory } from './items.js';
import { loadProfile, bindProfileEvents } from './profile.js';
import { renderItemsGrid } from './render.js';
import { renderStats } from './stats.js';

function showView(viewId, linkEl) {
  document.querySelectorAll('.view').forEach((view) => view.classList.remove('active'));
  document.getElementById(`view-${viewId}`)?.classList.add('active');
  document.querySelectorAll('.sidebar a').forEach((anchor) => anchor.classList.remove('active'));

  if (linkEl) {
    linkEl.classList.add('active');
  }
}

function openMobileSidebar() {
  document.body.classList.add('sidebar-open');
   document.body.classList.add('no-scroll');
}

function closeMobileSidebar() {
  document.body.classList.remove('sidebar-open');
   document.body.classList.remove('no-scroll');
}

function bindMobileSidebar() {
  document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
    if (document.body.classList.contains('sidebar-open')) {
      closeMobileSidebar();
    } else {
      openMobileSidebar();
    }
  });

  document.getElementById('sidebarBackdrop')?.addEventListener('click', closeMobileSidebar);

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMobileSidebar();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMobileSidebar();
    }
  });
}

function bindNavigation() {
  document.querySelector('.sidebar')?.addEventListener('click', (event) => {
    const link = event.target.closest('[data-view]');

    if (!link) {
      return;
    }

    event.preventDefault();
    showView(link.dataset.view, link.dataset.sidebarLink === 'true' ? link : null);
    closeMobileSidebar();
  });

  document.querySelector('[data-dashboard-link="alertas"]')?.addEventListener('click', (event) => {
    event.preventDefault();
    showView('alertas', null);
  });
}

function bindLogout() {
  document.getElementById('logout-btn')?.addEventListener('click', async () => {
    await signOut();
    window.location.href = 'login.html';
  });
}

function renderRecentItems() {
  const { allItems } = getState();
  const searchFiltered = getSearchFilteredItems(allItems);

  renderItemsGrid('recentItemsGrid', searchFiltered.slice(0, 6));
}

export async function renderDashboard() {
  const { allItems } = getState();

  renderStats(allItems);
  renderAlertsList('alertsList', allItems, { limit: 3 });
  renderAlertsList('allAlertsList', allItems);
  renderRecentItems();
  renderItemsByCategory();
  renderAutomovel();
}

export async function init() {
  const session = await requireSession('login.html');

  if (!session) {
    return;
  }

  setCurrentUser(session.user);
  initModalSystem();
  bindNavigation();
  bindMobileSidebar();
  bindLogout();
  bindProfileEvents();
  bindItemEvents({ onItemsChanged: renderDashboard });
  initFilters({
    onCategoryChange: renderItemsByCategory,
    onSearchChange: () => {
      renderRecentItems();
      renderItemsByCategory();
    }
  });

  await loadProfile();
  await loadItems();
  await renderDashboard();
}
