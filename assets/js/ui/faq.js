export function initFAQ() {
  const items = document.querySelectorAll('.faq-item');

  if (!items.length) {
    return;
  }

  items.forEach((item, index) => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-a');

    if (!trigger || !panel) {
      return;
    }

    const panelId = panel.id || `faq-panel-${index + 1}`;
    const triggerId = trigger.id || `faq-trigger-${index + 1}`;

    panel.id = panelId;
    trigger.id = triggerId;
    trigger.setAttribute('aria-controls', panelId);
    panel.setAttribute('aria-labelledby', triggerId);
    panel.hidden = false;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      items.forEach((faqItem) => {
        const faqTrigger = faqItem.querySelector('.faq-trigger');
        const faqPanel = faqItem.querySelector('.faq-a');

        faqItem.classList.remove('open');

        if (faqTrigger) {
          faqTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      if (!isOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}




