import { motion } from 'framer-motion';
import SimulatorCard from '../../simulator/components/SimulatorCard';

export default function HeroSection() {
  return (
    <section className="w-full bg-[hsl(var(--background))] text-[hsl(var(--foreground))] py-20 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Texto */}
        <motion.div
          className="md:w-1/2 text-center md:text-left space-y-6"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-primary">
            Préstamos para estudiantes universitarios
          </h1>

          <p className="text-lg text-muted-foreground max-w-lg">
            Financiamiento de equipos, dinero o dispositivos para impulsar tu desarrollo académico.
          </p>

          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            <li>Precalifica sin compromiso</li>
            <li>Plataforma 100% segura</li>
            <li>Tasas preferenciales para estudiantes</li>
          </ul>
        </motion.div>

        {/* Simulador */}
        <motion.div
          className="md:w-1/2 w-full"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <SimulatorCard />
        </motion.div>
      </div>
    </section>
  );
}
