import { motion } from 'framer-motion';

export default function ContactSection({ delay = 0 }: { delay?: number }) {
  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="bg-white shadow-md rounded-xl p-6 border border-muted"
    >
      <h2 className="text-2xl font-semibold text-primary mb-4">Contáctanos</h2>
      <p className="text-gray-700 mb-4">
        ¿Tienes preguntas o necesitas más información? No dudes en comunicarte con nosotros.
      </p>
      <a href="mailto:contacto@mvp.com" className="text-secondary font-medium">
        contacto@mvp.com
      </a>
    </motion.section>
  );
}
