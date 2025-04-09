import { motion } from 'framer-motion';
import SimulatorCard from '../../simulator/components/SimulatorCard';

export default function HeroSection() {
    return (
      <section className="w-full bg-gradient-to-r from-emerald-500 to-emerald-400 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Texto */}
          <div className="md:w-1/2 text-center md:text-left space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Préstamos para estudiantes universitarios
            </h1>
            <p className="text-lg text-white/90">
              Financiamiento de equipos, dinero o dispositivos para impulsar tu desarrollo académico.
            </p>
            <ul className="list-disc pl-5 text-sm text-white">
              <li>Precalifica sin compromiso</li>
              <li>Plataforma 100% segura</li>
              <li>Tasas preferenciales para estudiantes</li>
            </ul>
          </div>
  
          {/* Simulador */}
          <div className="md:w-1/2">
            <SimulatorCard />
          </div>
        </div>
      </section>
    );
  }