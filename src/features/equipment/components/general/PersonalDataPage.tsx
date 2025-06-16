// src/pages/PersonalDataPage.tsx
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export default function PersonalDataPage() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    console.log(data);
    navigate('/academic-info'); // siguiente paso
  };

  return (
    <div className="flex h-screen pt-10">
      {/* Paso lateral */}
      <aside className="w-1/4 bg-background text-white p-6">
        <h2 className="text-2xl font-bold mb-4">Solicita tu <span className="text-cyan-300">Financiamiento</span></h2>
        <ol className="space-y-4">
          <li className="font-bold text-primary">✓ Selección de equipo</li>
          <li className="text-cyan-200">2. Datos personales</li>
          <li>3. Información académica</li>
          <li>4. Forma de pago</li>
          <li>5. Confirmar solicitud</li>
          <li>6. Finalizar solicitud</li>
        </ol>
      </aside>

      {/* Formulario */}
      <main className="w-2/4 p-10 bg-gray-50">
        <h3 className="text-xl font-semibold mb-6">Cuéntanos acerca de ti</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex space-x-4">
            <select {...register("documentType")} className="w-1/3 p-2 border rounded">
              <option value="dni">DNI</option>
              <option value="ce">Carnet de Extranjería</option>
            </select>
            <input {...register("documentNumber")} type="text" placeholder="Ingresa tu número de documento" className="flex-1 p-2 border rounded" />
          </div>

          <input {...register("cellphone")} type="text" placeholder="Ingresa tu número de celular" className="w-full p-2 border rounded" />
          <a href="#" className="text-sm text-blue-500 underline">¿Tienes otro número para whatsapp?</a>

          <input {...register("email")} type="email" placeholder="Ingresa tu correo electrónico" className="w-full p-2 border rounded" />
          <input {...register("address")} type="text" placeholder="Ingresa tu dirección completa" className="w-full p-2 border rounded" />
          <button type="button" className="text-sm text-blue-500 underline">Usar mi ubicación actual</button>

          <div className="flex space-x-4">
            <select {...register("department")} className="w-1/3 p-2 border rounded">
              <option>Departamento</option>
            </select>
            <select {...register("province")} className="w-1/3 p-2 border rounded">
              <option>Provincia</option>
            </select>
            <select {...register("district")} className="w-1/3 p-2 border rounded">
              <option>Distrito</option>
            </select>
          </div>

          <select {...register("housingType")} className="w-full p-2 border rounded">
            <option>Selecciona tipo de vivienda</option>
          </select>

          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("terms")} />
            <span>Estoy de acuerdo con los <a href="#" className="underline text-cyan-600">Términos y condiciones</a> y las <a href="#" className="underline text-cyan-600">Políticas de privacidad</a>.</span>
          </label>

          <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded">
            Continuar
          </button>
        </form>
      </main>

      {/* Info derecha */}
      <aside className="w-1/4 p-6 flex items-center">
        <div className="bg-white rounded-xl shadow-md p-4">
          <h4 className="font-bold text-gray-700 mb-2">Recuerda que es importante digitar tu <span className="text-blue-600">número de DNI</span> correctamente</h4>
          <p className="text-sm text-gray-600">Revisa 2 veces que tus datos estén en orden.</p>
        </div>
      </aside>
    </div>
  );
}
