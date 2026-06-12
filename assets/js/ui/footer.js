export function initCurrentYear() {
  const footerCopy = document.querySelector('.footer-copy');

  if (!footerCopy) {
    return;
  }

  footerCopy.textContent = `© ${new Date().getFullYear()} Zelo. Feito em Portugal`;
}
