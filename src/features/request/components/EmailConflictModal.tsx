import { useState } from 'react';

interface Props {
  email: string;
  onClose: () => void;
  onOpenLogin: () => void;
}

export const EmailConflictModal = ({ email, onClose, onOpenLogin }: Props) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">Ya tienes una cuenta</h2>
        <p className="mb-4">El correo <strong>{email}</strong> ya está registrado.</p>
        <div className="flex flex-col gap-2">
          <button
            onClick={onOpenLogin}
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => window.location.href = `/recover-password?email=${email}`}
            className="text-blue-600 hover:underline"
          >
            Recuperar contraseña
          </button>
          <button
            onClick={onClose}
            className="text-gray-500 text-sm mt-2 hover:underline"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};