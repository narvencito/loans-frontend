import LoginForm from './LoginForm';

export default function LoginPopover({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm border relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold text-center mb-4">Iniciar sesión</h2>
        <LoginForm onClose={onClose} />
      </div>
    </div>
  );
}
