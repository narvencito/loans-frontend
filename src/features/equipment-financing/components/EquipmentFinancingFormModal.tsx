import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AsyncClientCombobox from "@/features/client/components/AsyncClientCombobox";
import AsyncEquipmentCombobox from "@/features/equipment/components/AsyncEquipmentCombobox";
import { CreateEquipmentFinancingDto } from "@/features/equipment-financing/api/equipment-financing-api";
import { GrayButton, GreenButton } from "@/components/common/ColorButtons";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEquipmentFinancingDto) => void;
  defaultValues?: CreateEquipmentFinancingDto | null;
}

const EquipmentFinancingFormModal = ({ open, onClose, onSubmit, defaultValues }: Props) => {
  const [form, setForm] = useState<CreateEquipmentFinancingDto>({
    clientId: "",
    equipmentId: "",
    totalAmount: 0,
    downPayment: 0,
  });

  useEffect(() => {
    if (defaultValues) {
      setForm(defaultValues);
    } else {
      setForm({ clientId: "", equipmentId: "", totalAmount: 0, downPayment: 0 });
    }
  }, [defaultValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "totalAmount" || name === "downPayment" ? parseFloat(value) : value }));
  };

  const handleSubmit = () => {
    if (!form.clientId || !form.equipmentId) return;
    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle>Registrar Financiamiento</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <AsyncClientCombobox
            selectedClientId={form.clientId}
            onSelect={(id) => setForm((prev) => ({ ...prev, clientId: id || "" }))}
          />

          <AsyncEquipmentCombobox
            selectedEquipmentId={form.equipmentId}
            onSelect={(id) => setForm((prev) => ({ ...prev, equipmentId: id || "" }))}
          />

          <div>
            <Label htmlFor="totalAmount">Precio Total</Label>
            <Input
              name="totalAmount"
              type="number"
              value={form.totalAmount}
              onChange={handleChange}
              min={0}
              step={0.01}
            />
          </div>

          <div>
            <Label htmlFor="downPayment">Cuota Inicial</Label>
            <Input
              name="downPayment"
              type="number"
              value={form.downPayment}
              onChange={handleChange}
              min={0}
              step={0.01}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <GrayButton onClick={onClose}>
            Cancelar
          </GrayButton>
          <GreenButton onClick={handleSubmit}>
            Guardar
          </GreenButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EquipmentFinancingFormModal;
