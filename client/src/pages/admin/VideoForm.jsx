import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createVideo, updateVideo } from '../../services/videoService';
import toast, { Toaster } from 'react-hot-toast';
import {
  ArrowLeft,
  BadgeCheck,
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
    <div className="video-editor-page">
      <Toaster position="top-right" />
      <header className="video-editor-header">
        <button type="button" className="video-editor-back" onClick={() => onClose(false)}>
          <ArrowLeft size={17} />
          <span>Back to video library</span>
        </button>
        <div className="video-editor-heading-row">
          <div className="video-editor-heading">
            <p className="video-editor-breadcrumb">CONTENT LIBRARY <span>/</span> {isEditing ? 'EDIT CLASS' : 'NEW CLASS'}</p>
            <h1>{isEditing ? 'Edit video class' : 'Create a new class'}</h1>
            <p>{isEditing ? 'Update your lesson details and publishing settings.' : 'Build a clear, engaging lesson for your students.'}</p>
          </div>
          <div className="video-editor-step">
            <span><Sparkles size={15} /></span>
            <div><strong>CLASS SETUP</strong><small>Details &amp; publishing</small></div>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="video-editor-form">
        <div className="video-editor-layout">
          <div className="video-editor-main">
            <section className="video-editor-card">
              <div className="video-editor-card-heading">
                <span className="video-editor-card-icon"><Film size={17} /></span>
                <div>
                  <h2>Lesson information</h2>
                  <p>Start with the essentials learners need to find your class.</p>
                </div>
                <span className="video-editor-section-number">01</span>
              </div>

              <div className="video-editor-title-row">
                <div className="video-editor-class-number">
                  <label htmlFor="video-class-number">Class number <span>*</span></label>
                  <input
                    id="video-class-number"
                    type="number"
                    min="1"
                    placeholder="01"
                    aria-invalid={!!errors.classNumber}
                    className={`input-field ${errors.classNumber ? 'video-editor-input-error' : ''}`}
                    {...register('classNumber', { required: 'Class number is required', valueAsNumber: true, min: 1 })}
                  />
                  {errors.classNumber && <small className="video-editor-error">{errors.classNumber.message || 'Enter a valid class number'}</small>}
                </div>
                <div className="video-editor-title">
                  <label htmlFor="video-title">Video title <span>*</span></label>
                  <input
                    id="video-title"
                    type="text"
                    placeholder="e.g. Reading market structure"
                    aria-invalid={!!errors.title}
                    className={`input-field ${errors.title ? 'video-editor-input-error' : ''}`}
                    {...register('title', { required: 'A video title is required' })}
                  />
                  {errors.title && <small className="video-editor-error">{errors.title.message}</small>}
                </div>
              </div>

              <div className="video-editor-field">
                <label htmlFor="video-youtube-url">YouTube video link <span>*</span></label>
                <div className={`video-editor-url ${errors.youtubeUrl ? 'has-error' : ''}`}>
                  <Link2 size={17} />
                  <input
                    id="video-youtube-url"
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    aria-invalid={!!errors.youtubeUrl}
                    {...register('youtubeUrl', { required: 'A YouTube link is required' })}
                  />
                  {previewId && <Check size={16} className="video-editor-valid" />}
                </div>
                {errors.youtubeUrl && <small className="video-editor-error">{errors.youtubeUrl.message}</small>}
                <small className="video-editor-hint">A preview will appear on the right when the link is recognized.</small>
              </div>

              <div className="video-editor-field">
                <label htmlFor="video-description">Class description <span className="video-editor-optional">OPTIONAL</span></label>
                <textarea
                  id="video-description"
                  rows="4"
                  placeholder="Outline the key concepts covered in this class..."
                  className="input-field resize-none"
                  {...register('description')}
                />
              </div>
            </section>

            <section className="video-editor-card">
              <div className="video-editor-card-heading">
                <span className="video-editor-card-icon"><CalendarDays size={17} /></span>
                <div>
                  <h2>Schedule &amp; instructor</h2>
                  <p>Choose when this class takes place and who leads it.</p>
                </div>
                <span className="video-editor-section-number">02</span>
              </div>

              <div className="video-editor-schedule-grid">
                <div>
                  <label htmlFor="video-date">Class date</label>
                  <input id="video-date" type="date" className="input-field" {...register('classDate')} />
                </div>
                <div>
                  <label htmlFor="video-start-time">Start time</label>
                  <div className="video-editor-icon-input">
                    <Clock3 size={15} />
                    <input id="video-start-time" type="text" placeholder="7:00 PM" {...register('startTime')} />
                  </div>
                </div>
                <div>
                  <label htmlFor="video-duration">Duration</label>
                  <input id="video-duration" type="text" placeholder="1h 30m" className="input-field" {...register('duration')} />
                </div>
                <div>
                  <label htmlFor="video-instructor">Instructor</label>
                  <input id="video-instructor" type="text" placeholder="Instructor name" className="input-field" {...register('instructor')} />
                </div>
              </div>
            </section>

            <section className="video-editor-card video-editor-publishing">
              <div className="video-editor-card-heading">
                <span className="video-editor-card-icon"><BadgeCheck size={17} /></span>
                <div>
                  <h2>Publishing</h2>
                  <p>Control the visibility of this class in your library.</p>
                </div>
                <span className="video-editor-section-number">03</span>
              </div>
              <div className="video-editor-publish-row">
                <div>
                  <strong>Class visibility</strong>
                  <p>Published classes are available to learners.</p>
                </div>
                <select id="video-status" aria-label="Class visibility" className="input-field" {...register('status')}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="unpublished">Unpublished</option>
                </select>
              </div>
            </section>
          </div>

          <aside className="video-editor-aside">
            <section className="video-editor-preview-card">
              <div className="video-editor-preview-heading">
                <div><span className="video-editor-live-dot" /> LIVE PREVIEW</div>
                <CirclePlay size={18} />
              </div>
              <div className="video-editor-preview-frame">
                {previewId ? (
                  <iframe
                    title={videoTitle ? `${videoTitle} video preview` : 'YouTube video preview'}
                    src={`https://www.youtube.com/embed/${previewId}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="video-editor-preview-empty">
                    <span><CirclePlay size={26} /></span>
                    <strong>Preview coming up</strong>
                    <small>Paste a YouTube link to see your class video here.</small>
                  </div>
                )}
              </div>
              <div className="video-editor-preview-details">
                <span>{classNumber ? `CLASS ${String(classNumber).padStart(2, '0')}` : 'NEW CLASS'}</span>
                <h3>{videoTitle || 'Your lesson title'}</h3>
                <p>{watch('instructor') || 'Instructor name'}</p>
              </div>
            </section>

            <section className="video-editor-tip">
              <span><Sparkles size={16} /></span>
              <div>
                <strong>Make it easy to find</strong>
                <p>Use a specific title and add a short description so students know what they’ll learn.</p>
              </div>
            </section>
          </aside>
        </div>

        <footer className="video-editor-footer">
          <div className="video-editor-save-note"><Check size={15} /><span>Your changes will appear in the video library.</span></div>
          <div className="video-editor-actions">
            <button type="button" onClick={() => onClose(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary video-editor-submit">
              {loading ? <Loader className="animate-spin" size={17} /> : <Film size={16} />}
              {loading ? 'Saving...' : isEditing ? 'Save changes' : 'Publish video'}
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
};

export default VideoForm;
