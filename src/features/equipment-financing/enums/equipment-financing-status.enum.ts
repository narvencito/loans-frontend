export enum EquipmentFinancingStatusCode {
  PENDING = 'PENDIENTE',
  IN_PROGRESS = 'EN_CURSO',
  CANCELLED = 'CANCELADO',
  VOIDED = 'ANULADO',
  COMPLETED = 'COMPLETADO'
}

export const EquipmentFinancingStatusLabel: Record<EquipmentFinancingStatusCode, string> = {
  [EquipmentFinancingStatusCode.PENDING]: 'Pendiente',
  [EquipmentFinancingStatusCode.IN_PROGRESS]: 'En Curso',
  [EquipmentFinancingStatusCode.CANCELLED]: 'Cancelado',
  [EquipmentFinancingStatusCode.VOIDED]: 'Anulado',
  [EquipmentFinancingStatusCode.COMPLETED]: 'Completado'
}; 