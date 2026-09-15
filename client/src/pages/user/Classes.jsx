import { useState, useEffect } from 'react';
import { getVideos, getMyVideos } from '../../services/videoService';
import { useAuth } from '../../context/AuthContext';
import VideoCard from '../../components/common/VideoCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { PlayCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Classes = () => {
  const [videos, setVideos] = useState([]);
  const [myAccessIds, setMyAccessIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const { user, isApproved, isAdmin } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get ALL published videos (or all if admin)
        const allVideosRes = await getVideos({ limit: 100 });
        setVideos(allVideosRes.data.videos);

        // If user is approved, fetch which ones they have access to
        if (user && isApproved) {
          const myVideosRes = await getMyVideos();
          const accessSet = new Set(myVideosRes.data.videos.map(v => v._id));
          setMyAccessIds(accessSet);
        }
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isApproved]);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4 flex items-center gap-3">
          <PlayCircle className="text-blue-500" size={36} /> 
          Trading Classes
        </h1>
        <p className="text-lg text-secondary max-w-3xl">
          Browse our collection of professional trading masterclasses. Videos marked with a lock require administrator approval for access.
        </p>
      </div>

      {/* Pending Account Warning */}
      {user && !isApproved && !isAdmin && (
        <div className="mb-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-4">
          <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={24} />
          <div>
            <h3 className="text-lg font-bold text-amber-500 mb-1">Account Pending Approval</h3>
            <p className="text-secondary text-sm">
              Your account is currently waiting for administrator approval. You will not be able to watch protected videos until your account is fully verified.
            </p>
          </div>
        </div>
      )}

      {/* Guest Warning */}
      {!user && (
        <div className="mb-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <AlertCircle className="text-blue-500 shrink-0" size={24} />
            <p className="text-secondary text-sm font-medium">
              You must be logged in and approved to watch classes.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/login" className="btn-secondary !py-2 !px-4 !text-sm">Login</Link>
            <Link to="/signup" className="btn-primary !py-2 !px-4 !text-sm">Sign Up</Link>
          </div>
        </div>
      )}

      {/* Video Grid */}
      {videos.length === 0 ? (
        <div className="text-center py-20 glass-card">
          <PlayCircle className="mx-auto text-muted mb-4 opacity-50" size={64} />
          <h3 className="text-xl font-bold text-secondary">No classes available yet.</h3>
          <p className="text-muted mt-2">Check back later for new content.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {videos.map((video, index) => {
            const hasAccess = isAdmin || myAccessIds.has(video._id);
            return (
              <VideoCard 
                key={video._id} 
                video={video} 
                hasAccess={hasAccess} 
                index={index} 
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Classes;
