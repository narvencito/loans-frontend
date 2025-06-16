import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const loans = [
  {
    title: 'Capital de trabajo',
    description: 'Capital de trabajo rápido y seguro para impulsar tus proyectos.',
    image: 'https://d14bodb4yrsx8y.cloudfront.net/assets/img/prestamo_1.9a6a6bf.png',
  },
  {
    title: 'Construcción',
    description: 'Culmina el proyecto de tu casa soñada de manera fácil.',
    image: 'https://d14bodb4yrsx8y.cloudfront.net/assets/img/prestamo_1.9a6a6bf.png',
  },
  {
    title: 'Consolidar deudas',
    description: 'Unifica y controla tus deudas de manera rápida y segura.',
    image: 'https://d14bodb4yrsx8y.cloudfront.net/assets/img/prestamo_1.9a6a6bf.png',
  },
];

export default function LoanOptionsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? loans.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === loans.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-20 px-4 text-[hsl(var(--foreground))]">
      <h2 className="text-2xl font-bold text-primary text-center mb-10">
        ¿Qué tipo de préstamo necesitas?
      </h2>

      {/* Desktop */}
      <div className="hidden md:grid grid-cols-3 gap-6 max-w-6xl mx-auto">
        {loans.map((loan, index) => (
          <div
            key={index}
            className="bg-card border border-primary rounded-xl shadow hover:scale-[1.02] transition-transform"
          >
            <div className="p-4 flex flex-col items-center">
              <img src={loan.image} alt={loan.title} className="h-32 object-contain mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-2">{loan.title}</h3>
              <p className="text-muted-foreground text-sm">{loan.description}</p>
              <a
                href="#"
                className="mt-4 text-primary font-medium hover:underline transition-colors"
              >
                Lo quiero
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile */}
      <div className="md:hidden max-w-md mx-auto relative">
        <div className="bg-card border border-primary rounded-xl shadow">
          <div className="p-4 flex flex-col items-center">
            <img
              src={loans[activeIndex].image}
              alt={loans[activeIndex].title}
              className="h-32 object-contain mb-2"
            />
            <h3 className="text-lg font-semibold text-primary mb-1">
              {loans[activeIndex].title}
            </h3>
            <p className="text-muted-foreground text-sm">{loans[activeIndex].description}</p>
            <a
              href="#"
              className="mt-4 text-primary font-medium hover:underline transition-colors"
            >
              Lo quiero
            </a>
          </div>
        </div>

        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 flex justify-between px-4 z-10">
          <button
            onClick={handlePrev}
            className="p-3 bg-background border border-muted rounded-full shadow text-white"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={handleNext}
            className="p-3 bg-background border border-muted rounded-full shadow text-white"
          >
            <FaChevronRight />
          </button>
        </div>

        <div className="flex justify-center mt-4 space-x-2">
          {loans.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full ${i === activeIndex ? 'bg-primary' : 'bg-muted'
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
