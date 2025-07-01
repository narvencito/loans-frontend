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

export interface EquipmentFinancing {
  id: string;
  totalAmount: number;
  downPayment: number;
  financedAmount: number;
  annualRate: number;
  term: number;
  startDate: string;
  requestId: string;
  statusId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  client: {
    id: string;
    name: string;
    fullName: string;
  };
  status: {
    id: string;
    name: string;
  };
  equipment: {
    id: string;
    name: string;
    code: string;
  };
  installments: EquipmentFinancingInstallment[];
} 