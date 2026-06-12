import { createToast } from '../components/toast.js';
import { initPreview } from './preview.js';
import { initSubmitItem } from './submitItem.js';

export function init() {
  const previewController = initPreview();
  const toast = createToast();

  initSubmitItem({ toast, previewController });

  document.getElementById('cancelBtn')?.addEventListener('click', () => {
    window.history.back();
  });
}
