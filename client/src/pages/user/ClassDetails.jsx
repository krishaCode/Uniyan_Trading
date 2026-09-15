import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getVideoById } from '../../services/videoService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Calendar, Clock, User, ArrowLeft, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const ClassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const { data } = await getVideoById(id);
        setVideo(data.video);
      } catch (error) {
        toast.error('Access denied or video not found');
        navigate('/classes');
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id, navigate]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (!video) return null;

  const formattedDate = video.classDate ? new Date(video.classDate).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric'
  }) : 'TBA';

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
      <Link to="/classes" className="inline-flex items-center gap-2 text-secondary hover:text-blue-500 mb-6 transition-colors">
        <ArrowLeft size={20} /> Back to Classes
      </Link>

      <div className="bg-card border border-theme rounded-2xl overflow-hidden shadow-theme">
        {/* Video Player */}
        <div className="relative w-full aspect-video bg-black">
          {video.embedUrl ? (
            <iframe
              src={`${video.embedUrl}?autoplay=1&rel=0`}
              title={video.title}
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-secondary">
              Video link is invalid or missing.
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="p-6 lg:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <div className="inline-block px-3 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full text-sm font-bold mb-3">
                Class {String(video.classNumber).padStart(2, '0')}
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-primary">{video.title}</h1>
            </div>
            
            <div className="flex items-center gap-2 text-muted bg-primary px-4 py-2 rounded-xl border border-theme">
              <Eye size={18} />
              <span className="font-medium text-sm">{video.views} views</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 py-4 border-y border-theme mb-6 text-sm text-secondary">
            <div className="flex items-center gap-2">
              <User size={18} className="text-blue-500" />
              <span>Instructor: <strong className="text-primary">{video.instructor}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-blue-500" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-blue-500" />
              <span>{video.startTime} ({video.duration})</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-primary mb-3">Class Description</h3>
            <p className="text-secondary leading-relaxed whitespace-pre-wrap">
              {video.description || 'No detailed description provided for this class.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetails;
