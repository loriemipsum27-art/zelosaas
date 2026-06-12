export function calcExpiry(dataCompra, meses) {
  const expiryDate = new Date(dataCompra);
  expiryDate.setMonth(expiryDate.getMonth() + parseInt(meses, 10));
  return expiryDate;
}

export function calcDaysLeft(dataCompra, meses) {
  const expiryDate = calcExpiry(dataCompra, meses);
  const today = new Date();

  return Math.max(0, Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24)));
}

export function calcPercentage(dataCompra, meses) {
  const startDate = new Date(dataCompra);
  const expiryDate = calcExpiry(dataCompra, meses);
  const today = new Date();
  const total = expiryDate - startDate;
  const elapsed = today - startDate;

  return Math.max(0, Math.min(100, Math.round((1 - elapsed / total) * 100)));
}

export function hydrateWarrantyData(item) {
  return {
    ...item,
    dataExpiracao: calcExpiry(item.data_compra, item.garantia_meses),
    diasRestantes: calcDaysLeft(item.data_compra, item.garantia_meses),
    percentagem: calcPercentage(item.data_compra, item.garantia_meses)
  };
}
