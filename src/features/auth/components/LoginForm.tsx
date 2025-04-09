import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '../services/authService';
import { useAuthStore } from '../store/auth.store';
import { useNavigate } from 'react-router-dom';


const loginSchema = z.object({
  email: z.string().min(3, { message: 'Usuario requerido' }).email('email incorrecto'),
  password: z.string().min(6, { message: 'Mínimo 6 caracteres' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const setAuth = useAuthStore((state) => state.setAuth);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data); // llama al API
      setAuth({
        token: response.token,
        user: response.user,
      });
      onClose();

      // Redirigir según el rol
      const role = response.user.role.name.toUpperCase();
      if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (role === 'CLIENT') {
        navigate('/client/home');
      } else {
        navigate('/');
      }

    } catch (error: any) {
      console.error('Login failed:', error);
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm">Usuario</label>
        <input
          {...register('email')}
          type="text"
          placeholder="Tu usuario"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm">Contraseña</label>
        <input
          {...register('password')}
          type="password"
          placeholder="Tu contraseña"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        {isSubmitting ? 'Ingresando...' : 'Entrar'}
      </button>
    </form>
  );
}
