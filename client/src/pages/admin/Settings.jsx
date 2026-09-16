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
    <div className="admin-settings-page">
      <Toaster position="top-right" />
      
      <div className="settings-page-heading">
        <div>
          <p className="dashboard-kicker">CONTROL CENTER</p>
          <h1><SettingsIcon className="text-blue-500" /> Platform settings</h1>
          <p>Manage your administrator profile and review the current platform environment.</p>
        </div>
        <div className="settings-status"><span /> All systems normal</div>
      </div>

      <div className="settings-workspace">
        {/* Navigation / Tabs (Static for now) */}
        <div className="settings-nav">
          <p>SETTINGS</p>
          <button className="active">
            <User size={18} /> <span>Admin profile</span>
          </button>
          <button>
            <Key size={18} /> <span>Security</span><small>Coming soon</small>
          </button>
          <button>
            <Shield size={18} /> <span>Platform policy</span><small>Coming soon</small>
          </button>
        </div>

        {/* Content */}
        <div className="settings-content">
          <div className="settings-form-card">
            <div className="settings-section-heading">
              <div><h2>Personal information</h2><p>Update the details associated with your administrator account.</p></div>
              <User size={20} />
            </div>
            
            <form onSubmit={handleSubmit} className="settings-form">
              <div className="settings-field">
                <label htmlFor="admin-name">Full name</label>
                <input 
                  id="admin-name"
                  type="text" 
                  className="input-field" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="settings-field">
                <label htmlFor="admin-email">Email address <span>Read-only</span></label>
                <input 
                  id="admin-email"
                  type="email" 
                  className="input-field opacity-60 cursor-not-allowed" 
                  value={user?.email || ''}
                  disabled
                />
                <p>To change your admin email, contact a superadmin or update it directly in the database.</p>
              </div>

              <div className="settings-field">
                <label htmlFor="admin-phone">Phone number</label>
                <input 
                  id="admin-phone"
                  type="text" 
                  className="input-field" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>

              <div className="settings-form-footer">
                <p>Changes are saved to your administrator profile.</p>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Saving...' : <><Save size={18} /> Save profile</>}
                </button>
              </div>
            </form>
          </div>

          <div className="settings-system-card">
            <div><p className="dashboard-panel-kicker">SYSTEM STATUS</p><h2>Platform information</h2></div>
            <div className="settings-system-grid">
              <p><span>Version</span><strong>TradNex OS v1.0.0</strong></p>
              <p><span>Environment</span><strong>Production</strong></p>
              <p><span>Role</span><strong>System administrator</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
