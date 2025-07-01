import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Columna 1: Información de la empresa */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-6">StudyCash</h3>
            <p className="text-sm leading-relaxed">
              Brindamos soluciones financieras innovadoras para estudiantes, facilitando el acceso a equipos tecnológicos 
              y promoviendo la educación de calidad.
            </p>
            <div className="flex space-x-4 pt-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <a href="#about" className="hover:text-white transition-colors">Quiénes Somos</a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">Servicios</a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-white transition-colors">Testimonios</a>
              </li>
              <li>
                <a href="#sponsors" className="hover:text-white transition-colors">Aliados</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">Contacto</a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Servicios */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Servicios</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-white transition-colors">Financiamiento de Equipos</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Alquiler de Equipos</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Soporte Técnico</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Asesoría Financiera</a>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <MapPin size={18} />
                <span>Jr. 28 de Julio 232, Ayacucho</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} />
                <span>+51 966 123 456</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} />
                <span>contacto@studycash.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              © {new Date().getFullYear()} StudyCash. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-sm hover:text-white transition-colors">
                Términos y Condiciones
              </a>
              <a href="#" className="text-sm hover:text-white transition-colors">
                Política de Privacidad
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 