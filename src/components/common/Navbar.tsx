import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { menuLinks } from '@/constants/menuLinks';
import { useAuthStore } from '@/features/auth/store/auth.store';
import LoginDialog from '@/features/auth/components/LoginDialog';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleNavigation = async (path: string) => {
    setIsOpen(false);
    
    // Si el path es '/' y no estamos en la página principal
    if (path === '/' && location.pathname !== '/') {
      navigate('/');
      setActiveSection('inicio');
      return;
    }
    
    // Si el path es un anchor y no estamos en la página principal
    if (path.startsWith('#') && location.pathname !== '/') {
      // Primero navegamos a la página principal
      await navigate('/');
      // Esperamos un momento para que la página se cargue
      setTimeout(() => {
        const sectionId = path.substring(1);
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
          setActiveSection(sectionId);
        }
      }, 100);
      return;
    }

    // Si estamos en la página principal
    if (path === '/') {
      const section = document.getElementById('inicio');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        setActiveSection('inicio');
      }
    } else if (path.startsWith('#')) {
      const sectionId = path.substring(1);
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(sectionId);
      }
    } else {
      navigate(path);
    }
  };

  useEffect(() => {
    // Solo activar si estamos en la página principal
    if (location.pathname === '/') {
      const handleScroll = () => {
        const sections = Array.from(document.querySelectorAll('section[id]'));
        const scrollPosition = window.pageYOffset;

        // Encontrar la sección más cercana al top
        const activeSection = sections.reduce((nearest, current) => {
          const section = current as HTMLElement;
          const sectionTop = section.offsetTop;
          
          // Si estamos dentro de la sección o es la más cercana al top
          if (scrollPosition >= sectionTop - 100) {
            if (!nearest || sectionTop > (nearest as HTMLElement).offsetTop) {
              return section;
            }
          }
          return nearest;
        }, null as HTMLElement | null);

        if (activeSection) {
          setActiveSection(activeSection.id);
        }
      };

      // Agregar el event listener
      window.addEventListener('scroll', handleScroll);
      // Llamar inicialmente para establecer la sección activa
      handleScroll();

      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      setActiveSection('');
    }
  }, [location.pathname]);

  // Función para determinar si un enlace está activo
  const isLinkActive = (path: string) => {
    if (location.pathname !== '/') return location.pathname === path;
    
    if (path === '/') return activeSection === 'inicio';
    if (path.startsWith('#')) return activeSection === path.substring(1);
    return false;
  };

  const handleOpenLogin = () => {
    setShowLoginDialog(true);
    setIsOpen(false);
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
              onClick={handleOpenLogin}
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
                    onClick={handleOpenLogin}
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

      <LoginDialog 
        open={showLoginDialog} 
        onClose={() => setShowLoginDialog(false)} 
      />
    </header>
  );
}
