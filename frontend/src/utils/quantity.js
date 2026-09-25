/**
 * Converts quantity in Kg or Qtl into formatted string displaying both Quintals and Kgs
 * 1 Quintal (Qtl) = 100 Kg
 */
export const formatQuantity = (quantityInKg) => {
  if (quantityInKg === undefined || quantityInKg === null || isNaN(quantityInKg)) {
    return '0 Qtl (0 Kg)';
  }
  const kg = parseFloat(quantityInKg);
  const qtl = (kg / 100).toFixed(2);
  const formattedKg = kg.toLocaleString('en-IN');
  return `${qtl} Qtl (${formattedKg} Kg)`;
};

export const kgToQtl = (kg) => {
  if (!kg || isNaN(kg)) return '0.00';
  return (parseFloat(kg) / 100).toFixed(2);
};

export const qtlToKg = (qtl) => {
  if (!qtl || isNaN(qtl)) return 0;
  return Math.round(parseFloat(qtl) * 100);
};
