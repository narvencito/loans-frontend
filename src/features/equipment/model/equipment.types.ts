export enum EquipmentUsageType {
  RENTAL = 'RENTAL',
  FINANCING = 'FINANCING'
}

export const EQUIPMENT_USAGE_TYPE_LABELS: Record<EquipmentUsageType, string> = {
  [EquipmentUsageType.RENTAL]: 'Alquiler',
  [EquipmentUsageType.FINANCING]: 'Financiamiento'
}; 