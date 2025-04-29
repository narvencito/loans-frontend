import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const Pagination = ({ currentPage, totalPages, pageSize, onPageChange, onPageSizeChange }: PaginationProps) => {
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handleGoToPage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.page as unknown as HTMLInputElement;
    const page = parseInt(input.value);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center p-4 gap-4 border-t mt-4">
      {/* Navegación Anterior/Siguiente */}
      <div className="flex items-center gap-2">
        <Button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="bg-gray-200 text-black hover:bg-gray-300"
        >
          Anterior
        </Button>

        <span className="text-sm">
          Página {currentPage} de {totalPages}
        </span>

        <Button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="bg-gray-200 text-black hover:bg-gray-300"
        >
          Siguiente
        </Button>
      </div>

      {/* Selector de cantidad por página */}
      <div className="flex items-center gap-2">
        <span className="text-sm">Mostrar</span>
        <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
          <SelectTrigger className="w-20">
            <SelectValue placeholder="Tamaño" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm">filas</span>
      </div>

      {/* Saltar a página */}
      <form onSubmit={handleGoToPage} className="flex items-center gap-2">
        <span className="text-sm">Ir a página</span>
        <Input
          name="page"
          type="number"
          min="1"
          max={totalPages}
          className="w-20"
        />
        <Button type="submit" className="bg-gray-200 text-black hover:bg-gray-300">
          Ir
        </Button>
      </form>
    </div>
  );
};

export default Pagination;
