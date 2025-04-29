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
import { clientApi, ClientItem } from "@/features/client/api/client_api";
import { Check, ChevronsUpDown } from "lucide-react";

interface AsyncClientComboboxProps {
  selectedClientId?: string | null;
  onSelect: (clientId: string | null) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

const AsyncClientCombobox = ({
  selectedClientId,
  onSelect,
  placeholder = "Buscar cliente...",
  label = "Cliente",
  disabled = false,
}: AsyncClientComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientItem | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cargar cliente si hay seleccionado
  useEffect(() => {
    if (!selectedClientId) {
      setSelectedClient(null);
      return;
    }
    clientApi.getClientById(selectedClientId).then((c) => {
      if (c) setSelectedClient(c);
    });
  }, [selectedClientId]);

  // Buscar clientes cuando se escribe
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search.trim().length > 0) {
        clientApi.searchClientsByNameDocument(search).then(setClients);
      } else {
        setClients([]);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  // Cerrar si hace click fuera
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

  const handleSelect = (client: ClientItem) => {
    onSelect(client.id);
    setSelectedClient(client);
    setSearch("");
    setOpen(false);
  };

  const clearSelection = () => {
    onSelect(null);
    setSelectedClient(null);
    setSearch("");
  };

  const toggleOpen = () => {
    setOpen((prev) => !prev);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100); // pequeño delay para asegurar render
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
        {selectedClient ? selectedClient.name : placeholder}
      </Button>

      {selectedClient && (
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
            <CommandEmpty>No se encontraron clientes</CommandEmpty>
            <CommandGroup>
              {clients.map((client) => (
                <CommandItem
                  key={client.id}
                  value={client.name}
                  onSelect={() => handleSelect(client)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      client.id === selectedClientId
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <span className="flex flex-col">
                    <span>{client.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {client.document}
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

export default AsyncClientCombobox;
