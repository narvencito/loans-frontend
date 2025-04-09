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
    <section className="py-16 bg-white text-center">
      <h2 className="text-2xl font-bold text-primary mb-8">¿Qué tipo de préstamo necesitas?</h2>

      {/* Desktop layout */}
      <div className="hidden md:grid grid-cols-3 gap-6 px-4 max-w-6xl mx-auto">
        {loans.map((loan, index) => (
          <div
            key={index}
            className="border border-primary rounded-lg overflow-hidden shadow-sm transition-transform hover:scale-105"
          >
            <div className="bg-green-50 p-4">
              <img src={loan.image} alt={loan.title} className="mx-auto mb-2 h-32 object-contain" />
              <h3 className="text-lg font-bold text-green-700">{loan.title}</h3>
            </div>
            <div className="p-4 text-gray-700">
              <p>{loan.description}</p>
              <a href="#" className="block mt-4 text-blue-600 font-medium hover:underline">
                Lo quiero
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile carousel */}
      <div className="md:hidden px-4">
        <div className="relative">
          <div className="border border-primary rounded-lg overflow-hidden shadow">
            <div className="bg-green-50 p-4">
              <img
                src={loans[activeIndex].image}
                alt={loans[activeIndex].title}
                className="mx-auto mb-2 h-32 object-contain"
              />
              <h3 className="text-lg font-bold text-green-700">{loans[activeIndex].title}</h3>
            </div>
            <div className="p-4 text-gray-700">
              <p>{loans[activeIndex].description}</p>
              <a href="#" className="block mt-4 text-blue-600 font-medium hover:underline">
                Lo quiero
              </a>
            </div>
          </div>

          <div className="flex justify-between absolute top-1/2 w-full px-2 -translate-y-1/2">
            <button onClick={handlePrev} className="p-2 text-primary bg-white rounded-full shadow">
              <FaChevronLeft />
            </button>
            <button onClick={handleNext} className="p-2 text-primary bg-white rounded-full shadow">
              <FaChevronRight />
            </button>
          </div>
        </div>

        <div className="flex justify-center mt-4 space-x-2">
          {loans.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${index === activeIndex ? 'bg-primary' : 'bg-gray-300'}`}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
}
