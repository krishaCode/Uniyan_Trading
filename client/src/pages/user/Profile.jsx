import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyVideos } from '../../services/videoService';
import { updateProfile } from '../../services/userService';
import VideoCard from '../../components/common/VideoCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { User, Mail, Phone, FileText, Calendar, CheckCircle2, XCircle, AlertCircle, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, refreshUser, isApproved } = useAuth();
  const [myVideos, setMyVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name,
      phone: user?.phone
    }
  });

  useEffect(() => {
    const fetchMyVideos = async () => {
      if (!isApproved) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await getMyVideos();
        setMyVideos(data.videos);
      } catch (error) {
        console.error('Failed to fetch videos', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyVideos();
  }, [isApproved]);

  const onUpdateProfile = async (data) => {
    setUpdating(true);
    try {
      await updateProfile(data);
      await refreshUser();
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = () => {
    switch(user.status) {
      case 'approved':
        return <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-sm font-bold"><CheckCircle2 size={16} /> Approved</div>;
      case 'pending':
        return <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-sm font-bold"><AlertCircle size={16} /> Pending Approval</div>;
      case 'rejected':
      case 'suspended':
        return <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-full text-sm font-bold"><XCircle size={16} /> {user.status.charAt(0).toUpperCase() + user.status.slice(1)}</div>;
      default:
        return null;
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <Toaster position="top-center" />
      
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Sidebar Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-8 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600 to-purple-600 opacity-20"></div>
            
            <div className="relative z-10">
              <div className="w-24 h-24 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center font-black text-4xl border-4 border-card shadow-xl mb-4">
                {user.name.charAt(0)}
              </div>
              
              <h2 className="text-2xl font-bold text-primary mb-1">{user.name}</h2>
              <p className="text-secondary text-sm mb-4">{user.email}</p>
              
              <div className="flex justify-center mb-6">
                {getStatusBadge()}
              </div>

              <div className="space-y-4 text-left border-t border-theme pt-6 mt-6">
                <div className="flex items-center gap-3 text-secondary text-sm">
                  <FileText size={18} className="text-muted" />
                  <span className="font-medium text-primary">NIC:</span> {user.nic}
                </div>
                <div className="flex items-center gap-3 text-secondary text-sm">
                  <Calendar size={18} className="text-muted" />
                  <span className="font-medium text-primary">Joined:</span> {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Edit Profile Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <h3 className="text-lg font-bold text-primary mb-4 border-b border-theme pb-2">Edit Profile</h3>
            <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-secondary mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted"><User size={14} /></div>
                  <input type="text" className="input-field pl-9 text-sm py-2" {...register('name', { required: true })} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary mb-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted"><Phone size={14} /></div>
                  <input type="text" className="input-field pl-9 text-sm py-2" {...register('phone', { required: true })} />
                </div>
              </div>
              <button type="submit" disabled={updating} className="btn-primary w-full py-2 text-sm">
                {updating ? 'Saving...' : <><Save size={16} /> Save Changes</>}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Main Content: My Classes */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card p-6 min-h-full flex flex-col"
          >
            <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <PlayCircle size={20} />
              </span>
              My Learning Path
            </h2>

            {!isApproved ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6">
                  <AlertCircle size={40} />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">Account Not Approved Yet</h3>
                <p className="text-secondary max-w-md mx-auto">
                  Your account is currently under review by our administration team. Once approved, your assigned classes will appear here.
                </p>
              </div>
            ) : loading ? (
              <div className="flex-1 flex items-center justify-center py-12"><LoadingSpinner /></div>
            ) : myVideos.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
                  <PlayCircle size={40} />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">No Classes Assigned</h3>
                <p className="text-secondary max-w-md mx-auto">
                  You haven't been granted access to any classes yet. Please contact support if you believe this is an error.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {myVideos.map((video, index) => (
                  <VideoCard key={video._id} video={video} hasAccess={true} index={index} />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
