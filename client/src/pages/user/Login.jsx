import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { Mail, Lock, ArrowRight, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data.email, data.password);
      toast.success('Login successful!');
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-primary">
      <Toaster position="top-center" />
      
      {/* Background decorations */}
      <div className="login-orb login-orb-one" />
      <div className="login-orb login-orb-two" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="auth-shell relative z-10"
      >
        <div className="auth-intro">
          <Link to="/" className="auth-logo">
            <div className="auth-logo-mark">
              T
            </div>
            <span>Trad<span>Nex</span></span>
          </Link>
          <div className="auth-intro-copy">
            <p className="auth-kicker">TRADNEX EDUCATION</p>
            <h1>Trade with a clearer plan.</h1>
            <p>Build disciplined market knowledge through structured classes, practical analysis, and a focused learning path.</p>
          </div>
          <div className="auth-signal">
            <span className="auth-signal-dot" />
            <span>Private learning environment</span>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="auth-form-heading">
            <p className="auth-kicker">MEMBER ACCESS</p>
            <h2>Welcome back</h2>
            <p>Enter your details to continue learning.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="auth-field">
              <label htmlFor="login-email">Email address</label>
              <div className="auth-input-wrap">
                <div className="auth-input-icon">
                  <Mail size={18} />
                </div>
                <input
                  id="login-email"
                  type="email"
                  className={`input-field ${errors.email ? 'input-error' : ''}`}
                  placeholder="you@example.com"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email format' }
                  })}
                />
              </div>
              {errors.email && <p className="auth-error">{errors.email.message}</p>}
            </div>

            <div className="auth-field">
              <div className="auth-label-row">
                <label htmlFor="login-password">Password</label>
                <a href="#">Forgot password?</a>
              </div>
              <div className="auth-input-wrap">
                <div className="auth-input-icon">
                  <Lock size={18} />
                </div>
                <input
                  id="login-password"
                  type="password"
                  className={`input-field ${errors.password ? 'input-error' : ''}`}
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required' })}
                />
              </div>
              {errors.password && <p className="auth-error">{errors.password.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary auth-submit"
            >
              {loading ? <Loader className="animate-spin" size={20} /> : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className="auth-register">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-blue-500 hover:text-blue-400">
              Sign up now
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
