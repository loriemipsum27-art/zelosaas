import { init as initAddItem } from './addItem/addItem.js';
import { init as initDashboard } from './dashboard/dashboard.js';
import { init as initLogin } from './login/login.js';

const pageInitializers = {
  login: initLogin,
  dashboard: initDashboard,
  addItem: initAddItem
};

const page = document.body.dataset.page;
const init = pageInitializers[page];

if (init) {
  init();
}
