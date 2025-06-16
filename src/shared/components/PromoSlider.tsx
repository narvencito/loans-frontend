import Slider from 'react-slick';
import { ChevronLeft, ChevronRight, ChevronsLeftRight } from 'lucide-react';
import { CustomArrowProps } from 'react-slick';

const slides = [
  {
    title: 'LIQUIDACIÓN',
    subtitle: 'Tu laptop o tablet',
    cuotas: 'desde 24 cuotas de',
    monto: 's/ 49',
    imagen: '/images/laptop-2.png',
  },
  {
    title: 'LIQUIDACIÓN',
    subtitle: 'Tu laptop o tablet',
    cuotas: 'desde 24 cuotas de',
    monto: 's/ 50',
    imagen: '/images/laptop-2.png',
  },
  {
    title: 'LIQUIDACIÓN',
    subtitle: 'Tu laptop o tablet',
    cuotas: 'desde 24 cuotas de',
    monto: 's/ 51',
    imagen: '/images/laptop-2.png',
  },
];

export default function PromoSlider() {
  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="w-full bg-background text-foreground">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index}>
            {/* Contenedor relativo para flechas */}
            <div className="relative w-full h-full">
              {/* Contenido centralizado */}
              <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-10 min-h-[400px]">
                {/* Texto */}
                <div className="w-full md:w-1/2 text-center md:text-left">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded inline-block mb-2">
                    {slide.title}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">{slide.subtitle}</h2>
                  <p className="text-base mb-1">{slide.cuotas}</p>
                  <p className="text-5xl font-extrabold text-primary mb-4">{slide.monto}</p>
                  <button className="bg-primary text-primary-foreground px-5 py-2 rounded font-semibold hover:opacity-90 transition">
                    Financia aquí
                  </button>
                </div>

                {/* Imagen */}
                <div className="w-full md:w-1/2 flex justify-center">
                  <img
                    src={slide.imagen}
                    alt={slide.title}
                    className="w-full max-w-md h-auto object-contain drop-shadow"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}


export const NextArrow = ({ onClick }: CustomArrowProps) => (
  <button
    className="absolute z-10 right-4 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-full shadow hover:scale-105 transition"
    onClick={onClick}
    aria-label="Siguiente"
  >
    <ChevronRight />
  </button>
);

export const PrevArrow = ({ onClick }: CustomArrowProps) => (
  <button
    className="absolute z-10 left-4 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-full shadow hover:scale-105 transition"
    onClick={onClick}
    aria-label="Anterior"
  >
    <ChevronLeft />
  </button>
);
