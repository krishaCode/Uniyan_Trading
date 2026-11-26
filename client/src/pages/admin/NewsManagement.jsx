import { useState, useEffect } from 'react';
import { getNews, createNews, updateNews, deleteNews } from '../../services/newsService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  Edit,
  EyeOff,
  Globe,
  Image as ImageIcon,
  Loader,
  Newspaper,
  Plus,
  Sparkles,
  Trash2
} from 'lucide-react';

const NewsForm = ({ article, onClose }) => {
  const isEditing = !!article;
  const [loading, setLoading] = useState(false);
  const [previewImageError, setPreviewImageError] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: article || { published: true, category: 'Announcement' }
  });

  const title = watch('title');
  const content = watch('content');
  const image = watch('image');
  const category = watch('category');
  const published = watch('published');
  const isPublished = published === true || published === 'true';
  const imageField = register('image');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEditing) {
        await updateNews(article._id, data);
        toast.success('News updated');
      } else {
        await createNews(data);
        toast.success('News published');
      }
      onClose(true);
    } catch (error) {
      toast.error('Failed to save news');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="video-editor-page news-editor-page">
      <Toaster position="top-right" />
      <header className="video-editor-header">
        <button type="button" className="video-editor-back" onClick={() => onClose(false)}>
          <ArrowLeft size={17} />
          <span>Back to news library</span>
        </button>
        <div className="video-editor-heading-row">
          <div className="video-editor-heading">
            <p className="video-editor-breadcrumb">EDITORIAL DESK <span>/</span> {isEditing ? 'EDIT ARTICLE' : 'NEW ARTICLE'}</p>
            <h1>{isEditing ? 'Edit news article' : 'Create a news article'}</h1>
            <p>{isEditing ? 'Update the story details and publishing settings.' : 'Share a clear, engaging update with your learners.'}</p>
          </div>
          <div className="video-editor-step">
            <span><Sparkles size={15} /></span>
            <div><strong>ARTICLE SETUP</strong><small>Story &amp; publishing</small></div>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="video-editor-form">
        <div className="video-editor-layout">
          <div className="video-editor-main">
            <section className="video-editor-card">
              <div className="video-editor-card-heading">
                <span className="video-editor-card-icon"><Newspaper size={17} /></span>
                <div>
                  <h2>Article details</h2>
                  <p>Write the headline and story your learners will read.</p>
                </div>
                <span className="video-editor-section-number">01</span>
              </div>

              <div className="video-editor-field">
                <label htmlFor="news-title">Headline <span>*</span></label>
                <input
                  id="news-title"
                  type="text"
                  placeholder="Write a clear, engaging headline"
                  aria-invalid={!!errors.title}
                  className={`input-field ${errors.title ? 'video-editor-input-error' : ''}`}
                  {...register('title', { required: 'A headline is required' })}
                />
                {errors.title && <small className="video-editor-error">{errors.title.message}</small>}
              </div>

              <div className="video-editor-field">
                <label htmlFor="news-content">Article content <span>*</span></label>
                <textarea
                  id="news-content"
                  rows="10"
                  placeholder="Write your news, course update, or market insight..."
                  aria-invalid={!!errors.content}
                  className={`input-field resize-none ${errors.content ? 'video-editor-input-error' : ''}`}
                  {...register('content', { required: 'Article content is required' })}
                />
                {errors.content && <small className="video-editor-error">{errors.content.message}</small>}
                <small className="video-editor-hint">Keep paragraphs focused and easy to scan.</small>
              </div>
            </section>

            <section className="video-editor-card">
              <div className="video-editor-card-heading">
                <span className="video-editor-card-icon"><ImageIcon size={17} /></span>
                <div>
                  <h2>Cover image</h2>
                  <p>Add a visual to help your article stand out in the news feed.</p>
                </div>
                <span className="video-editor-section-number">02</span>
              </div>
              <div className="video-editor-field">
                <label htmlFor="news-image">Image URL <span className="video-editor-optional">OPTIONAL</span></label>
                <input
                  id="news-image"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className="input-field"
                  {...imageField}
                  onChange={(event) => {
                    setPreviewImageError(false);
                    imageField.onChange(event);
                  }}
                />
                <small className="video-editor-hint">Paste a direct image link to preview the article cover.</small>
              </div>
            </section>

            <section className="video-editor-card">
              <div className="video-editor-card-heading">
                <span className="video-editor-card-icon"><BadgeCheck size={17} /></span>
                <div>
                  <h2>Category &amp; publishing</h2>
                  <p>Organize your update and set its visibility.</p>
                </div>
                <span className="video-editor-section-number">03</span>
              </div>
              <div className="video-editor-schedule-grid">
                <div>
                  <label htmlFor="news-category">Category</label>
                  <select id="news-category" className="input-field" {...register('category')}>
                    <option value="Trading News">Trading News</option>
                    <option value="Course Update">Course Update</option>
                    <option value="Platform News">Platform News</option>
                    <option value="Market Analysis">Market Analysis</option>
                    <option value="Announcement">Announcement</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="news-status">Visibility</label>
                  <select id="news-status" className="input-field" {...register('published')}>
                    <option value="true">Published</option>
                    <option value="false">Draft</option>
                  </select>
                </div>
              </div>
            </section>
          </div>

          <aside className="video-editor-aside">
            <section className="video-editor-preview-card">
              <div className="video-editor-preview-heading">
                <div><span className="video-editor-live-dot" /> ARTICLE PREVIEW</div>
                <Newspaper size={18} />
              </div>
              <div className={`news-editor-preview-image ${image && !previewImageError ? 'has-image' : ''}`}>
                {image && !previewImageError ? (
                  <img
                    src={image}
                    alt=""
                    onError={() => setPreviewImageError(true)}
                  />
                ) : (
                  <div className="news-editor-image-empty">
                    <span><ImageIcon size={25} /></span>
                    <strong>{previewImageError ? 'Image could not be loaded' : 'Your cover image goes here'}</strong>
                    <small>{previewImageError ? 'Check the image URL and try again.' : 'Add an image URL to preview your article.'}</small>
                  </div>
                )}
                <span className="news-editor-category">{category || 'Announcement'}</span>
              </div>
              <div className="video-editor-preview-details">
                <span>{category || 'ANNOUNCEMENT'}</span>
                <h3>{title || 'Your article headline'}</h3>
                <p>{content || 'Your story preview will appear here as you write.'}</p>
              </div>
              <div className={`news-editor-preview-status ${isPublished ? 'is-published' : 'is-draft'}`}>
                {isPublished ? <Globe size={14} /> : <EyeOff size={14} />}
                <span>{isPublished ? 'Ready to publish' : 'Saved as draft'}</span>
              </div>
            </section>

            <section className="video-editor-tip">
              <span><Sparkles size={16} /></span>
              <div>
                <strong>Make it reader-friendly</strong>
                <p>Lead with the most important update, then add context in short, focused paragraphs.</p>
              </div>
            </section>
          </aside>
        </div>

        <footer className="video-editor-footer">
          <div className="video-editor-save-note"><Check size={15} /><span>Your article will appear in News &amp; Updates.</span></div>
          <div className="video-editor-actions">
            <button type="button" onClick={() => onClose(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary video-editor-submit">
              {loading ? <Loader className="animate-spin" size={17} /> : <Newspaper size={16} />}
              {loading ? 'Saving...' : isEditing ? 'Save changes' : isPublished ? 'Publish article' : 'Save draft'}
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
};

const NewsManagement = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchNews = async () => {
    try {
      const { data } = await getNews({ limit: 100 });
      setNewsList(data.news);
    } catch (error) {
      toast.error('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      await deleteNews(id);
      toast.success('Article deleted');
      fetchNews();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const toggleStatus = async (article) => {
    try {
      await updateNews(article._id, { published: !article.published });
      toast.success(article.published ? 'Unpublished' : 'Published');
      fetchNews();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleCloseForm = (shouldRefresh) => {
    setIsFormOpen(false);
    setEditingArticle(null);
    if (shouldRefresh) fetchNews();
  };

  if (isFormOpen) {
    return <NewsForm article={editingArticle} onClose={handleCloseForm} />;
  }

  return (
    <div className="admin-news-page">
      <Toaster position="top-right" />

      <div className="admin-news-heading">
        <div>
          <p className="dashboard-kicker">EDITORIAL DESK</p>
          <h1>News &amp; Updates</h1>
          <p>Publish announcements, course updates, and market information for your learners.</p>
        </div>
        <div className="admin-news-heading-actions">
          <div className="admin-news-summary"><strong>{newsList.length}</strong><span>total articles</span></div>
          <button onClick={() => { setEditingArticle(null); setIsFormOpen(true); }} className="btn-primary">
            <Plus size={18} /> Create news
          </button>
        </div>
      </div>

      <div className="admin-news-grid">
        {loading ? <LoadingSpinner fullScreen={false} /> : newsList.map(article => (
          <article key={article._id} className="admin-news-card">
            
            <div className="admin-news-media">
              <img src={article.image || `https://source.unsplash.com/random/400x200?sig=${article._id}`} alt="" onError={e => e.target.src='https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400'}/>
              <span>{article.category}</span>
              <div className="admin-news-card-actions">
                <button onClick={() => { setEditingArticle(article); setIsFormOpen(true); }} className="admin-news-action admin-news-edit" title="Edit article"><Edit size={15}/></button>
                <button onClick={() => handleDelete(article._id)} className="admin-news-action admin-news-delete" title="Delete article"><Trash2 size={15}/></button>
              </div>
            </div>
            <div className="admin-news-card-body">
              <h2>{article.title}</h2>
              <p>{article.excerpt || article.content.substring(0, 100)}</p>
              
              <div className="admin-news-card-footer">
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                <button 
                  onClick={() => toggleStatus(article)} 
                  className={`admin-news-status ${article.published ? 'published' : 'draft'}`}
                >
                  {article.published ? <Globe size={14} /> : <EyeOff size={14} />}
                  {article.published ? 'Published' : 'Draft'}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default NewsManagement;
