import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown } from "lucide-react";

export interface SimpleClient {
  id: string;
  name: string;
}

interface ClientSearchInputProps {
  clients: SimpleClient[];
  selectedClientId?: string | null;
  onSelect: (clientId: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

const ClientSearchInput = ({
  clients,
  selectedClientId,
  onSelect,
  placeholder = "Buscar cliente por nombre",
  label = "Cliente",
  disabled = false,
}: ClientSearchInputProps) => {
  const [open, setOpen] = useState(false);
  const selectedClient = clients.find((c) => c.id === selectedClientId);

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
            {selectedClient ? selectedClient.name : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandEmpty>No se encontraron clientes</CommandEmpty>
            <CommandGroup>
              {clients.map((client) => (
                <CommandItem
                  key={client.id}
                  value={client.name}
                  onSelect={() => {
                    onSelect(client.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      client.id === selectedClientId ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {client.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ClientSearchInput;
