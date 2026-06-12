import { setDateInputMaxToday } from '../components/forms.js';
import { initImagePreview } from '../components/imagePreview.js';

export function initPreview() {
  setDateInputMaxToday('dataCompra');
  return initImagePreview();
}
