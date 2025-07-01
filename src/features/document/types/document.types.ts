export enum DocumentEntityType {
  REQUESTS = 'requests',
  CASH_LOANS = 'cash_loans',
  EQUIPMENT_LOANS = 'equipment_loans',
  EQUIPMENT_FINANCING = 'equipment_financing',
  CLIENTS = 'clients'
}

export interface Document {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  description?: string;
  entityType: DocumentEntityType;
  entityId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface UploadDocumentDto {
  file: File;
  entityType: DocumentEntityType;
  entityId: string;
  description?: string;
}

export interface DocumentFilter {
  entityType: DocumentEntityType;
  entityId: string;
  search?: string;
  page?: number;
  limit?: number;
} 