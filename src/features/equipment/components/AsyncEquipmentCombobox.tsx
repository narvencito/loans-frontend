import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { equipmentApi, EquipmentItem } from "@/features/equipment/api/equipment_api";

interface AsyncEquipmentComboboxProps {
  selectedEquipmentId?: string | null;
  onSelect: (equipmentId: string | null) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

const AsyncEquipmentCombobox = ({
  selectedEquipmentId,
  onSelect,
  placeholder = "Buscar equipo...",
  label = "Equipo",
  disabled = false,
}: AsyncEquipmentComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [equipments, setEquipments] = useState<EquipmentItem[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentItem | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selectedEquipmentId) {
      setSelectedEquipment(null);
      return;
    }
    equipmentApi.getById(selectedEquipmentId).then((eq) => {
      if (eq) setSelectedEquipment(eq);
    });
  }, [selectedEquipmentId]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search.trim().length > 0) {
        equipmentApi.searchByNameOrCode(search).then(setEquipments);
      } else {
        setEquipments([]);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (eq: EquipmentItem) => {
    onSelect(eq.id);
    setSelectedEquipment(eq);
    setSearch("");
    setOpen(false);
  };

  const clearSelection = () => {
    onSelect(null);
    setSelectedEquipment(null);
    setSearch("");
  };

  const toggleOpen = () => {
    setOpen((prev) => !prev);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  return (
    <div className="w-full flex flex-col gap-1 relative" ref={containerRef}>
      {label && <Label className="text-sm">{label}</Label>}

      <Button
        type="button"
        variant="outline"
        onClick={toggleOpen}
        disabled={disabled}
        className="w-full justify-between bg-white pr-8"
      >
        {selectedEquipment ? selectedEquipment.name : placeholder}
      </Button>

      {selectedEquipment && (
        <button
          type="button"
          onClick={clearSelection}
          className="absolute right-2 top-9 text-muted-foreground hover:text-destructive text-xs z-10"
        >
          ✕
        </button>
      )}

      {open && (
        <div className="absolute top-16 w-full z-50 bg-white border rounded shadow-lg p-2">
          <Command shouldFilter={false}>
            <CommandInput
              ref={inputRef}
              placeholder={placeholder}
              value={search}
              onValueChange={setSearch}
              className="h-9"
            />
            <CommandEmpty>No se encontraron equipos</CommandEmpty>
            <CommandGroup>
              {equipments.map((eq) => (
                <CommandItem
                  key={eq.id}
                  value={eq.name}
                  onSelect={() => handleSelect(eq)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      eq.id === selectedEquipmentId
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <span className="flex flex-col">
                    <span>{eq.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {eq.code}
                    </span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </div>
      )}
    </div>
  );
};

export default AsyncEquipmentCombobox;
