import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createVideo, updateVideo } from '../../services/videoService';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import {
  CalendarDays,
  Check,
  CirclePlay,
  Clock3,
  Film,
  Link2,
  Loader,
  Sparkles
} from 'lucide-react';

const VideoForm = ({ video, onClose }) => {
  const isEditing = !!video;
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: video ? {
      ...video,
      classDate: video.classDate ? new Date(video.classDate).toISOString().split('T')[0] : ''
    } : {
      instructor: 'TradNex Instructor',
      status: 'published'
    }
  });

  const youtubeUrl = watch('youtubeUrl');
  const videoTitle = watch('title');
  const classNumber = watch('classNumber');
  const [previewId, setPreviewId] = useState(null);

  useEffect(() => {
    if (youtubeUrl) {
      const match = youtubeUrl.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i);
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
      onClose(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={() => onClose(false)} title={isEditing ? 'Edit Video / Class' : 'Add New Video'} maxWidth="max-w-5xl">
      <form onSubmit={handleSubmit(onSubmit)} className="video-studio-form">
        <div className="video-studio-intro">
          <div className="video-studio-icon"><Sparkles size={18} /></div>
          <div>
            <p className="video-studio-eyebrow">{isEditing ? 'UPDATE YOUR LIBRARY' : 'CONTENT STUDIO'}</p>
            <p className="video-studio-subtitle">
              {isEditing ? 'Refresh the details learners see in your library.' : 'Add a polished lesson to your learning library.'}
            </p>
          </div>
        </div>

        <div className="video-studio-layout">
          <div className="video-studio-fields">
            <section className="video-studio-section">
              <div className="video-studio-section-heading">
                <span className="video-studio-section-icon"><Film size={16} /></span>
                <div>
                  <h4>Lesson details</h4>
                  <p>Give this class a clear title and place in the course.</p>
                </div>
              </div>

              <div className="video-studio-two-fields">
                <div className="video-studio-class-number">
                  <label htmlFor="video-class-number">Class number <span>*</span></label>
                  <input
                    id="video-class-number"
                    type="number"
                    min="1"
                    placeholder="01"
                    aria-invalid={!!errors.classNumber}
                    className={`input-field ${errors.classNumber ? 'video-studio-input-error' : ''}`}
                    {...register('classNumber', { required: 'Class number is required', valueAsNumber: true, min: 1 })}
                  />
                  {errors.classNumber && <small className="video-studio-error">{errors.classNumber.message || 'Enter a valid class number'}</small>}
                </div>
                <div>
                  <label htmlFor="video-title">Video title <span>*</span></label>
                  <input
                    id="video-title"
                    type="text"
                    placeholder="e.g. Reading market structure"
                    aria-invalid={!!errors.title}
                    className={`input-field ${errors.title ? 'video-studio-input-error' : ''}`}
                    {...register('title', { required: 'A video title is required' })}
                  />
                  {errors.title && <small className="video-studio-error">{errors.title.message}</small>}
                </div>
              </div>

              <div className="video-studio-field">
                <label htmlFor="video-youtube-url">YouTube link <span>*</span></label>
                <div className={`video-studio-url-wrap ${errors.youtubeUrl ? 'has-error' : ''}`}>
                  <Link2 size={17} />
                  <input
                    id="video-youtube-url"
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    aria-invalid={!!errors.youtubeUrl}
                    {...register('youtubeUrl', { required: 'A YouTube link is required' })}
                  />
                  {previewId && <Check size={16} className="video-studio-url-valid" />}
                </div>
                {errors.youtubeUrl && <small className="video-studio-error">{errors.youtubeUrl.message}</small>}
                <small className="video-studio-hint">Paste a YouTube video or youtu.be link to generate a preview.</small>
              </div>

              <div className="video-studio-field">
                <label htmlFor="video-description">Description <span className="optional-label">Optional</span></label>
                <textarea
                  id="video-description"
                  rows="3"
                  placeholder="What will learners take away from this class?"
                  className="input-field resize-none"
                  {...register('description')}
                />
              </div>
            </section>

            <section className="video-studio-section video-studio-schedule">
              <div className="video-studio-section-heading">
                <span className="video-studio-section-icon"><CalendarDays size={16} /></span>
                <div>
                  <h4>Schedule &amp; visibility</h4>
                  <p>Set the class timing and choose who can see it.</p>
                </div>
              </div>

              <div className="video-studio-meta-grid">
                <div>
                  <label htmlFor="video-date">Class date</label>
                  <input id="video-date" type="date" className="input-field" {...register('classDate')} />
                </div>
                <div>
                  <label htmlFor="video-start-time">Start time</label>
                  <div className="video-studio-input-icon">
                    <Clock3 size={15} />
                    <input id="video-start-time" type="text" placeholder="7:00 PM" {...register('startTime')} />
                  </div>
                </div>
                <div>
                  <label htmlFor="video-duration">Duration</label>
                  <input id="video-duration" type="text" placeholder="1h 30m" className="input-field" {...register('duration')} />
                </div>
                <div>
                  <label htmlFor="video-status">Status</label>
                  <select id="video-status" className="input-field" {...register('status')}>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="unpublished">Unpublished</option>
                  </select>
                </div>
              </div>

              <div className="video-studio-field">
                <label htmlFor="video-instructor">Instructor</label>
                <input id="video-instructor" type="text" placeholder="Instructor name" className="input-field" {...register('instructor')} />
              </div>
            </section>
          </div>

          <aside className="video-studio-preview-panel">
            <div className="video-studio-preview-heading">
              <div>
                <p className="video-studio-eyebrow">LIVE PREVIEW</p>
                <h4>Video preview</h4>
              </div>
              <CirclePlay size={19} />
            </div>
            <div className="video-studio-preview-frame">
              {previewId ? (
                <iframe
                  title={videoTitle ? `${videoTitle} video preview` : 'YouTube video preview'}
                  src={`https://www.youtube.com/embed/${previewId}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="video-studio-preview-empty">
                  <span><CirclePlay size={27} /></span>
                  <strong>Your preview appears here</strong>
                  <small>Add a valid YouTube link to see it.</small>
                </div>
              )}
            </div>
            <div className="video-studio-preview-copy">
              <span className="video-studio-preview-class">
                {classNumber ? `CLASS ${String(classNumber).padStart(2, '0')}` : 'NEW CLASS'}
              </span>
              <h5>{videoTitle || 'Your lesson title'}</h5>
              <p>Preview of how this lesson is organized in your library.</p>
            </div>
            <div className="video-studio-preview-note">
              <Check size={14} />
              <span>Changes are saved to your video library.</span>
            </div>
          </aside>
        </div>

        <div className="video-studio-actions">
          <button type="button" onClick={() => onClose(false)} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary video-studio-submit">
            {loading ? <Loader className="animate-spin" size={17} /> : <Film size={16} />}
            {loading ? 'Saving...' : isEditing ? 'Save changes' : 'Publish video'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default VideoForm;
