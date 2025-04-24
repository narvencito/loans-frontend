import { motion } from 'framer-motion';

export default function ContactSection({ delay = 0 }: { delay?: number }) {
  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="bg-card text-card-foreground shadow-lg rounded-xl p-6 border border-muted"
    >
      <h2 className="text-2xl font-bold text-primary mb-4">Contáctanos</h2>

      <p className="text-muted-foreground mb-4 max-w-md">
        ¿Tienes preguntas o necesitas más información? No dudes en comunicarte con nosotros.
      </p>

      <a
        href="mailto:contacto@mvp.com"
        className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:opacity-90 transition-colors"
      >
        contacto@mvp.com
      </a>
    </motion.section>
  );
}
