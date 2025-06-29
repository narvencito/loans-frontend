export interface ClientRequest {
  id: string;
  code: string;
  clientId: string;
  requestTypeId: string;
  requestStatusId: string;
  equipmentId?: string;
  message?: string;
  termInDays?: number;
  termInMonths?: number;
  interestRate?: number;
  amount?: number;
  downPayment?: number;
  status: string;
  createdAt: string | Record<string, never>;
  requestType: {
    id: string;
    name: 'cash' | 'equipment-loan' | 'equipment-financing';
    isActive: boolean;
    createdAt: string | Record<string, never>;
    updatedAt: string | Record<string, never>;
  };
  requestStatus: {
    id: string;
    code: string;
    name: string;
    description?: string;
    isActive: boolean;
    createdAt: string | Record<string, never>;
    updatedAt: string | Record<string, never>;
  };
  client: {
    id: string;
    name: string;
    fullName: string;
    paternalSurname: string;
    maternalSurname: string;
    document: string;
    email: string;
    phone: string;
    address?: string;
    codeStudent: string;
    isActive: boolean;
    userId: string;
    createdAt: string | Record<string, never>;
    updatedAt: string | Record<string, never>;
  };
  equipment?: {
    id: string;
    name: string;
    description: string;
    code: string;
    serial: string;
    location: string;
    purchasePrice: number;
    salePrice: number;
    rentalDailyRate: number;
    brandId: string;
    categoryId: string;
    generalCategoryId: string;
    statusId: string;
    isActive: boolean;
    createdAt: string | Record<string, never>;
    updatedAt: string | Record<string, never>;
  };
}

export interface ClientRequestResponse {
  data: ClientRequest[];
  total: number;
  page: number;
  limit: number;
}

export interface RequestFilters {
  status: string;
  type: string;
  fromDate: string;
  toDate: string;
} 