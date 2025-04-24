import { apiRequest } from "@/shared/utils/apiHelper";
import { api } from "@/shared/utils/api";

export const cashInstallmentApi = {
  async payInstallment(installmentId: string) {
    return apiRequest(api.patch(`/cash-installments/${installmentId}/pay`), {
      loading: "Procesando pago...",
      success: "Cuota pagada correctamente",
      error: "No se pudo realizar el pago",
    });
  },
};
