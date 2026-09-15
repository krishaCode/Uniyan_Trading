import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createVideo, updateVideo } from '../../services/videoService';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';

const VideoForm = ({ video, onClose }) => {
  const isEditing = !!video;
  const [loading, setLoading] = useState(false);
  const [previewId, setPreviewId] = useState(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: video ? {
      ...video,
      classDate: video.classDate ? new Date(video.classDate).toISOString().split('T')[0] : ''
    } : {
      instructor: 'TradNex Instructor',
      status: 'published'
    }
  });

  const youtubeUrl = watch('youtubeUrl');

  useEffect(() => {
    if (youtubeUrl) {
      const match = youtubeUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
      setPreviewId(match ? match[1] : null);
    } else {
      setPreviewId(null);
    }
  }, [youtubeUrl]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEditing) {
        await updateVideo(video._id, data);
        toast.success('Video updated successfully');
      } else {
        await createVideo(data);
        toast.success('Video created successfully');
      }
      onClose(true); // true indicates refresh needed
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={() => onClose(false)} title={isEditing ? 'Edit Video / Class' : 'Add New Video'} maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1">
            <label className="block text-xs font-medium text-secondary mb-1">Class No.*</label>
            <input type="number" className={`input-field ${errors.classNumber ? 'border-red-500' : ''}`} {...register('classNumber', { required: true, valueAsNumber: true })} />
          </div>
          <div className="col-span-3">
            <label className="block text-xs font-medium text-secondary mb-1">Video Title*</label>
            <input type="text" className={`input-field ${errors.title ? 'border-red-500' : ''}`} {...register('title', { required: true })} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-secondary mb-1">YouTube URL*</label>
          <input type="url" placeholder="https://youtube.com/watch?v=..." className={`input-field ${errors.youtubeUrl ? 'border-red-500' : ''}`} {...register('youtubeUrl', { required: true })} />
        </div>

        {/* YouTube Preview */}
        {previewId && (
          <div className="w-full aspect-video rounded-xl overflow-hidden bg-black border border-theme shadow-inner my-2">
            <iframe
              src={`https://www.youtube.com/embed/${previewId}`}
              className="w-full h-full"
              allowFullScreen
            ></iframe>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-secondary mb-1">Description</label>
          <textarea rows="3" className="input-field resize-none" {...register('description')}></textarea>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-secondary mb-1">Date</label>
            <input type="date" className="input-field" {...register('classDate')} />
          </div>
          <div>
            <label className="block text-xs font-medium text-secondary mb-1">Start Time</label>
            <input type="text" placeholder="e.g. 7:00 PM" className="input-field" {...register('startTime')} />
          </div>
          <div>
            <label className="block text-xs font-medium text-secondary mb-1">Duration</label>
            <input type="text" placeholder="e.g. 1h 30m" className="input-field" {...register('duration')} />
          </div>
          <div>
            <label className="block text-xs font-medium text-secondary mb-1">Status</label>
            <select className="input-field" {...register('status')}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="unpublished">Unpublished</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-secondary mb-1">Instructor</label>
          <input type="text" className="input-field" {...register('instructor')} />
        </div>

        <div className="pt-4 border-t border-theme flex justify-end gap-3 mt-6">
          <button type="button" onClick={() => onClose(false)} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary min-w-[120px]">
            {loading ? <Loader className="animate-spin mx-auto" size={18} /> : isEditing ? 'Save Changes' : 'Publish Video'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default VideoForm;
