import React, { useState } from "react";
import { CashLoanItem } from "../api/cash_loans_api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Pagination from "@/shared/components/Pagination";
import { BlueButton, RedButton } from "@/components/common/ColorButtons";

interface Props {
  loans?: CashLoanItem[];
  isLoading?: boolean;
  onViewSchedule?: (id: string) => void;
  askToogle?: (cashLoanId: string) => Promise<void>;
}

export const CashLoanTable = ({ loans = [], isLoading, onViewSchedule, askToogle }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Ahora también se maneja pageSize

  const totalPages = Math.ceil(loans.length / pageSize);
  const paginatedLoans = loans.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Cargando...</span>
      </div>
    );
  }

  if (!loans.length) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No hay préstamos para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="text-muted-foreground">
            <TableHead>Cliente</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Cuotas</TableHead>
            <TableHead>Fecha Inicio</TableHead>
            <TableHead className="text-center">Estado</TableHead>
            <TableHead className="text-center">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedLoans.map((l) => (
            <TableRow key={l.id}>
              <TableCell className="text-foreground">{l.clientName}</TableCell>
              <TableCell className="text-foreground">S/ {l.amount}</TableCell>
              <TableCell className="text-foreground">{l.term}</TableCell>
              <TableCell className="text-foreground">
                {new Date(l.startDate).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-center">
                <span className="text-green-600">{l.state}</span>
              </TableCell>
              <TableCell className="text-center space-x-2">
                {onViewSchedule && (
                  <BlueButton
                    size="sm"
                    onClick={() => onViewSchedule(l.id)}
                  >
                    Cronograma
                  </BlueButton>
                )}
                {askToogle && (
                  <RedButton
                    size="sm"
                    onClick={() => askToogle(l.id)}
                  >
                    Eliminar
                  </RedButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Nuevo paginador avanzado */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1); 
        }}
      />
    </div>
  );
};

export default CashLoanTable;
