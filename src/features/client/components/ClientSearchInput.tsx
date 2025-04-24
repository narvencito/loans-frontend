import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface SimpleClient {
  id: string;
  name: string;
}

interface ClientSearchInputProps {
  clients: SimpleClient[];
  selectedClientId: string;
  onSelect: (clientId: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const ClientSearchInput = ({
  clients,
  selectedClientId,
  onSelect,
  placeholder = "Buscar cliente por nombre",
  disabled = false,
}: ClientSearchInputProps) => {
  const [filterText, setFilterText] = useState('');
  const selectedClient = clients.find((c) => c.id === selectedClientId);
  const [filteredClients, setFilteredClients] = useState<SimpleClient[]>(clients);

  useEffect(() => {
    const filtered = clients.filter((c) =>
      c.name.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [filterText, clients]);

  return (
    <div className="relative">
      <input
        type="text"
        value={selectedClient ? selectedClient.name : filterText}
        onChange={(e) => {
          setFilterText(e.target.value);
          onSelect('');
        }}
        placeholder={placeholder}
        className={cn(
          "border border-primary px-3 py-2 w-full rounded pr-10 text-sm",
          disabled || selectedClient ? "bg-gray-100 text-gray-500" : "text-foreground"
        )}
        disabled={disabled || !!selectedClient}
      />

      {selectedClient && (
        <button
          type="button"
          onClick={() => {
            onSelect('');
            setFilterText('');
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive text-sm"
        >
          ✕
        </button>
      )}

      {filterText && !selectedClient && (
        <ul className="mt-1 max-h-40 overflow-auto border border-border rounded shadow text-sm z-50 absolute w-full bg-white">
          {filteredClients.map((client) => (
            <li
              key={client.id}
              onClick={() => {
                onSelect(client.id);
                setFilterText('');
              }}
              className="px-3 py-2 cursor-pointer hover:bg-primary/10 text-foreground"
            >
              {client.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClientSearchInput;
