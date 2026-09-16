import { useState, useEffect } from 'react';
import { getUsers } from '../../services/userService';
import { getVideos } from '../../services/videoService';
import { getUserVideoAccess, grantAccess, revokeAccessByUserVideo, grantBulkAccess } from '../../services/videoAccessService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast, { Toaster } from 'react-hot-toast';
import { Search, ShieldCheck, CheckSquare, Square } from 'lucide-react';

const VideoAccess = () => {
  const [users, setUsers] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userAccess, setUserAccess] = useState(new Set());
  
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [loadingAccess, setLoadingAccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch approved users only
  useEffect(() => {
    const fetchApprovedUsers = async () => {
      setLoadingUsers(true);
      try {
        const { data } = await getUsers({ status: 'approved', search: searchTerm, limit: 100 });
        setUsers(data.users);
      } catch (error) {
        toast.error('Failed to load users');
      } finally {
        setLoadingUsers(false);
      }
    };
    
    const delay = setTimeout(() => fetchApprovedUsers(), 500);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  // Fetch all videos once
  useEffect(() => {
    const fetchAllVideos = async () => {
      try {
        const { data } = await getVideos({ limit: 100 });
        setVideos(data.videos);
      } catch (error) {
        toast.error('Failed to load videos');
      } finally {
        setLoadingVideos(false);
      }
    };
    fetchAllVideos();
  }, []);

  // Fetch specific user access
  useEffect(() => {
    if (!selectedUserId) {
      setUserAccess(new Set());
      return;
    }

    const fetchAccess = async () => {
      setLoadingAccess(true);
      try {
        const { data } = await getUserVideoAccess(selectedUserId);
        const accessSet = new Set(data.accessRecords.map(r => r.video._id || r.video));
        setUserAccess(accessSet);
      } catch (error) {
        toast.error('Failed to load access records');
      } finally {
        setLoadingAccess(false);
      }
    };
    fetchAccess();
  }, [selectedUserId]);

  const toggleAccess = async (videoId) => {
    if (!selectedUserId) return;
    
    const hasAccess = userAccess.has(videoId);
    try {
      if (hasAccess) {
        await revokeAccessByUserVideo(selectedUserId, videoId);
        const newSet = new Set(userAccess);
        newSet.delete(videoId);
        setUserAccess(newSet);
      } else {
        await grantAccess({ userId: selectedUserId, videoId });
        const newSet = new Set(userAccess);
        newSet.add(videoId);
        setUserAccess(newSet);
      }
    } catch (error) {
      toast.error('Failed to update access');
    }
  };

  const handleGrantAll = async () => {
    if (!selectedUserId) return;
    try {
      const allVideoIds = videos.map(v => v._id);
      await grantBulkAccess({ userId: selectedUserId, videoIds: allVideoIds });
      setUserAccess(new Set(allVideoIds));
      toast.success('Granted access to all videos');
    } catch (error) {
      toast.error('Failed to grant all access');
    }
  };

  return (
    <div className="admin-access-page">
      <Toaster position="top-right" />
      
      <div className="access-page-heading">
        <div>
          <p className="dashboard-kicker">PERMISSIONS CENTER</p>
          <h1><ShieldCheck className="text-blue-500" /> Video access control</h1>
          <p>Choose an approved learner, then control which classes are available to their account.</p>
        </div>
        <div className="access-summary"><strong>{users.length}</strong><span>approved learners</span></div>
      </div>

      <div className="access-workspace">
        {/* Users List (Left Pane) */}
        <div className="access-users-panel">
          <div className="access-panel-heading">
            <div><p>STEP 01</p><h2>Choose a learner</h2></div>
            <span>{users.length} users</span>
          </div>
          <div className="access-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search approved users..."
              className="input-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="access-user-list">
            {loadingUsers ? (
              <div className="access-empty"><LoadingSpinner /></div>
            ) : users.length === 0 ? (
              <div className="access-empty">No approved users found.</div>
            ) : (
              users.map(u => (
                <button 
                  key={u._id}
                  onClick={() => setSelectedUserId(u._id)}
                  className={`access-user-row ${selectedUserId === u._id ? 'active' : ''}`}
                >
                  <div className="access-user-avatar">{u.name.charAt(0)}</div>
                  <div className="access-user-copy">
                    <p>{u.name}</p>
                    <span>{u.email}</span>
                  </div>
                  <span className="access-user-status">Approved</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Video Access Grid (Right Pane) */}
        <div className="access-permissions-panel">
          {selectedUserId ? (
            <>
              <div className="access-panel-heading access-permissions-heading">
                <div><p>STEP 02</p><h2>Manage class permissions</h2><span>{userAccess.size} of {videos.length} classes enabled</span></div>
                <button onClick={handleGrantAll} className="btn-secondary access-grant-button">Grant all access</button>
              </div>
              <div className="access-progress"><span style={{ width: videos.length ? `${(userAccess.size / videos.length) * 100}%` : '0%' }} /></div>

              <div className="access-video-list">
                {loadingAccess ? (
                  <LoadingSpinner fullScreen={false} />
                ) : (
                  <div className="access-video-grid">
                    {loadingVideos ? (
                      <LoadingSpinner />
                    ) : videos.map(video => {
                      const hasAccess = userAccess.has(video._id);
                      return (
                        <div 
                          key={video._id} 
                          onClick={() => toggleAccess(video._id)}
                          className={`access-video-card ${hasAccess ? 'active' : ''}`}
                        >
                          <div className="access-video-check">
                            {hasAccess ? <CheckSquare size={20} /> : <Square size={20} />}
                          </div>
                          <div className="access-video-thumbnail">
                            <img src={video.thumbnail} alt="" />
                            {!hasAccess && <div />}
                          </div>
                          <div className="access-video-copy">
                            <h3>{video.title}</h3>
                            <p>Class {video.classNumber}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="access-empty-state">
              <ShieldCheck size={56} />
              <p className="dashboard-panel-kicker">STEP 02</p>
              <h2>Select a learner</h2>
              <p>Choose an approved user from the directory to view and manage their class permissions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoAccess;
