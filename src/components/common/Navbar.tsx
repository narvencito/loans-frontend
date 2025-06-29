import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { menuLinks } from '@/constants/menuLinks';
import { useAuthStore } from '@/features/auth/store/auth.store';
import LoginDialog from '@/features/auth/components/LoginDialog';
import { showConfirm } from '@/shared/utils/global-dialog-utils';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const loginRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, logout } = useAuthStore();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = async () => {
    try {
      const isConfirmed = await showConfirm('¿Estás seguro de cerrar sesión?');
      if (!isConfirmed) return;

      await logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error during logout:', error);
      // El logout local ya se realizó en el store, así que redirigimos de todos modos
      navigate('/', { replace: true });
    }
  };

  // Cerrar login popover al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (loginRef.current && !loginRef.current.contains(event.target as Node)) {
        setShowLogin(false);
      }
    };

    if (showLogin) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLogin]);

  return (
    <nav className="bg-background text-foreground shadow-md fixed top-0 w-full z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center relative">
        <Link to="/" className="text-xl font-bold text-primary">
          StudyCash
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex gap-6 items-center">
          {menuLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`text-sm font-medium transition-colors ${location.pathname === link.path
                    ? 'text-primary underline'
                    : 'text-muted-foreground hover:text-primary'
                  }`}
              >
                {link.label}
              </Link>
            </li>
          ))}

          {!isAuthenticated ? (
            <li>
              <button
                onClick={() => setShowLogin(!showLogin)}
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                Iniciar sesión
              </button>
            </li>
          ) : (
            <li className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">
                Bienvenido, <strong>{user?.email}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="text-destructive hover:underline"
              >
                Cerrar sesión
              </button>
            </li>
          )}
        </ul>

        {/* Mobile */}
        <button className="md:hidden" onClick={toggleMenu}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <LoginDialog open={showLogin} onClose={() => setShowLogin(false)} />
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-background px-4 pb-4 border-t border-border">
          <ul className="flex flex-col gap-2">
            {menuLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`block py-2 text-sm font-medium transition-colors ${location.pathname === link.path
                      ? 'text-primary underline'
                      : 'text-muted-foreground hover:text-primary'
                    }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {!isAuthenticated ? (
              <li>
                <button
                  onClick={() => {
                    setShowLogin(true);
                    setMenuOpen(false);
                  }}
                  className="text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  Iniciar sesión
                </button>
              </li>
            ) : (
              <li className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">
                  Bienvenido, <strong>{user?.email}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-destructive hover:underline"
                >
                  Cerrar sesión
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
