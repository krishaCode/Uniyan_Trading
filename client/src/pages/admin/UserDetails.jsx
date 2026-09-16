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
    <div className="admin-user-details-page">
      <Toaster position="top-right" />
      
      <div className="user-details-heading">
        <Link to="/admin/users" className="user-details-back">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <p className="dashboard-kicker">ACCOUNT REVIEW</p>
          <h1>User details</h1>
          <p>Review this learner profile and manage their class permissions.</p>
        </div>
        <span className={`badge-${user.status}`}>{user.status.toUpperCase()}</span>
      </div>

      <div className="user-details-layout">
        {/* Profile Card */}
        <div className="user-profile-panel">
          <div className="user-profile-card">
            <div className="user-profile-avatar">
              {user.name.charAt(0)}
            </div>
            <h2>{user.name}</h2>
            <p className="user-profile-email"><Mail size={14} /> {user.email}</p>

            <div className="user-facts">
              <div><FileText size={16} /><span>NIC</span><strong>{user.nic}</strong></div>
              <div><Phone size={16} /><span>Phone</span><strong>{user.phone}</strong></div>
              <div><Calendar size={16} /><span>Joined</span><strong>{new Date(user.createdAt).toLocaleDateString()}</strong></div>
            </div>

            <div className="user-status-actions">
              <p>ACCOUNT ACTIONS</p>
              <div>
              {user.status !== 'approved' && (
                <button onClick={() => handleStatusChange('approve')} className="btn-success"><CheckCircle2 size={16} /> Approve</button>
              )}
              {user.status === 'pending' && (
                <button onClick={() => handleStatusChange('reject')} className="btn-danger"><XCircle size={16} /> Reject</button>
              )}
              {user.status === 'approved' && (
                <button onClick={() => handleStatusChange('suspend')} className="user-suspend-button"><ShieldAlert size={16} /> Suspend</button>
              )}
              </div>
            </div>
          </div>
        </div>

        {/* Video Access Management */}
        <div className="user-permissions-panel">
          <div className="permissions-heading">
              <div>
                <p className="dashboard-panel-kicker">ACCESS MANAGEMENT</p>
                <h2>
                  <Video className="text-blue-500" size={20} /> Video Access Permissions
                </h2>
                <p>Toggle a class to grant or revoke access for this learner.</p>
              </div>
              <div className="permissions-count">
                {videos.filter(v => v.hasAccess).length} / {videos.length} Granted
              </div>
          </div>
          <div className="permissions-progress"><span style={{ width: videos.length ? `${(videos.filter(v => v.hasAccess).length / videos.length) * 100}%` : '0%' }} /></div>

            <div className="permissions-list">
              {videos.length === 0 ? (
                  <p className="permissions-empty">No videos available in the system.</p>
              ) : (
                videos.map((video) => (
                  <div key={video._id} className={`permission-row ${video.hasAccess ? 'active' : ''}`}>
                    <div className="permission-video-info">
                      <div className="permission-thumbnail">
                        <img src={video.thumbnail} alt="" />
                      </div>
                      <div className="permission-copy">
                        <div><span>C{String(video.classNumber).padStart(2, '0')}</span><h3>{video.title}</h3></div>
                        <p><span className={video.status === 'published' ? 'published-dot' : 'draft-dot'} /> {video.status.toUpperCase()}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleVideoAccess(video._id, video.hasAccess)}
                      disabled={accessLoading}
                      className={`permission-toggle ${video.hasAccess ? 'active' : ''}`}
                      aria-label={`${video.hasAccess ? 'Revoke' : 'Grant'} access to ${video.title}`}
                    >
                      <span />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
    </div>
  );
};

export default UserDetails;
