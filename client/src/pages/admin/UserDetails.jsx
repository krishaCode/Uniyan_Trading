import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserById, approveUser, rejectUser, suspendUser } from '../../services/userService';
import { getAllVideosWithAccessStatus, grantAccess, revokeAccessByUserVideo } from '../../services/videoAccessService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeft, User, Mail, Phone, FileText, Calendar, CheckCircle2, XCircle, ShieldAlert, Video } from 'lucide-react';

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accessLoading, setAccessLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [userRes, videoRes] = await Promise.all([
        getUserById(id),
        getAllVideosWithAccessStatus(id)
      ]);
      setUser(userRes.data.user);
      setVideos(videoRes.data.videos);
    } catch (error) {
      toast.error('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleStatusChange = async (action) => {
    try {
      if (action === 'approve') await approveUser(id);
      else if (action === 'reject') await rejectUser(id);
      else if (action === 'suspend') await suspendUser(id);
      
      toast.success(`User ${action}d successfully`);
      fetchData();
    } catch (error) {
      toast.error(`Failed to change status`);
    }
  };

  const toggleVideoAccess = async (videoId, hasAccess) => {
    setAccessLoading(true);
    try {
      if (hasAccess) {
        await revokeAccessByUserVideo(id, videoId);
        toast.success('Access revoked');
      } else {
        await grantAccess({ userId: id, videoId });
        toast.success('Access granted');
      }
      // Optimistic UI update
      setVideos(videos.map(v => v._id === videoId ? { ...v, hasAccess: !hasAccess } : v));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update access');
    } finally {
      setAccessLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!user) return <div className="text-center p-8">User not found</div>;

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      
      <div className="flex items-center gap-4">
        <Link to="/admin/users" className="p-2 bg-glass rounded-lg text-secondary hover:text-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-primary">User Details</h1>
          <p className="text-secondary text-sm">Manage user profile and video permissions.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card p-6">
            <div className="w-20 h-20 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-black text-3xl mx-auto mb-4 border-2 border-blue-500/20">
              {user.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-center text-primary mb-1">{user.name}</h2>
            <p className="text-center text-secondary text-sm mb-4">{user.email}</p>
            
            <div className="flex justify-center mb-6">
              <span className={`badge-${user.status}`}>{user.status.toUpperCase()}</span>
            </div>

            <div className="space-y-3 pt-6 border-t border-theme">
              <div className="flex items-center gap-3 text-sm">
                <FileText size={16} className="text-muted" />
                <span className="text-secondary w-16">NIC:</span>
                <span className="font-mono text-primary font-medium">{user.nic}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-muted" />
                <span className="text-secondary w-16">Phone:</span>
                <span className="text-primary font-medium">{user.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar size={16} className="text-muted" />
                <span className="text-secondary w-16">Joined:</span>
                <span className="text-primary font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {user.status !== 'approved' && (
                <button onClick={() => handleStatusChange('approve')} className="btn-success w-full justify-center">
                  <CheckCircle2 size={16} /> Approve
                </button>
              )}
              {user.status === 'pending' && (
                <button onClick={() => handleStatusChange('reject')} className="btn-danger w-full justify-center">
                  <XCircle size={16} /> Reject
                </button>
              )}
              {user.status === 'approved' && (
                <button onClick={() => handleStatusChange('suspend')} className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/30 hover:bg-amber-500/20 text-sm font-semibold w-full">
                  <ShieldAlert size={16} /> Suspend
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Video Access Management */}
        <div className="lg:col-span-2">
          <div className="card p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-theme">
              <div>
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Video className="text-blue-500" size={20} /> Video Access Permissions
                </h3>
                <p className="text-sm text-secondary">Toggle switches to grant or revoke video access for this user.</p>
              </div>
              <div className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-lg text-sm font-bold border border-blue-500/20">
                {videos.filter(v => v.hasAccess).length} / {videos.length} Granted
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
              {videos.length === 0 ? (
                <p className="text-center text-muted py-8">No videos available in the system.</p>
              ) : (
                videos.map((video) => (
                  <div key={video._id} className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${video.hasAccess ? 'bg-blue-500/5 border-blue-500/20' : 'bg-glass border-theme hover:bg-white/5'}`}>
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-12 rounded overflow-hidden">
                        <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20"></div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">C{String(video.classNumber).padStart(2, '0')}</span>
                          <h4 className="font-semibold text-primary text-sm">{video.title}</h4>
                        </div>
                        <p className="text-xs text-muted flex items-center gap-2">
                          <span className={`inline-block w-1.5 h-1.5 rounded-full ${video.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                          {video.status.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toggleVideoAccess(video._id, video.hasAccess)}
                      disabled={accessLoading}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${video.hasAccess ? 'bg-blue-500' : 'bg-gray-600'}`}
                    >
                      <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-md ${video.hasAccess ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
