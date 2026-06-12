import { formatCurrency } from '../core/utils.js';

export function renderStats(items) {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const newThisMonth = items.filter((item) => new Date(item.created_at) >= firstDayOfMonth).length;
  const activeWarranties = items.filter((item) => item.diasRestantes > 0).length;
  const expiringSoon = items.filter((item) => item.diasRestantes > 0 && item.diasRestantes <= 30).length;
  const totalValue = items.reduce((sum, item) => sum + (parseFloat(item.preco) || 0), 0);

  document.getElementById('statTotal').textContent = items.length;
  document.getElementById('statAtivas').textContent = activeWarranties;
  document.getElementById('statExpirando').textContent = expiringSoon;
  document.getElementById('statValor').textContent = formatCurrency(totalValue);
  document.getElementById('statNewMonth').textContent = newThisMonth > 0 ? `+${newThisMonth} este mês` : '';
}
