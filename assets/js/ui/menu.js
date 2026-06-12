
  export function initMenu() {

  const hamburger = document.querySelector('#hamburger');
  const navLinks = document.querySelector('#nav-links');

  if (!hamburger || !navLinks) return;

  function openMenu() {
    navLinks.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    navLinks.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();

    const isOpen = navLinks.classList.contains('active');

    isOpen ? closeMenu() : openMenu();
  });

  // Fecha ao clicar nos links
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Fecha ao clicar fora
  document.addEventListener('click', (e) => {

    if (
      navLinks.classList.contains('active') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMenu();
    }

  })
}