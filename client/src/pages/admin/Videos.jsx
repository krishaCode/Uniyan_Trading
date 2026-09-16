import { useState, useEffect } from 'react';
import { getVideos, deleteVideo } from '../../services/videoService';
import VideoForm from './VideoForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Edit, Trash2, Eye, ExternalLink } from 'lucide-react';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);

  const fetchVideos = async () => {
    try {
      const { data } = await getVideos({ limit: 100 });
      setVideos(data.videos);
    } catch (error) {
      toast.error('Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await deleteVideo(id);
      toast.success('Video deleted successfully');
      fetchVideos();
    } catch (error) {
      toast.error('Failed to delete video');
    }
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
    setIsFormOpen(true);
  };

  const handleCloseForm = (shouldRefresh) => {
    setIsFormOpen(false);
    setEditingVideo(null);
    if (shouldRefresh) fetchVideos();
  };

  return (
    <div className="admin-videos-page">
      <Toaster position="top-right" />
      
      {isFormOpen && <VideoForm video={editingVideo} onClose={handleCloseForm} />}

      <div className="videos-page-heading">
        <div>
          <p className="dashboard-kicker">CONTENT LIBRARY</p>
          <h1>Video &amp; class management</h1>
          <p>Organize lessons, publish recordings, and keep the learning library up to date.</p>
        </div>
        <div className="videos-heading-actions">
          <div className="videos-summary"><strong>{videos.length}</strong><span>total classes</span></div>
          <button onClick={() => { setEditingVideo(null); setIsFormOpen(true); }} className="btn-primary videos-add-button">
          <Plus size={18} /> Add New Video
          </button>
        </div>
      </div>

      <div className="videos-table-panel">
        <div className="videos-table-heading">
          <div><h2>Published library</h2><p>Review class details, availability, and performance at a glance.</p></div>
          <span>{loading ? 'Updating...' : `${videos.length} classes`}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table videos-table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Video Info</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Views</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8"><LoadingSpinner /></td>
                </tr>
              ) : videos.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-secondary">No videos found. Click "Add New Video" to create one.</td>
                </tr>
              ) : (
                videos.map((video) => (
                  <tr key={video._id}>
                    <td>
                      <span className="video-class-badge">
                        C{String(video.classNumber).padStart(2, '0')}
                      </span>
                    </td>
                    <td>
                      <div className="video-info-cell">
                        <img src={video.thumbnail} alt="" className="video-thumbnail" />
                        <div className="video-info-copy">
                          <div className="video-title">{video.title}</div>
                          <div className="video-instructor">
                            {video.instructor} <a href={video.youtubeUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline"><ExternalLink size={10} /></a>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm text-secondary">
                      {video.classDate ? new Date(video.classDate).toLocaleDateString() : 'TBA'} <br/>
                      <span className="text-xs text-muted">{video.startTime || '--'} ({video.duration || '--'})</span>
                    </td>
                    <td>
                      <span className={`badge-${video.status}`}>{video.status.toUpperCase()}</span>
                    </td>
                    <td className="text-sm">
                      <div className="video-views">
                        <Eye size={14} className="text-muted" /> {video.views}
                      </div>
                    </td>
                    <td>
                      <div className="videos-row-actions">
                        <button onClick={() => handleEdit(video)} className="videos-action videos-action-edit" title="Edit class">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(video._id, video.title)} className="videos-action videos-action-delete" title="Delete class">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Videos;
