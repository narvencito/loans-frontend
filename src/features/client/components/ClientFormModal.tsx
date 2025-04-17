import React, { useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; document: string; email: string; phone: string; address: string }) => void;
}

const ClientFormModal = ({ open, onClose, onCreate }: Props) => {
  const [form, setForm] = useState({
    name: '',
    document: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Nuevo Cliente</h2>

        <div className="space-y-2">
          {['name', 'document', 'email', 'phone', 'address'].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field.toUpperCase()}
              value={form[field as keyof typeof form]}
              onChange={handleChange}
              className="border px-3 py-2 w-full rounded"
            />
          ))}
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancelar
          </button>
          <button onClick={() => onCreate(form)} className="px-4 py-2 bg-green-600 text-white rounded">
            Crear
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientFormModal;
