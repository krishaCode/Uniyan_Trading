import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlayCircle, TrendingUp, BookOpen, Shield, ChevronRight, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <BookOpen size={24} className="text-blue-500" />,
      title: 'Structured Classes',
      desc: 'Learn trading concepts through organized, expert-led classes.'
    },
    {
      icon: <PlayCircle size={24} className="text-blue-500" />,
      title: 'Video Learning',
      desc: 'Watch recorded classes anytime after receiving access.'
    },
    {
      icon: <TrendingUp size={24} className="text-blue-500" />,
      title: 'Expert Guidance',
      desc: 'Master the markets with proven strategies and analysis.'
    },
    {
      icon: <Shield size={24} className="text-blue-500" />,
      title: 'Secure Platform',
      desc: 'Safe, controlled learning environment with personalized access.'
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="home-hero relative min-h-[90vh] flex items-center justify-center overflow-hidden hero-gradient">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-blue-600/20 rounded-full blur-[80px] animate-pulse-glow"></div>
          <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="home-hero-inner container z-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="home-hero-copy text-left"
          >
            <div className="home-eyebrow inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 font-semibold text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              The Ultimate Trading Education Platform
            </div>
            
            <h1 className="hero-title text-5xl lg:text-6xl font-black text-primary leading-tight mb-6 tracking-tighter">
              <span>Master Trading.</span>
              <span>Build Knowledge.</span>
              <span className="gradient-text">Trade Smarter.</span>
            </h1>
            
            <p className="home-hero-description text-lg lg:text-xl text-secondary mb-8 max-w-xl leading-relaxed">
              Join the elite trading community. Get access to professional courses, real-time market analysis, and structured learning paths designed for your success.
            </p>
            
            <div className="home-hero-actions flex flex-wrap items-center gap-4">
              <Link to={user ? "/classes" : "/signup"} className="btn-primary text-lg px-8 py-4">
                Start Learning Now <ChevronRight size={20} />
              </Link>
              <Link to="/classes" className="btn-secondary text-lg px-8 py-4">
                View Classes
              </Link>
            </div>
          </motion.div>

          {/* 3D Abstract Visuals */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="home-visual relative h-[500px] hidden lg:block perspective-1000"
          >
            {/* Main Floating Card */}
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-96 glass-card p-6 flex flex-col justify-between z-20 animate-float"
              style={{ transformStyle: 'preserve-3d', transform: 'rotateY(-15deg) rotateX(10deg)' }}
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <TrendingUp className="text-blue-500" size={24} />
                  </div>
                  <span className="text-emerald-500 font-bold">+24.5%</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Technical Analysis Masterclass</h3>
                <p className="text-sm text-secondary">Class 04 • 1h 45m</p>
              </div>
              <div className="w-full h-32 bg-gradient-to-t from-blue-500/20 to-transparent rounded-xl border border-blue-500/20 relative overflow-hidden">
                {/* Fake Chart bars */}
                <div className="absolute bottom-0 left-4 w-6 bg-emerald-500/50 rounded-t-sm" style={{ height: '40%', animation: 'candlestick-rise 1s ease forwards' }}></div>
                <div className="absolute bottom-0 left-14 w-6 bg-rose-500/50 rounded-t-sm" style={{ height: '30%', animation: 'candlestick-rise 1s ease forwards 0.2s' }}></div>
                <div className="absolute bottom-0 left-24 w-6 bg-emerald-500/50 rounded-t-sm" style={{ height: '70%', animation: 'candlestick-rise 1s ease forwards 0.4s' }}></div>
                <div className="absolute bottom-0 left-34 w-6 bg-emerald-500/50 rounded-t-sm" style={{ height: '90%', animation: 'candlestick-rise 1s ease forwards 0.6s' }}></div>
              </div>
            </motion.div>

            {/* Background elements */}
            <motion.div 
              className="absolute top-20 right-10 w-48 h-48 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-xl animate-spin-slow z-0"
            ></motion.div>
            
            <motion.div 
              className="absolute bottom-20 left-10 w-40 p-4 glass-card z-30 animate-float-slow"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Shield className="text-emerald-500" size={20} />
                </div>
                <div>
                  <p className="text-xs text-muted">Status</p>
                  <p className="font-bold text-sm">Access Granted</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Ticker Tape */}
      <div className="home-ticker w-full overflow-hidden relative z-20">
        <div className="ticker-wrap flex text-white font-semibold text-sm uppercase tracking-wider">
          <motion.div 
            className="ticker-content"
            animate={{ x: [0, -1035] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          >
            <span>• Price Action Trading</span>
            <span>• Risk Management</span>
            <span>• Fibonacci Retracements</span>
            <span>• Smart Money Concepts</span>
            <span>• Candlestick Patterns</span>
            <span>• Trading Psychology</span>
            <span>• Institutional Order Flow</span>
            {/* Duplicate for seamless loop */}
            <span>• Price Action Trading</span>
            <span>• Risk Management</span>
            <span>• Fibonacci Retracements</span>
            <span>• Smart Money Concepts</span>
            <span>• Candlestick Patterns</span>
            <span>• Trading Psychology</span>
            <span>• Institutional Order Flow</span>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <section className="home-features py-24 bg-primary relative">
        <div className="home-section-inner container">
          <div className="home-section-heading text-center max-w-3xl mx-auto mb-16">
            <p className="home-section-kicker">A BETTER WAY TO LEARN</p>
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">Everything You Need to Succeed</h2>
            <p className="text-lg text-secondary">Our platform provides a structured, secure, and professional environment for serious traders to develop their skills.</p>
          </div>

          <div className="home-feature-grid grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="home-feature-card card p-8 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
                <p className="text-secondary leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="home-cta py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 z-0"></div>
        <div className="home-cta-inner container relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">Ready to Transform Your Trading?</h2>
          <p className="text-xl text-secondary mb-10 max-w-2xl mx-auto">
            Join hundreds of students who have already elevated their trading game with TradNex.
          </p>
          {user ? (
            <Link to="/classes" className="btn-primary text-lg px-8 py-4">
              Continue Learning <ArrowRight size={20} className="ml-2" />
            </Link>
          ) : (
            <Link to="/signup" className="btn-primary text-lg px-8 py-4">
              Create Free Account <ArrowRight size={20} className="ml-2" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
