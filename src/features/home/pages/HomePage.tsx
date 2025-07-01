import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import TestimonialsSection from '../components/TestimonialsSection';
import SponsorsSection from '../components/SponsorsSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <section id="inicio">
        <HeroSection />
      </section>
      
      <motion.section id="nosotros" {...fadeInUp}>
        <AboutSection />
      </motion.section>

      <motion.section 
        id="testimonios"
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <TestimonialsSection />
      </motion.section>

      <motion.section 
        id="aliados"
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <SponsorsSection />
      </motion.section>

      <motion.section 
        id="contacto"
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <ContactSection />
      </motion.section>

      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <Footer />
      </motion.footer>
    </div>
  );
}
