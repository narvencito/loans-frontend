import { RequestStatusCode } from '../enums/request-status.enum';

export const REQUEST_STATUS_LABELS: Record<RequestStatusCode, string> = {
  [RequestStatusCode.PENDING]: 'Pendiente',
  [RequestStatusCode.IN_REVIEW]: 'En revisión',
  [RequestStatusCode.APPROVED]: 'Aprobado',
  [RequestStatusCode.REJECTED]: 'Rechazado',
  [RequestStatusCode.CANCELLED]: 'Cancelado',
  [RequestStatusCode.CONVERTED]: 'Convertido',
};

export const REQUEST_STATUS_STYLES: Record<RequestStatusCode, {
  bg: string;
  text: string;
  border: string;
}> = {
  [RequestStatusCode.PENDING]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300'
  },
  [RequestStatusCode.IN_REVIEW]: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300'
  },
  [RequestStatusCode.APPROVED]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300'
  },
  [RequestStatusCode.CONVERTED]: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-300'
  },
  [RequestStatusCode.REJECTED]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300'
  },
  [RequestStatusCode.CANCELLED]: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-300'
  }
}; 