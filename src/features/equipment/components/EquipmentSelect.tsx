import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown } from "lucide-react";

export interface SimpleEquipment {
  id: string;
  name: string;
  code?: string;
}

interface EquipmentSelectProps {
  equipments: SimpleEquipment[];
  selectedEquipmentId?: string | null;
  onSelect: (equipmentId: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

const EquipmentSelect = ({
  equipments,
  selectedEquipmentId,
  onSelect,
  placeholder = "Buscar equipo por nombre o código",
  label = "Equipo",
  disabled = false,
}: EquipmentSelectProps) => {
  const [open, setOpen] = useState(false);
  const selectedEquipment = equipments.find((e) => e.id === selectedEquipmentId);

  return (
    <div className="w-full flex flex-col gap-1">
      {label && <Label className="text-sm">{label}</Label>}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white"
          >
            {selectedEquipment
              ? `${selectedEquipment.name}${selectedEquipment.code ? ` (${selectedEquipment.code})` : ""}`
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandEmpty>No se encontraron equipos</CommandEmpty>
            <CommandGroup>
              {equipments.map((equipment) => (
                <CommandItem
                  key={equipment.id}
                  value={`${equipment.name} ${equipment.code ?? ""}`}
                  onSelect={() => {
                    onSelect(equipment.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      equipment.id === selectedEquipmentId ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {equipment.name}
                  {equipment.code && <span className="ml-1 text-muted-foreground text-xs">({equipment.code})</span>}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default EquipmentSelect;
