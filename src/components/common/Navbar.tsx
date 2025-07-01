import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { menuLinks } from '@/constants/menuLinks';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleNavigation = async (path: string) => {
    setIsOpen(false);
    
    // Si el path es '/' y no estamos en la página principal
    if (path === '/' && location.pathname !== '/') {
      navigate('/');
      return;
    }
    
    // Si el path es un anchor y no estamos en la página principal
    if (path.startsWith('#') && location.pathname !== '/') {
      // Primero navegamos a la página principal
      await navigate('/');
      // Esperamos un momento para que la página se cargue
      setTimeout(() => {
        const section = document.getElementById(path.substring(1));
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    // Si estamos en la página principal
    if (path === '/') {
      const section = document.getElementById('inicio');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (path.startsWith('#')) {
      const section = document.getElementById(path.substring(1));
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  useEffect(() => {
    // Solo activar el observer si estamos en la página principal
    if (location.pathname === '/') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        {
          threshold: 0.5,
        }
      );

      const sections = document.querySelectorAll('section[id]');
      sections.forEach((section) => observer.observe(section));

      return () => {
        sections.forEach((section) => observer.unobserve(section));
      };
    } else {
      // Si no estamos en la página principal, no hay sección activa
      setActiveSection('');
    }
  }, [location.pathname]);

  // Función para determinar si un enlace está activo
  const isLinkActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' && activeSection === 'inicio';
    }
    if (path.startsWith('#')) {
      return location.pathname === '/' && activeSection === path.substring(1);
    }
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <nav className="container mx-auto px-4 h-[60px] flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-yellow-500">
          StudyCash
        </Link>

        {/* Menú de escritorio */}
        <ul className="hidden md:flex items-center space-x-6">
          {menuLinks.map((link) => (
            <li key={link.path}>
              <button
                onClick={() => handleNavigation(link.path)}
                className={`text-sm font-medium transition-colors ${
                  isLinkActive(link.path)
                    ? 'text-yellow-500'
                    : 'text-muted-foreground hover:text-yellow-500'
                }`}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center space-x-4">
          {!isAuthenticated ? (
            <Button
              onClick={() => navigate('/login')}
              className="hidden md:flex bg-yellow-500 hover:bg-yellow-600"
            >
              Iniciar sesión
            </Button>
          ) : (
            <Button
              onClick={() => navigate('/client')}
              variant="outline"
              className="hidden md:flex"
            >
              Mi cuenta
            </Button>
          )}

          {/* Menú móvil */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col h-full">
                <ul className="flex-1 space-y-2">
                  {menuLinks.map((link) => (
                    <li key={link.path}>
                      <button
                        onClick={() => handleNavigation(link.path)}
                        className={`block w-full text-left py-2 text-sm font-medium transition-colors ${
                          isLinkActive(link.path)
                            ? 'text-yellow-500'
                            : 'text-muted-foreground hover:text-yellow-500'
                        }`}
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
                {!isAuthenticated ? (
                  <Button
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/login');
                    }}
                    className="w-full bg-yellow-500 hover:bg-yellow-600"
                  >
                    Iniciar sesión
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/client');
                    }}
                    className="w-full"
                  >
                    Mi cuenta
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
