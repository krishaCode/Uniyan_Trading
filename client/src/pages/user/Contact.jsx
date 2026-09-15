import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { submitContact } from '../../services/contactService';
import toast, { Toaster } from 'react-hot-toast';
import { Mail, Phone, MapPin, Send, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await submitContact(data);
      toast.success('Message sent successfully! We will get back to you soon.');
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page min-h-screen relative overflow-hidden bg-primary">
      <Toaster position="top-center" />
      
      {/* Background elements */}
      <div className="contact-orb" />
      
      <div className="container contact-container relative z-10">
        <div className="contact-masthead">
          <p className="contact-kicker">SUPPORT DESK</p>
          <h1>Let&apos;s talk about your next move.</h1>
          <p>
            Have questions about our courses or platform? We're here to help. Send us a message and our support team will respond as soon as possible.
          </p>
        </div>

        <div className="contact-layout">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="contact-info-column"
          >
            <div className="contact-info-card">
              <div>
                <p className="contact-card-kicker">WE&apos;RE HERE TO HELP</p>
                <h2>Contact information</h2>
              </div>
              
              <div className="contact-details">
                <div className="contact-detail">
                  <div className="contact-detail-icon">
                    <MapPin size={24} />
                  </div>
                  <div className="contact-detail-copy">
                    <h3>Our location</h3>
                    <p>
                      123 Trading Avenue,<br />
                      Financial District,<br />
                      NY 10004
                    </p>
                  </div>
                </div>

                <div className="contact-detail">
                  <div className="contact-detail-icon">
                    <Phone size={24} />
                  </div>
                  <div className="contact-detail-copy">
                    <h3>Phone number</h3>
                    <p>
                      +1 (555) 123-4567<br />
                      Mon-Fri 9am to 6pm
                    </p>
                  </div>
                </div>

                <div className="contact-detail">
                  <div className="contact-detail-icon">
                    <Mail size={24} />
                  </div>
                  <div className="contact-detail-copy">
                    <h3>Email address</h3>
                    <p>
                      support@tradenex.com<br />
                      info@tradenex.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="contact-form-column"
          >
            <div className="contact-form-card">
              <div className="contact-form-heading">
                <p className="contact-card-kicker">SEND A MESSAGE</p>
                <h2>Tell us what you need.</h2>
                <p>Complete the form and our support team will get back to you shortly.</p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
                <div className="contact-form-row">
                  <div className="contact-field">
                    <label htmlFor="contact-name">Your name</label>
                    <input
                      id="contact-name"
                      type="text"
                      className={`input-field ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="John Doe"
                      {...register('name', { required: 'Name is required' })}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  <div className="contact-field">
                    <label htmlFor="contact-email">Email address</label>
                    <input
                      id="contact-email"
                      type="email"
                      className={`input-field ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="you@example.com"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' }
                      })}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-subject">Subject</label>
                  <input
                    id="contact-subject"
                    type="text"
                    className={`input-field ${errors.subject ? 'border-red-500 focus:border-red-500' : ''}`}
                    placeholder="How can we help you?"
                    {...register('subject', { required: 'Subject is required' })}
                  />
                  {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>}
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    rows="5"
                    className={`input-field resize-none ${errors.message ? 'border-red-500 focus:border-red-500' : ''}`}
                    placeholder="Write your message here..."
                    {...register('message', { required: 'Message is required' })}
                  ></textarea>
                  {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary contact-submit"
                >
                  {loading ? <Loader className="animate-spin mx-auto" size={20} /> : (
                    <>Send Message <Send size={18} className="ml-2" /></>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
