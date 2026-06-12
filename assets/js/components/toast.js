export function createToast({
  toastId = 'toast',
  iconId = 'toastIcon',
  titleId = 'toastTitle',
  messageId = 'toastMessage'
} = {}) {
  const toast = document.getElementById(toastId);
  const toastIcon = document.getElementById(iconId);
  const toastTitle = document.getElementById(titleId);
  const toastMessage = document.getElementById(messageId);
  let toastTimeout;

  

  return {
    show(type, title, message) {
      if (!toast || !toastIcon || !toastTitle || !toastMessage) {
        return;
      }

      clearTimeout(toastTimeout);

      toast.classList.remove('success', 'error');
      toast.classList.add(type);
      toastIcon.textContent = type === 'success' ? '✅' : '⚠️';
      toastTitle.textContent = title;
      toastMessage.textContent = message;
      toast.classList.add('show');

      toastTimeout = window.setTimeout(() => {
        toast.classList.remove('show');
      }, 3500);
    }
  };
}
