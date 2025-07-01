import { motion } from 'framer-motion';

const sponsors = [
  {
    name: "Universidad Nacional de San Cristóbal de Huamanga",
    logo: "/sponsors/unsch.png"
  },
  {
    name: "Instituto Superior Tecnológico Público de Ayacucho",
    logo: "/sponsors/istp.png"
  },
  {
    name: "Gobierno Regional de Ayacucho",
    logo: "/sponsors/gra.png"
  },
  {
    name: "Municipalidad Provincial de Huamanga",
    logo: "/sponsors/mph.png"
  }
];

export default function SponsorsSection() {
  return (
    <section id="sponsors" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Nuestros Aliados</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trabajamos en conjunto con instituciones comprometidas con la educación y el desarrollo de nuestra región.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
          {sponsors.map((sponsor, index) => (
            <motion.div
              key={sponsor.name}
              className="p-6 flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="relative w-full aspect-[3/2] grayscale hover:grayscale-0 transition-all duration-300">
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-muted-foreground">
            ¿Interesado en ser parte de nuestra red de aliados?{' '}
            <a href="#contact" className="text-yellow-500 hover:underline">
              Contáctanos
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
} 