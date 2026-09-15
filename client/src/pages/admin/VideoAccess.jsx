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
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <Toaster position="top-right" />
      
      <div>
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <ShieldCheck className="text-blue-500" /> Video Access Control
        </h1>
        <p className="text-secondary text-sm">Select an approved user on the left to manage their video access.</p>
      </div>

      <div className="flex-1 grid lg:grid-cols-3 gap-6 overflow-hidden min-h-[400px]">
        {/* Users List (Left Pane) */}
        <div className="card flex flex-col overflow-hidden">
          <div className="p-4 border-b border-theme">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input 
                type="text" 
                placeholder="Search approved users..." 
                className="input-field pl-9 text-sm py-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {loadingUsers ? (
              <div className="p-4 flex justify-center"><LoadingSpinner /></div>
            ) : users.length === 0 ? (
              <div className="p-4 text-center text-secondary text-sm">No users found.</div>
            ) : (
              users.map(u => (
                <button 
                  key={u._id}
                  onClick={() => setSelectedUserId(u._id)}
                  className={`w-full text-left p-3 rounded-xl mb-2 flex items-center gap-3 transition-colors ${selectedUserId === u._id ? 'bg-blue-500 text-white' : 'hover:bg-glass text-primary'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${selectedUserId === u._id ? 'bg-white/20' : 'bg-blue-500/10 text-blue-500'}`}>
                    {u.name.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <p className={`font-semibold text-sm truncate ${selectedUserId === u._id ? 'text-white' : ''}`}>{u.name}</p>
                    <p className={`text-xs truncate ${selectedUserId === u._id ? 'text-blue-100' : 'text-muted'}`}>{u.email}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Video Access Grid (Right Pane) */}
        <div className="lg:col-span-2 card flex flex-col overflow-hidden">
          {selectedUserId ? (
            <>
              <div className="p-4 border-b border-theme flex justify-between items-center bg-primary/30">
                <h3 className="font-bold text-primary">Manage Permissions</h3>
                <button onClick={handleGrantAll} className="btn-secondary !text-xs !py-1.5">Grant All Access</button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto relative">
                {loadingAccess ? (
                  <LoadingSpinner fullScreen={false} />
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {loadingVideos ? (
                      <LoadingSpinner />
                    ) : videos.map(video => {
                      const hasAccess = userAccess.has(video._id);
                      return (
                        <div 
                          key={video._id} 
                          onClick={() => toggleAccess(video._id)}
                          className={`flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${hasAccess ? 'bg-blue-500/10 border-blue-500/30' : 'bg-glass border-theme hover:border-blue-500/30'}`}
                        >
                          <div className={`shrink-0 ${hasAccess ? 'text-blue-500' : 'text-muted'}`}>
                            {hasAccess ? <CheckSquare size={20} /> : <Square size={20} />}
                          </div>
                          
                          <div className="w-16 h-10 rounded overflow-hidden relative shrink-0">
                            <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
                            {!hasAccess && <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>}
                          </div>
                          
                          <div className="overflow-hidden">
                            <h4 className={`text-sm font-semibold truncate ${hasAccess ? 'text-primary' : 'text-secondary'}`}>{video.title}</h4>
                            <p className="text-xs text-muted">Class {video.classNumber}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <ShieldCheck size={64} className="text-muted opacity-30 mb-4" />
              <h3 className="text-xl font-bold text-secondary mb-2">No User Selected</h3>
              <p className="text-muted max-w-sm">Select a user from the list to view and manage their video access permissions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoAccess;
