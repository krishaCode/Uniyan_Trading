import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/userService';
import toast, { Toaster } from 'react-hot-toast';
import { Settings as SettingsIcon, Save, Key, Shield, User } from 'lucide-react';

const Settings = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      await refreshUser();
      toast.success('Admin profile updated');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Toaster position="top-right" />
      
      <div>
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <SettingsIcon className="text-blue-500" /> Platform Settings
        </h1>
        <p className="text-secondary text-sm">Manage your administrator account and platform preferences.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Navigation / Tabs (Static for now) */}
        <div className="md:col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500 text-white font-medium shadow-md shadow-blue-500/20">
            <User size={18} /> Admin Profile
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-glass text-secondary hover:text-primary hover:bg-white/5 transition-colors font-medium border border-transparent hover:border-theme">
            <Key size={18} /> Security
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-glass text-secondary hover:text-primary hover:bg-white/5 transition-colors font-medium border border-transparent hover:border-theme">
            <Shield size={18} /> Platform Policy
          </button>
        </div>

        {/* Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-bold text-primary mb-6 pb-2 border-b border-theme">Personal Information</h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Full Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Email Address (Read-only)</label>
                <input 
                  type="email" 
                  className="input-field opacity-60 cursor-not-allowed" 
                  value={user?.email || ''}
                  disabled
                />
                <p className="text-xs text-muted mt-1">To change your admin email, please contact superadmin or edit directly in the database.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Phone Number</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>

              <div className="pt-4 border-t border-theme">
                <button type="submit" disabled={loading} className="btn-primary min-w-[140px]">
                  {loading ? 'Saving...' : <><Save size={18} className="mr-2" /> Save Profile</>}
                </button>
              </div>
            </form>
          </div>

          <div className="card p-6 bg-blue-500/5 border-blue-500/20">
            <h3 className="text-lg font-bold text-blue-500 mb-2">System Information</h3>
            <div className="space-y-2 text-sm text-secondary">
              <p><strong>Version:</strong> TradNex OS v1.0.0</p>
              <p><strong>Environment:</strong> Production</p>
              <p><strong>Role:</strong> System Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
