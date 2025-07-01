import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "María García",
    role: "Estudiante de Ingeniería",
    university: "Universidad Nacional de San Cristóbal de Huamanga",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    content: "Gracias a StudyCash pude conseguir mi primera laptop para la universidad. El proceso fue muy sencillo y las cuotas se ajustan a mi presupuesto.",
    rating: 5
  },
  {
    name: "Carlos Mendoza",
    role: "Estudiante de Arquitectura",
    university: "Universidad Nacional de San Cristóbal de Huamanga",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    content: "El servicio de alquiler me ayudó mucho durante mi proyecto final. El equipo estaba en excelentes condiciones y el soporte fue muy bueno.",
    rating: 5
  },
  {
    name: "Ana Huamán",
    role: "Estudiante de Diseño Gráfico",
    university: "Instituto Superior Tecnológico Público de Ayacucho",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    content: "StudyCash me dio la oportunidad de tener una laptop de alta gama que necesitaba para mis cursos de diseño. ¡Muy agradecida!",
    rating: 5
  }
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Lo que dicen nuestros estudiantes</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conoce las experiencias de estudiantes que ya han confiado en nosotros para obtener sus equipos.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="bg-white p-6 rounded-2xl shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.university}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-muted-foreground">{testimonial.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 