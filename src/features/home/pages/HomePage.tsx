import HeroSection from '../components/HeroSection';
import SectionBlock from '../components/SectionBlock';
import ContactSection from '../components/ContactSection';
import LoanOptionsSection from '../components/LoanOptionsSection';
import { Separator } from '@/components/ui/separator';

const sections = [
  {
    id: 'services',
    title: 'Nuestros Servicios',
    content: [
      {
        title: 'Préstamos Personales',
        description:
          'Ofrecemos préstamos diseñados específicamente para estudiantes universitarios, con requisitos mínimos y desembolso rápido.',
      },
      {
        title: 'Préstamo de Equipos',
        description:
          'Accede a laptops, proyectores y más, sin costo adicional para tus proyectos y clases.',
      },
      {
        title: 'Financiamiento de Equipos',
        description:
          'Lleva el equipo contigo y págalo en cuotas flexibles, ideal para tu crecimiento académico.',
      },
    ],
  },
  {
    id: 'benefits',
    title: '¿Por qué elegirnos?',
    content: [
      {
        title: 'Rapidez',
        description: 'Procesamos tu solicitud en menos de 48 horas.',
      },
      {
        title: 'Tasas Competitivas',
        description: 'Ofrecemos tasas de interés accesibles y adaptadas a tus necesidades.',
      },
      {
        title: 'Flexibilidad',
        description: 'Planes de pago que se ajustan a tu situación financiera.',
      },
    ],
  },
  {
    id: 'testimonials',
    title: 'Testimonios',
    content: [
      {
        title: 'Juan Pérez',
        description:
          'Gracias a este servicio, pude adquirir una laptop para mis estudios sin complicaciones.',
      },
      {
        title: 'María Gómez',
        description: 'El proceso fue rápido y sencillo. Recomiendo ampliamente sus servicios.',
      },
    ],
  },
  {
    id: 'process',
    title: '¿Cómo funciona?',
    content: [
      {
        step: '1',
        title: 'Contacto',
        description: 'Completa nuestro formulario en línea y nos pondremos en contacto contigo para validar tus datos.',
      },
      {
        step: '2',
        title: 'Documentación',
        description: 'Reúne y envía la documentación necesaria para evaluar tu solicitud.',
      },
      {
        step: '3',
        title: 'Desembolso',
        description: 'Una vez aprobada tu solicitud, recibirás el préstamo en tu cuenta bancaria.',
      },
    ],
  },
];

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section className="text-foreground py-16">
        <div className="max-w-5xl mx-auto px-4 space-y-16">
          <LoanOptionsSection />

          <Separator className="my-6 bg-primary h-[2px]" />

          {sections.map((section, index) => (
            <SectionBlock
              key={section.id}
              id={section.id}
              title={section.title}
              content={section.content}
              index={index}
            />
          ))}

          <Separator className="my-6 bg-primary h-[2px]" />

          <ContactSection delay={sections.length * 0.2} />
        </div>
      </section>
    </>
  );
}
