import { motion } from 'framer-motion';

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Quiénes somos?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            StudyCash es una startup fintech que brinda soluciones de financiamiento y alquiler de equipos tecnológicos 
            a estudiantes de educación superior en regiones con baja inclusión financiera como Ayacucho.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-yellow-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">Misión</h3>
              <p className="text-muted-foreground leading-relaxed">
                Brindar acceso inclusivo y asequible a herramientas tecnológicas mediante soluciones de financiamiento 
                adaptadas a estudiantes de educación superior, impulsando su desarrollo académico, personal y profesional.
              </p>
            </div>

            <div className="bg-blue-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">Visión</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ser la startup líder en la región en reducir la brecha digital de la educación superior, facilitando 
                el acceso a equipos tecnológicos esenciales para una educación equitativa, moderna y de calidad.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="bg-gray-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">Nuestro Compromiso</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Creemos que el acceso a una laptop no debe ser un privilegio, sino un derecho para estudiar, 
                avanzar y construir un mejor futuro.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Por eso, combinamos tecnología, inclusión financiera y educación para cerrar la brecha digital, 
                sin necesidad de historial crediticio, trámites bancarios ni grandes ingresos.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <h4 className="font-bold text-yellow-500 text-4xl mb-2">500+</h4>
                <p className="text-sm text-muted-foreground">Estudiantes beneficiados</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <h4 className="font-bold text-yellow-500 text-4xl mb-2">95%</h4>
                <p className="text-sm text-muted-foreground">Tasa de aprobación</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <h4 className="font-bold text-yellow-500 text-4xl mb-2">24h</h4>
                <p className="text-sm text-muted-foreground">Tiempo de respuesta</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 