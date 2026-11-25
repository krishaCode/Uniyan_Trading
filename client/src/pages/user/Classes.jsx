import { useState, useEffect } from 'react';
import { getVideos, getMyVideos } from '../../services/videoService';
import { useAuth } from '../../context/AuthContext';
import VideoCard from '../../components/common/VideoCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { PlayCircle, AlertCircle, ArrowRight, BookOpen } from 'lucide-react';
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
        setVideos(Array.isArray(allVideosRes.data.videos) ? allVideosRes.data.videos : []);

        // If user is approved, fetch which ones they have access to
        if (user && isApproved) {
          const myVideosRes = await getMyVideos();
          const accessSet = new Set((Array.isArray(myVideosRes.data.videos) ? myVideosRes.data.videos : []).map(v => v._id));
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
    <div className="classes-page container min-h-screen">
      <header className="classes-masthead">
        <div>
          <p className="classes-kicker"><BookOpen size={15} /> LEARNING LIBRARY</p>
          <h1>Trading Classes</h1>
          <p className="classes-lede">
            Build your market knowledge with structured masterclasses, from technical foundations to practical strategy.
          </p>
        </div>
        <div className="classes-summary">
          <strong>{videos.length}</strong>
          <span>{videos.length === 1 ? 'class available' : 'classes available'}</span>
        </div>
      </header>

      {/* Pending Account Warning */}
      {user && !isApproved && !isAdmin && (
        <div className="classes-notice classes-notice-warning">
          <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={24} />
          <div>
            <h2>Account Pending Approval</h2>
            <p className="text-secondary text-sm">
              Your account is currently waiting for administrator approval. You will not be able to watch protected videos until your account is fully verified.
            </p>
          </div>
        </div>
      )}

      {/* Guest Warning */}
      {!user && (
        <div className="classes-notice classes-notice-info">
          <div className="flex items-center gap-4">
            <AlertCircle className="text-blue-500 shrink-0" size={24} />
            <div>
              <h2>Unlock the full library</h2>
              <p className="text-secondary text-sm">Log in with an approved account to watch protected classes.</p>
            </div>
          </div>
          <div className="classes-notice-actions">
            <Link to="/login" className="btn-secondary !py-2 !px-4 !text-sm">Login <ArrowRight size={15} /></Link>
            <Link to="/signup" className="btn-primary !py-2 !px-4 !text-sm">Create account <ArrowRight size={15} /></Link>
          </div>
        </div>
      )}

      <section className="classes-library" aria-labelledby="available-classes-heading">
        <div className="classes-section-heading">
          <div>
            <p className="classes-section-kicker">START LEARNING</p>
            <h2 id="available-classes-heading">Available classes</h2>
          </div>
          <span>New lessons are added regularly</span>
        </div>

      {videos.length === 0 ? (
        <div className="classes-empty-state">
          <PlayCircle className="mx-auto text-muted mb-4 opacity-50" size={64} />
          <h3>No classes available yet.</h3>
          <p className="text-muted mt-2">Check back later for new content.</p>
        </div>
      ) : (
        <div className="classes-grid">
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
      </section>
    </div>
  );
};

export default Classes;
