import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { Mail, Lock, User, Phone, FileText, ArrowRight, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await registerUser(data);
      toast.success(response.message || 'Registration successful!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-primary">
      <Toaster position="top-center" />
      
      <div className="signup-orb signup-orb-one" />
      <div className="signup-orb signup-orb-two" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="signup-shell relative z-10"
      >
        <div className="signup-intro">
          <Link to="/" className="auth-logo">
            <div className="auth-logo-mark">
              T
            </div>
            <span>Trad<span>Nex</span></span>
          </Link>
          <div className="auth-intro-copy">
            <p className="auth-kicker">START YOUR JOURNEY</p>
            <h1>Build your edge, one lesson at a time.</h1>
            <p>Join a focused learning environment designed to help you study the markets with clarity and discipline.</p>
          </div>
          <div className="signup-steps">
            <span className="signup-step active"><strong>01</strong> Create profile</span>
            <span className="signup-step"><strong>02</strong> Await approval</span>
            <span className="signup-step"><strong>03</strong> Start learning</span>
          </div>
        </div>

        <div className="signup-form-panel">
          <div className="auth-form-heading">
            <p className="auth-kicker">NEW MEMBER</p>
            <h2>Create your account</h2>
            <p>Enter your details to request access to TradNex.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
            
            <div className="signup-field signup-field-wide">
              <label htmlFor="signup-name">Full name</label>
              <div className="auth-input-wrap">
                <div className="auth-input-icon">
                  <User size={18} />
                </div>
                <input
                  id="signup-name"
                  type="text"
                  className={`input-field ${errors.name ? 'input-error' : ''}`}
                  placeholder="John Doe"
                  {...register('name', { required: 'Full name is required' })}
                />
              </div>
              {errors.name && <p className="auth-error">{errors.name.message}</p>}
            </div>

            <div className="signup-field">
              <label htmlFor="signup-email">Email address</label>
              <div className="auth-input-wrap">
                <div className="auth-input-icon">
                  <Mail size={18} />
                </div>
                <input
                  id="signup-email"
                  type="email"
                  className={`input-field ${errors.email ? 'input-error' : ''}`}
                  placeholder="you@example.com"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' }
                  })}
                />
              </div>
              {errors.email && <p className="auth-error">{errors.email.message}</p>}
            </div>

            <div className="signup-field">
              <label htmlFor="signup-phone">Phone number</label>
              <div className="auth-input-wrap">
                <div className="auth-input-icon">
                  <Phone size={18} />
                </div>
                <input
                  id="signup-phone"
                  type="text"
                  className={`input-field ${errors.phone ? 'input-error' : ''}`}
                  placeholder="+1 (555) 000-0000"
                  {...register('phone', { required: 'Phone is required' })}
                />
              </div>
              {errors.phone && <p className="auth-error">{errors.phone.message}</p>}
            </div>

            <div className="signup-field signup-field-wide">
              <label htmlFor="signup-nic">NIC number</label>
              <div className="auth-input-wrap">
                <div className="auth-input-icon">
                  <FileText size={18} />
                </div>
                <input
                  id="signup-nic"
                  type="text"
                  className={`input-field ${errors.nic ? 'input-error' : ''}`}
                  placeholder="National Identity Card Number"
                  {...register('nic', { required: 'NIC is required for verification' })}
                />
              </div>
              {errors.nic && <p className="auth-error">{errors.nic.message}</p>}
            </div>

            <div className="signup-field">
              <label htmlFor="signup-password">Password</label>
              <div className="auth-input-wrap">
                <div className="auth-input-icon">
                  <Lock size={18} />
                </div>
                <input
                  id="signup-password"
                  type="password"
                  className={`input-field ${errors.password ? 'input-error' : ''}`}
                  placeholder="••••••••"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 6, message: 'At least 6 characters' }
                  })}
                />
              </div>
              {errors.password && <p className="auth-error">{errors.password.message}</p>}
            </div>

            <div className="signup-field">
              <label htmlFor="signup-confirm-password">Confirm password</label>
              <div className="auth-input-wrap">
                <div className="auth-input-icon">
                  <Lock size={18} />
                </div>
                <input
                  id="signup-confirm-password"
                  type="password"
                  className={`input-field ${errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="••••••••"
                  {...register('confirmPassword', { 
                    required: 'Confirm password is required',
                    validate: val => val === password || 'Passwords do not match'
                  })}
                />
              </div>
              {errors.confirmPassword && <p className="auth-error">{errors.confirmPassword.message}</p>}
            </div>

            <div className="signup-submit-area signup-field-wide">
              <div className="signup-notice">
                <div className="signup-notice-icon">!</div>
                <p>New accounts require administrator approval. After registration, please wait for an email confirming your access.</p>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary auth-submit"
              >
                {loading ? <Loader className="animate-spin" size={20} /> : (
                  <>Create Account <ArrowRight size={18} /></>
                )}
              </button>
            </div>
          </form>

          <p className="auth-register">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-500 hover:text-blue-400">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
