import { RequestStatusCode } from '../enums/request-status.enum';
import { ALLOWED_STATUS_TRANSITIONS } from '../types/request-status.types';

export const isValidStatusTransition = (
  fromStatus: RequestStatusCode,
  toStatus: RequestStatusCode
): boolean => {
  const transition = ALLOWED_STATUS_TRANSITIONS[fromStatus];
  return transition?.to.includes(toStatus) || false;
};

export const requiresCommentForTransition = (
  fromStatus: RequestStatusCode,
  toStatus: RequestStatusCode
): boolean => {
  const transition = ALLOWED_STATUS_TRANSITIONS[fromStatus];
  return transition?.requiresComment || false;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('es-PE', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
};

export const calculateMonthlyPayment = (
  principal: number,
  annualInterestRate: number,
  termInMonths: number
): number => {
  const monthlyRate = (annualInterestRate / 100) / 12;
  const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) / 
                 (Math.pow(1 + monthlyRate, termInMonths) - 1);
  return Math.round(payment * 100) / 100;
};

export const calculateTotalInterest = (
  monthlyPayment: number,
  termInMonths: number,
  principal: number
): number => {
  return Math.round((monthlyPayment * termInMonths - principal) * 100) / 100;
}; 