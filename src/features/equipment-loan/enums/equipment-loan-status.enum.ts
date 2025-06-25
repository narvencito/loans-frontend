export enum EquipmentLoanStatusCode {
  CREATED = 'created',        // Préstamo generado en el sistema, pendiente de entrega
  DELIVERED = 'delivered',    // El equipo fue entregado físicamente al cliente
  RETURNED = 'returned',      // El cliente devolvió el equipo
  OVERDUE = 'overdue',       // El préstamo está vencido (no devuelto a tiempo)
  CANCELLED = 'cancelled'     // El préstamo fue cancelado antes de la entrega
}

// Función helper para obtener el nombre amigable del estado
export const getEquipmentLoanStatusName = (status: EquipmentLoanStatusCode): string => {
  const statusNames: Record<EquipmentLoanStatusCode, string> = {
    [EquipmentLoanStatusCode.CREATED]: 'Pendiente de entrega',
    [EquipmentLoanStatusCode.DELIVERED]: 'Entregado',
    [EquipmentLoanStatusCode.RETURNED]: 'Devuelto',
    [EquipmentLoanStatusCode.OVERDUE]: 'Vencido',
    [EquipmentLoanStatusCode.CANCELLED]: 'Cancelado'
  };
  return statusNames[status];
}; 