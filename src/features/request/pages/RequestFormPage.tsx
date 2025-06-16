import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EmailConflictModal } from '../components/EmailConflictModal';
import LoginPage from '@/features/auth/pages/LoginPage';
import { useCheckEmail } from '../hooks/useCheckEmail';

export default function RequestFormPage() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type'); // cash | equipment-loan | equipment-financing
  const equipmentId = searchParams.get('equipmentId');

  const [form, setForm] = useState({
    name: '',
    document: '',
    email: '',
    phone: '',
    address: '',
  });

  const [showConflictModal, setShowConflictModal] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);
  const checkEmail = useCheckEmail();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();

    const exists = await checkEmail(form.email);
    if (exists) {
      setShowConflictModal(true);
    } else {
      // Continuar con la solicitud y creación de usuario/cliente
      console.log('Enviar solicitud:', { ...form, type, equipmentId });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleContinue}
        className="bg-white p-6 rounded shadow-md w-full max-w-lg"
      >
        <h1 className="text-2xl font-bold mb-4">
          Solicitud de {type === 'cash' ? 'préstamo monetario' : 'equipo'}
        </h1>

        <input
          name="name"
          placeholder="Nombre completo"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-3"
          required
        />

        <input
          name="document"
          placeholder="DNI o RUC"
          value={form.document}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-3"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-3"
          required
        />

        <input
          name="phone"
          placeholder="Teléfono"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-3"
        />

        <input
          name="address"
          placeholder="Dirección"
          value={form.address}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-4"
        />

        <button className="bg-green-600 text-white py-3 w-full rounded hover:bg-green-700">
          Continuar
        </button>
      </form>

      {showConflictModal && (
        <EmailConflictModal
          email={form.email}
          onClose={() => setShowConflictModal(false)}
          onOpenLogin={() => {
            setShowConflictModal(false);
            setLoginVisible(true);
          }}
        />
      )}

      {loginVisible && <LoginPage />}
    </div>
  );
}
