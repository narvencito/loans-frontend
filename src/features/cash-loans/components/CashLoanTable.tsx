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

interface Props {
  loans: CashLoanItem[];
  askToogle: (id: string) => void;
  onViewSchedule: (id: string) => void;
}

const CashLoanTable = ({ loans, askToogle, onViewSchedule }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Ahora también se maneja pageSize

  const totalPages = Math.ceil(loans.length / pageSize);
  const paginatedLoans = loans.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => onViewSchedule(l.id)}
                >
                  Cronograma
                </Button>
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => askToogle(l.id)}
                >
                  Eliminar
                </Button>
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
