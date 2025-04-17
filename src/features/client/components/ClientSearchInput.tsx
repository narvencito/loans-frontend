import { useEffect, useState } from "react";
import { ClientItem } from "../api/client_api";

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
  
  const ClientSearchInput = ({ clients, selectedClientId, onSelect }: ClientSearchInputProps) => {
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
          placeholder="Buscar cliente por nombre"
          className="border px-3 py-2 w-full rounded mt-1 pr-8"
          disabled={!!selectedClient}
        />
        {selectedClient && (
          <button
            onClick={() => {
              onSelect('');
              setFilterText('');
            }}
            className="absolute right-2 top-[10px] text-gray-500 hover:text-red-500 text-sm"
          >
            ✕
          </button>
        )}
        {filterText && !selectedClient && (
          <ul className="mt-1 max-h-40 overflow-auto border rounded bg-white shadow text-sm z-10 absolute w-full">
            {filteredClients.map((client) => (
              <li
                key={client.id}
                onClick={() => {
                  onSelect(client.id);
                  setFilterText('');
                }}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
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
  