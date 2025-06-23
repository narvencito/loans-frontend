export const REQUEST_TYPE_NAMES: { [key: string]: string } = {
  'equipment-financing': 'Financiamiento de Equipo',
  'equipment-loan': 'Préstamo de Equipo',
  'cash': 'Préstamo en Efectivo',
};

export const getRequestTypeName = (type: string): string => {
  return REQUEST_TYPE_NAMES[type] || type;
}; 