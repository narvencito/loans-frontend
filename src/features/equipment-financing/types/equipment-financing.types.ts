import { EquipmentFinancingItem } from "../api/equipment-financing-api";

export interface EquipmentFinancingInstallment {
  id: string;
  number: number;
  dueDate: string;
  amount: number;
  capital: number;
  interest: number;
  balance: number;
  status: {
    id: string;
    name: string;
    code: string;
  };
}

export interface EquipmentFinancing extends EquipmentFinancingItem {} 