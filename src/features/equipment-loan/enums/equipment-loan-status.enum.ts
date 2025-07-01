export enum EquipmentLoanStatusCode {
  CREATED = 'created',
  DELIVERED = 'delivered',
  OVERDUE = 'overdue',
  RETURNED = 'returned',
  CANCELLED = 'cancelled'
}

export const EquipmentLoanStatusLabel: Record<EquipmentLoanStatusCode, string> = {
  [EquipmentLoanStatusCode.CREATED]: 'Pendiente de entrega',
  [EquipmentLoanStatusCode.DELIVERED]: 'Entregado',
  [EquipmentLoanStatusCode.OVERDUE]: 'Vencido',
  [EquipmentLoanStatusCode.RETURNED]: 'Devuelto',
  [EquipmentLoanStatusCode.CANCELLED]: 'Cancelado'
};

// Función helper para obtener la etiqueta del estado a partir del código
export const getEquipmentLoanStatusLabel = (statusCode: EquipmentLoanStatusCode): string => {
  return EquipmentLoanStatusLabel[statusCode];
};

// Función helper para validar si un código corresponde a un estado válido
export const isValidEquipmentLoanStatus = (statusCode: string): statusCode is EquipmentLoanStatusCode => {
  return Object.values(EquipmentLoanStatusCode).includes(statusCode as EquipmentLoanStatusCode);
}; 