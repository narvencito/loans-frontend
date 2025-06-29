import { RequestTypeEnum } from '@/shared/enums/request-type.enum';

export interface BaseLoanDetails {
  amount?: number;
  termInMonths?: number;
  interestRate?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CashLoanDetails extends BaseLoanDetails {
  type: RequestTypeEnum.CASH;
}

export interface EquipmentLoanDetails extends BaseLoanDetails {
  type: RequestTypeEnum.EQUIPMENT_LOAN;
  termInDays?: number;
  downPayment?: number;
  equipmentId: string;
}

export interface EquipmentFinancingDetails extends BaseLoanDetails {
  type: RequestTypeEnum.EQUIPMENT_FINANCING;
  downPayment: number;
  equipmentId: string;
}

export type LoanDetails = CashLoanDetails | EquipmentLoanDetails | EquipmentFinancingDetails; 