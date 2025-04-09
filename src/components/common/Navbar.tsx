// src/components/common/Navbar.tsx
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { menuLinks } from '@/constants/menuLinks';
import { Menu, X } from 'lucide-react';
import LoginPopover from '@/features/auth/components/LoginPopover';
import { useAuthStore } from '@/features/auth/store/auth.store';

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const loginRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, logout } = useAuthStore();
  

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Cerrar popover al hacer clic fuera
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
    <nav className="bg-white shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center relative">
        <h1 className="text-xl font-bold text-green-600">MVP</h1>

        {/* Desktop menu */}
        <ul className="hidden md:flex gap-6 items-center">
          {menuLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`text-sm font-medium ${
                  location.pathname === link.path
                    ? 'text-green-600 underline'
                    : 'text-gray-600 hover:text-green-600'
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
                className="text-sm font-medium text-gray-600 hover:text-green-600"
              >
                Iniciar sesión
              </button>
            </li>
          ) : (
            <li className="flex items-center gap-2">
              <span className="text-sm text-gray-700">
                Bienvenido, <strong>{user?.email}</strong>
              </span>
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:underline"
              >
                Cerrar sesión
              </button>
            </li>
          )}
        </ul>

        {/* Mobile hamburger */}
        <button className="md:hidden" onClick={toggleMenu}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Login popover */}
        {showLogin && (
          <div ref={loginRef}>
            <LoginPopover onClose={() => setShowLogin(false)} />
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <ul className="flex flex-col gap-2">
            {menuLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`block py-2 text-sm font-medium ${
                    location.pathname === link.path
                      ? 'text-blue-600'
                      : 'text-gray-700'
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
                  className="text-sm font-medium text-gray-700"
                >
                  Iniciar sesión
                </button>
              </li>
            ) : (
              <li className="text-sm text-gray-700">
                <span className="block mb-2">Bienvenido, <strong>{user?.email}</strong></span>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="text-red-600 hover:underline"
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
