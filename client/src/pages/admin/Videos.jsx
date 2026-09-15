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
    <div className="space-y-6">
      <Toaster position="top-right" />
      
      {isFormOpen && <VideoForm video={editingVideo} onClose={handleCloseForm} />}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Video / Class Management</h1>
          <p className="text-secondary text-sm">Add and manage YouTube class recordings.</p>
        </div>
        <button onClick={() => { setEditingVideo(null); setIsFormOpen(true); }} className="btn-primary">
          <Plus size={18} /> Add New Video
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
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
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-500 font-bold rounded-lg text-sm border border-blue-500/20">
                        C{String(video.classNumber).padStart(2, '0')}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <img src={video.thumbnail} alt="" className="w-16 h-10 object-cover rounded shadow-sm border border-theme" />
                        <div>
                          <div className="font-semibold text-primary text-sm line-clamp-1">{video.title}</div>
                          <div className="text-xs text-muted flex items-center gap-1">
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
                      <div className="flex items-center gap-1.5 text-secondary">
                        <Eye size={14} className="text-muted" /> {video.views}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(video)} className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors" title="Edit">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(video._id, video.title)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
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
