import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative w-12 h-6 rounded-full flex items-center transition-colors duration-300 ${className}`}
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #1e3a8a, #3b82f6)'
          : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
      }}
      whileTap={{ scale: 0.95 }}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <motion.div
        className="absolute w-5 h-5 rounded-full flex items-center justify-center text-xs shadow-md"
        style={{ background: 'white' }}
        animate={{ x: isDark ? 2 : 26 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {isDark ? <Moon size={11} className="text-blue-600" /> : <Sun size={11} className="text-amber-500" />}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
