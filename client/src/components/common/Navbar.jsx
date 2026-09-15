import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Classes', path: '/classes' },
    { name: 'News & Updates', path: '/news' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header 
      className={`site-header fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'is-scrolled shadow-theme' : ''}`}
    >
      <div className="container">
        <div className="site-nav">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
              T
            </div>
            <span className="text-2xl font-black tracking-tighter">
              Trad<span className="text-blue-500">Nex</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="site-nav-links hidden md:flex">
            {navLinks.map((link) => (
              <NavLink 
                key={link.name} 
                to={link.path}
                className={({ isActive }) => `site-nav-link ${isActive ? 'active' : ''}`}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="site-nav-actions hidden md:flex">
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link to="/admin" className="btn-secondary !px-3 !py-2 !text-sm" title="Admin Dashboard">
                    <LayoutDashboard size={16} />
                  </Link>
                )}
                <Link to="/profile" className="flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center font-bold border border-blue-500/20">
                    {user.name.charAt(0)}
                  </div>
                  {user.name.split(' ')[0]}
                </Link>
                <button onClick={handleLogout} className="text-muted hover:text-red-500 transition-colors ml-2">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-semibold text-secondary hover:text-primary transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary !px-5 !py-2 !text-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4">
            <ThemeToggle />
            <button 
              className="text-primary p-2 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card border-b border-theme shadow-theme overflow-hidden absolute w-full top-full left-0"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <NavLink 
                  key={link.name} 
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `block px-4 py-3 rounded-lg text-base font-semibold ${
                    isActive ? 'bg-blue-500/10 text-blue-500' : 'text-secondary hover:bg-glass'
                  }`}
                >
                  {link.name}
                </NavLink>
              ))}
              
              <div className="h-px bg-theme w-full my-2"></div>
              
              {user ? (
                <>
                  <div className="px-4 py-2 flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center font-bold text-lg border border-blue-500/20">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-primary">{user.name}</p>
                      <p className="text-xs text-muted">{user.email}</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-secondary font-medium hover:bg-glass rounded-lg"
                    >
                      <LayoutDashboard size={18} /> Admin Dashboard
                    </Link>
                  )}
                  <Link 
                    to="/profile" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-secondary font-medium hover:bg-glass rounded-lg"
                  >
                    <UserIcon size={18} /> My Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-3 text-red-500 font-medium hover:bg-red-500/10 rounded-lg w-full text-left"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4 px-2 mt-2">
                  <Link 
                    to="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-secondary !w-full text-center"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary !w-full text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
