import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EquipmentUsageType } from '@/features/equipment/model/equipment.types';

export default function HeroSection() {
  const navigate = useNavigate();

  const handleNavigateToEquipments = (usageType: EquipmentUsageType) => {
    navigate(`/equipment?usageType=${usageType}`);
  };

  return (
    <section className="w-full bg-background text-foreground py-32 px-4 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-yellow-500/10 via-background to-background z-0" />
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
        {/* Texto */}
        <motion.div
          className="md:w-1/2 text-center md:text-left space-y-8"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-300">
            Tu futuro no puede esperar
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Con StudyCash, alquila o financia tu equipo sin bancos, sin historial, sin excusas. 
            <span className="font-semibold block mt-2">Tu carrera no se detiene por falta de equipo.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button 
              size="lg" 
              className="bg-yellow-500 hover:bg-yellow-600"
              onClick={() => handleNavigateToEquipments(EquipmentUsageType.FINANCING)}
            >
              Financiar equipo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2"
              onClick={() => handleNavigateToEquipments(EquipmentUsageType.RENTAL)}
            >
              Alquilar equipo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-yellow-500">100%</h3>
              <p className="text-sm text-muted-foreground">Sin bancos</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-yellow-500">24h</h3>
              <p className="text-sm text-muted-foreground">Aprobación rápida</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-yellow-500">0</h3>
              <p className="text-sm text-muted-foreground">Historial requerido</p>
            </div>
          </div>
        </motion.div>

        {/* Imagen */}
        <motion.div
          className="md:w-1/2 relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="relative w-full aspect-[4/3] max-w-lg mx-auto">
            <img
              src="/images/laptop.png"
              alt="Estudiante con laptop"
              className="w-full h-full object-contain mix-blend-luminosity opacity-90"
            />
            {/* Efecto de brillo detrás de la laptop */}
            <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent blur-2xl -z-10" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
